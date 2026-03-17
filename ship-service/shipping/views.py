from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from .models import Shipment
from .serializers import ShipmentSerializer


METRICS = {
    "shipments_created": 0,
    "shipment_status_updates": 0,
}


def health_check(request):
    return JsonResponse({"status": "ok", "service": "ship-service"})


def metrics_view(request):
    return JsonResponse(METRICS)


class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            METRICS["shipments_created"] += 1
        return response

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        shipment = self.get_object()
        new_status = request.data.get("status")
        valid = [c[0] for c in Shipment.STATUS_CHOICES]
        if new_status not in valid:
            return Response({"error": f"Invalid status. Must be one of {valid}"}, status=status.HTTP_400_BAD_REQUEST)
        shipment.status = new_status
        shipment.save()
        METRICS["shipment_status_updates"] += 1
        return Response(ShipmentSerializer(shipment).data)

    @action(detail=False, methods=["get"])
    def by_order(self, request):
        order_id = request.query_params.get("order_id")
        if not order_id:
            return Response({"error": "order_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        shipments = Shipment.objects.filter(order_id=order_id)
        return Response(ShipmentSerializer(shipments, many=True).data)

    @action(detail=False, methods=["get"])
    def track(self, request):
        tracking_number = request.query_params.get("tracking_number")
        if not tracking_number:
            return Response({"error": "tracking_number is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            shipment = Shipment.objects.get(tracking_number=tracking_number)
            return Response(ShipmentSerializer(shipment).data)
        except Shipment.DoesNotExist:
            return Response({"error": "Shipment not found"}, status=status.HTTP_404_NOT_FOUND)
