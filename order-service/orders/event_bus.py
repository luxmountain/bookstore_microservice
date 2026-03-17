import json
import os
import uuid

import pika


RABBITMQ_URL = os.environ.get("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/%2F")


def _connection():
    parameters = pika.URLParameters(RABBITMQ_URL)
    parameters.heartbeat = 30
    parameters.blocked_connection_timeout = 30
    return pika.BlockingConnection(parameters)


def publish(queue_name: str, payload: dict):
    connection = _connection()
    channel = connection.channel()
    channel.queue_declare(queue=queue_name, durable=True)
    channel.basic_publish(
        exchange="",
        routing_key=queue_name,
        body=json.dumps(payload),
        properties=pika.BasicProperties(delivery_mode=2),
    )
    connection.close()


def rpc_call(queue_name: str, payload: dict, timeout_seconds: int = 15):
    connection = _connection()
    channel = connection.channel()
    channel.queue_declare(queue=queue_name, durable=True)

    callback_queue = channel.queue_declare(queue="", exclusive=True).method.queue
    corr_id = str(uuid.uuid4())
    response = {"body": None}

    def on_response(ch, method, props, body):
        if props.correlation_id == corr_id:
            response["body"] = body

    channel.basic_consume(queue=callback_queue, on_message_callback=on_response, auto_ack=True)

    channel.basic_publish(
        exchange="",
        routing_key=queue_name,
        body=json.dumps(payload),
        properties=pika.BasicProperties(reply_to=callback_queue, correlation_id=corr_id, delivery_mode=2),
    )

    elapsed = 0
    while response["body"] is None and elapsed < timeout_seconds * 10:
        connection.process_data_events(time_limit=0.1)
        elapsed += 1

    connection.close()

    if response["body"] is None:
        return {"success": False, "error": "timeout"}

    try:
        return json.loads(response["body"])
    except Exception:
        return {"success": False, "error": "invalid_response"}
