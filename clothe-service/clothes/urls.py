from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClotheViewSet

router = DefaultRouter()
router.register(r"clothes", ClotheViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
