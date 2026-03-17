import json
import os
from datetime import datetime, timedelta, timezone

import jwt
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


METRICS = {
    "login_requests": 0,
    "login_success": 0,
    "login_failed": 0,
    "token_validations": 0,
    "token_invalid": 0,
}


def _load_users():
    users_env = os.environ.get("AUTH_USERS_JSON")
    if users_env:
        return json.loads(users_env)
    return {
        "manager": {"password": "manager123", "role": "manager", "user_id": 1},
        "staff": {"password": "staff123", "role": "staff", "user_id": 2},
        "customer": {"password": "customer123", "role": "customer", "user_id": 3},
    }


def _jwt_secret():
    return os.environ.get("JWT_SECRET", "bookstore-jwt-secret")


def _jwt_exp_minutes():
    return int(os.environ.get("JWT_EXP_MINUTES", "60"))


def _issue_token(username, user):
    now = datetime.now(tz=timezone.utc)
    payload = {
        "sub": str(user["user_id"]),
        "username": username,
        "role": user["role"],
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=_jwt_exp_minutes())).timestamp()),
    }
    return jwt.encode(payload, _jwt_secret(), algorithm="HS256")


def health_check(request):
    return JsonResponse({"status": "ok", "service": "auth-service"})


def metrics_view(request):
    return JsonResponse(METRICS)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        METRICS["login_requests"] += 1
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            METRICS["login_failed"] += 1
            return Response({"error": "username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        users = _load_users()
        user = users.get(username)
        if not user or user.get("password") != password:
            METRICS["login_failed"] += 1
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        access_token = _issue_token(username, user)
        METRICS["login_success"] += 1
        return Response(
            {
                "access_token": access_token,
                "token_type": "Bearer",
                "expires_in": _jwt_exp_minutes() * 60,
                "user": {
                    "id": user["user_id"],
                    "username": username,
                    "role": user["role"],
                },
            }
        )


class ValidateTokenView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        METRICS["token_validations"] += 1
        token = request.data.get("token")
        if not token:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1]

        if not token:
            METRICS["token_invalid"] += 1
            return Response({"valid": False, "error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = jwt.decode(token, _jwt_secret(), algorithms=["HS256"])
            return Response({"valid": True, "claims": payload})
        except jwt.ExpiredSignatureError:
            METRICS["token_invalid"] += 1
            return Response({"valid": False, "error": "Token expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            METRICS["token_invalid"] += 1
            return Response({"valid": False, "error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
