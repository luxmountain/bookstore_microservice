import json

import pika
from django.core.management.base import BaseCommand

from payments.event_bus import get_connection
from payments.models import Payment


class Command(BaseCommand):
    help = "Run payment event worker"

    def handle(self, *args, **options):
        connection = get_connection()
        channel = connection.channel()
        channel.queue_declare(queue="payment.reserve", durable=True)
        channel.queue_declare(queue="payment.compensate", durable=True)

        self.stdout.write(self.style.SUCCESS("Payment worker started..."))

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
                _send_response(ch, props, {"success": False, "error": "simulated_payment_failure"})
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return

            payment = Payment.objects.create(
                order_id=payload["order_id"],
                customer_id=payload["customer_id"],
                amount=payload["amount"],
                method=payload.get("method", "cod"),
                status="completed",
            )
            _send_response(ch, props, {"success": True, "payment_id": payment.id})
            ch.basic_ack(delivery_tag=method.delivery_tag)

        def on_compensate(ch, method, props, body):
            payload = json.loads(body)
            payment_id = payload.get("payment_id")
            if payment_id:
                try:
                    payment = Payment.objects.get(id=payment_id)
                    payment.status = "refunded"
                    payment.save(update_fields=["status", "updated_at"])
                except Payment.DoesNotExist:
                    pass
            _send_response(ch, props, {"success": True, "compensated": True})
            ch.basic_ack(delivery_tag=method.delivery_tag)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue="payment.reserve", on_message_callback=on_reserve)
        channel.basic_consume(queue="payment.compensate", on_message_callback=on_compensate)
        channel.start_consuming()
