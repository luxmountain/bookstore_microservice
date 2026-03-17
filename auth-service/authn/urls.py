from django.urls import path
from .views import LoginView, ValidateTokenView, health_check, metrics_view

urlpatterns = [
    path("login/", LoginView.as_view(), name="auth-login"),
    path("validate/", ValidateTokenView.as_view(), name="auth-validate"),
    path("health/", health_check, name="auth-health"),
    path("metrics/", metrics_view, name="auth-metrics"),
]
