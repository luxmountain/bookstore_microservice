import os

import pika


RABBITMQ_URL = os.environ.get("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/%2F")


def get_connection():
    params = pika.URLParameters(RABBITMQ_URL)
    params.heartbeat = 30
    params.blocked_connection_timeout = 30
    return pika.BlockingConnection(params)
