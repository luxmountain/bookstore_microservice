import os
import requests
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from .event_bus import publish

CART_SERVICE_URL = os.environ.get("CART_SERVICE_URL", "http://cart-service:8000")
BOOK_SERVICE_URL = os.environ.get("BOOK_SERVICE_URL", "http://book-service:8000")
PAY_SERVICE_URL = os.environ.get("PAY_SERVICE_URL", "http://pay-service:8000")
SHIP_SERVICE_URL = os.environ.get("SHIP_SERVICE_URL", "http://ship-service:8000")

METRICS = {
    "create_from_cart_requests": 0,
    "create_from_cart_errors": 0,
    "saga_started": 0,
}


def health_check(request):
    return JsonResponse({"status": "ok", "service": "order-service"})


def metrics_view(request):
    return JsonResponse(METRICS)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=False, methods=["post"])
    def create_from_cart(self, request):
        """
        Create an order from the customer's cart.
        Triggers payment and shipping creation.
        """
        METRICS["create_from_cart_requests"] += 1

        ser = CreateOrderSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        customer_id = ser.validated_data["customer_id"]
        payment_method = ser.validated_data["payment_method"]
        shipping_method = ser.validated_data["shipping_method"]
        shipping_address = ser.validated_data["shipping_address"]
        simulate_payment_failure = bool(request.data.get("simulate_payment_failure", False))
        simulate_shipping_failure = bool(request.data.get("simulate_shipping_failure", False))

        # 1. Fetch cart
        try:
            cart_resp = requests.get(
                f"{CART_SERVICE_URL}/api/carts/by_customer/",
                params={"customer_id": customer_id},
                timeout=5,
            )
            cart_data = cart_resp.json()
        except requests.RequestException:
            METRICS["create_from_cart_errors"] += 1
            return Response({"error": "Failed to fetch cart"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        if not cart_data.get("items"):
            METRICS["create_from_cart_errors"] += 1
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Fetch book prices and calculate total
        total = 0
        order_items = []
        for item in cart_data["items"]:
            try:
                book_resp = requests.get(f"{BOOK_SERVICE_URL}/api/books/{item['book_id']}/", timeout=5)
                book = book_resp.json()
                price = float(book["price"])
            except requests.RequestException:
                METRICS["create_from_cart_errors"] += 1
                return Response({"error": f"Failed to fetch book {item['book_id']}"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            order_items.append({"book_id": item["book_id"], "quantity": item["quantity"], "price": price})
            total += price * item["quantity"]

        # 3. Create order
        order = Order.objects.create(
            customer_id=customer_id,
            total_amount=total,
            payment_method=payment_method,
            shipping_method=shipping_method,
            shipping_address=shipping_address,
            status="pending",
        )
        for oi in order_items:
            OrderItem.objects.create(order=order, **oi)

        publish(
            "order.saga.start",
            {
                "order_id": order.id,
                "customer_id": customer_id,
                "items": order_items,
                "simulate_payment_failure": simulate_payment_failure,
                "simulate_shipping_failure": simulate_shipping_failure,
                "cart_service_url": CART_SERVICE_URL,
                "book_service_url": BOOK_SERVICE_URL,
            },
        )
        METRICS["saga_started"] += 1

        return Response(
            {
                "message": "Order created in pending state. Saga orchestration started.",
                "order": OrderSerializer(order).data,
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=False, methods=["get"])
    def by_customer(self, request):
        customer_id = request.query_params.get("customer_id")
        if not customer_id:
            return Response({"error": "customer_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        orders = Order.objects.filter(customer_id=customer_id)
        return Response(OrderSerializer(orders, many=True).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in ["shipped", "delivered"]:
            return Response({"error": "Cannot cancel"}, status=status.HTTP_400_BAD_REQUEST)
        order.status = "cancelled"
        order.save()
        return Response(OrderSerializer(order).data)
