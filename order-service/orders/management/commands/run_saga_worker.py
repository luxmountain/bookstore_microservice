import logging

import requests
from django.core.management.base import BaseCommand

from orders.event_bus import publish, rpc_call
from orders.models import Order

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Run order saga orchestrator worker"

    def handle(self, *args, **options):
        from orders.event_bus import _connection

        connection = _connection()
        channel = connection.channel()
        channel.queue_declare(queue="order.saga.start", durable=True)

        self.stdout.write(self.style.SUCCESS("Order Saga worker started..."))

        def process_start(ch, method, props, body):
            import json

            payload = json.loads(body)
            order_id = payload.get("order_id")

            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return

            payment_result = rpc_call(
                "payment.reserve",
                {
                    "order_id": order.id,
                    "customer_id": order.customer_id,
                    "amount": str(order.total_amount),
                    "method": order.payment_method,
                    "simulate_failure": payload.get("simulate_payment_failure", False),
                },
                timeout_seconds=10,
            )

            if not payment_result.get("success"):
                order.status = "cancelled"
                order.save(update_fields=["status", "updated_at"])
                publish("order.saga.failed", {"order_id": order.id, "reason": "payment_failed"})
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return

            shipping_result = rpc_call(
                "shipping.reserve",
                {
                    "order_id": order.id,
                    "customer_id": order.customer_id,
                    "address": order.shipping_address,
                    "method": order.shipping_method,
                    "simulate_failure": payload.get("simulate_shipping_failure", False),
                },
                timeout_seconds=10,
            )

            if not shipping_result.get("success"):
                rpc_call(
                    "payment.compensate",
                    {
                        "payment_id": payment_result.get("payment_id"),
                        "order_id": order.id,
                    },
                    timeout_seconds=8,
                )
                order.status = "cancelled"
                order.save(update_fields=["status", "updated_at"])
                publish("order.saga.failed", {"order_id": order.id, "reason": "shipping_failed"})
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return

            order.payment_id = payment_result.get("payment_id")
            order.shipping_id = shipping_result.get("shipping_id")
            order.status = "confirmed"
            order.save(update_fields=["payment_id", "shipping_id", "status", "updated_at"])

            self._post_confirm_side_effects(payload)
            publish("order.saga.completed", {"order_id": order.id})
            ch.basic_ack(delivery_tag=method.delivery_tag)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue="order.saga.start", on_message_callback=process_start)
        channel.start_consuming()

    def _post_confirm_side_effects(self, payload):
        cart_service_url = payload.get("cart_service_url")
        book_service_url = payload.get("book_service_url")
        customer_id = payload.get("customer_id")

        if cart_service_url and customer_id:
            try:
                requests.delete(
                    f"{cart_service_url}/api/carts/clear/",
                    params={"customer_id": customer_id},
                    timeout=5,
                )
            except requests.RequestException:
                logger.warning("Failed to clear cart for customer_id=%s", customer_id)

        if book_service_url:
            for item in payload.get("items", []):
                try:
                    requests.post(
                        f"{book_service_url}/api/books/{item['book_id']}/update_stock/",
                        json={"quantity": -item["quantity"]},
                        timeout=5,
                    )
                except requests.RequestException:
                    logger.warning("Failed to update stock for book_id=%s", item.get("book_id"))
