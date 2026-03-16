import os
import requests
from django.contrib.auth.hashers import check_password, make_password
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Customer
from .serializers import CustomerSerializer, CustomerRegistrationSerializer

CART_SERVICE_URL = os.environ.get("CART_SERVICE_URL", "http://cart-service:8000")


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    @action(detail=False, methods=["post"])
    def register(self, request):
        """Register a new customer and automatically create a cart."""
        serializer = CustomerRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = serializer.save()

        # Auto-create cart via cart-service
        try:
            requests.post(
                f"{CART_SERVICE_URL}/api/carts/",
                json={"customer_id": customer.id},
                timeout=5,
            )
        except requests.RequestException:
            pass  # Cart creation failure is non-blocking

        return Response(CustomerSerializer(customer).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        try:
            customer = Customer.objects.get(username=username)

            if check_password(password, customer.password):
                return Response(CustomerSerializer(customer).data)

            if customer.password == password:
                customer.password = make_password(password)
                customer.save(update_fields=["password", "updated_at"])
                return Response(CustomerSerializer(customer).data)

            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except Customer.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
