from django.urls import path, re_path
from .views import GatewayProxyView, ServiceListView, health_check, metrics_view

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("metrics/", metrics_view, name="metrics"),
    path("services/", ServiceListView.as_view(), name="service-list"),
    re_path(r"^(?P<service_name>[\w-]+)/(?P<path>.*)$", GatewayProxyView.as_view(), name="gateway-proxy"),
]
