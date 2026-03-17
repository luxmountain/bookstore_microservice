from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, health_check, metrics_view

router = DefaultRouter()
router.register(r"orders", OrderViewSet)

urlpatterns = [
    path("health/", health_check, name="health"),
    path("metrics/", metrics_view, name="metrics"),
    path("", include(router.urls)),
]
