import json

import pika
from django.core.management.base import BaseCommand

from shipping.event_bus import get_connection
from shipping.models import Shipment


class Command(BaseCommand):
    help = "Run shipping event worker"

    def handle(self, *args, **options):
        connection = get_connection()
        channel = connection.channel()
        channel.queue_declare(queue="shipping.reserve", durable=True)
        channel.queue_declare(queue="shipping.compensate", durable=True)

        self.stdout.write(self.style.SUCCESS("Shipping worker started..."))

        def _send_response(ch, props, payload):
            if props.reply_to:
                ch.basic_publish(
                    exchange="",
                    routing_key=props.reply_to,
                    body=json.dumps(payload),
                    properties=pika.BasicProperties(correlation_id=props.correlation_id),
                )

        def on_reserve(ch, method, props, body):
            payload = json.loads(body)
            simulate_failure = payload.get("simulate_failure", False)

            if simulate_failure:
                _send_response(ch, props, {"success": False, "error": "simulated_shipping_failure"})
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return

            shipment = Shipment.objects.create(
                order_id=payload["order_id"],
                customer_id=payload["customer_id"],
                address=payload.get("address", ""),
                method=payload.get("method", "standard"),
                status="processing",
            )
            _send_response(ch, props, {"success": True, "shipping_id": shipment.id})
            ch.basic_ack(delivery_tag=method.delivery_tag)

        def on_compensate(ch, method, props, body):
            payload = json.loads(body)
            shipment_id = payload.get("shipping_id")
            if shipment_id:
                try:
                    shipment = Shipment.objects.get(id=shipment_id)
                    shipment.status = "failed"
                    shipment.save(update_fields=["status", "updated_at"])
                except Shipment.DoesNotExist:
                    pass
            _send_response(ch, props, {"success": True, "compensated": True})
            ch.basic_ack(delivery_tag=method.delivery_tag)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue="shipping.reserve", on_message_callback=on_reserve)
        channel.basic_consume(queue="shipping.compensate", on_message_callback=on_compensate)
        channel.start_consuming()
