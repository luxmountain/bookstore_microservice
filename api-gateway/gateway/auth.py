import os

import requests


AUTH_SERVICE_URL = os.environ.get("AUTH_SERVICE_URL", "http://auth-service:8000")

PUBLIC_ROUTES = {
    ("auth", "login"),
    ("auth", "validate"),
    ("customers", "register"),
    ("customers", "login"),
}

WRITE_ROLE_RULES = {
    "staff": {"manager"},
    "managers": {"manager"},
    "books": {"staff", "manager"},
    "catalogs": {"staff", "manager"},
}


def is_public_route(service_name: str, path: str, method: str) -> bool:
    if service_name == "auth":
        return True
    key = (service_name, path.strip("/").split("/")[0] if path else "")
    if method.upper() in {"GET", "HEAD", "OPTIONS"}:
        return key in PUBLIC_ROUTES
    return key in PUBLIC_ROUTES


def validate_bearer_token(auth_header: str):
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, "Missing or invalid Authorization header"

    token = auth_header.split(" ", 1)[1]
    try:
        response = requests.post(
            f"{AUTH_SERVICE_URL}/api/auth/validate/",
            json={"token": token},
            timeout=5,
        )
    except requests.RequestException:
        return None, "Auth service unavailable"

    if response.status_code != 200:
        try:
            payload = response.json()
            return None, payload.get("error", "Token validation failed")
        except ValueError:
            return None, "Token validation failed"

    payload = response.json()
    claims = payload.get("claims") if payload.get("valid") else None
    if not claims:
        return None, "Token validation failed"
    return claims, None


def is_authorized(service_name: str, method: str, role: str) -> bool:
    if method.upper() in {"GET", "HEAD", "OPTIONS"}:
        return True
    allowed_roles = WRITE_ROLE_RULES.get(service_name)
    if not allowed_roles:
        return True
    return role in allowed_roles
