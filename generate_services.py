"""
Generator script to scaffold all BookStore microservices.
Run this once to create the directory structure and boilerplate files.
"""
import os

BASE = os.path.dirname(os.path.abspath(__file__))

SERVICES = {
    "staff-service": {
        "project": "staff_service",
        "app": "staff",
        "port": 8001,
    },
    "manager-service": {
        "project": "manager_service",
        "app": "manager",
        "port": 8002,
    },
    "customer-service": {
        "project": "customer_service",
        "app": "customers",
        "port": 8003,
    },
    "catalog-service": {
        "project": "catalog_service",
        "app": "catalogs",
        "port": 8004,
    },
    "book-service": {
        "project": "book_service",
        "app": "books",
        "port": 8005,
    },
    "cart-service": {
        "project": "cart_service",
        "app": "carts",
        "port": 8006,
    },
    "order-service": {
        "project": "order_service",
        "app": "orders",
        "port": 8007,
    },
    "ship-service": {
        "project": "ship_service",
        "app": "shipping",
        "port": 8008,
    },
    "pay-service": {
        "project": "pay_service",
        "app": "payments",
        "port": 8009,
    },
    "comment-rate-service": {
        "project": "comment_rate_service",
        "app": "comments",
        "port": 8010,
    },
    "clothe-service": {
        "project": "clothe_service",
        "app": "clothes",
        "port": 8013,
    },
    "recommender-ai-service": {
        "project": "recommender_service",
        "app": "recommender",
        "port": 8011,
    },
    "api-gateway": {
        "project": "api_gateway",
        "app": "gateway",
        "port": 8000,
    },
}


def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Created {path}")


def make_settings(project, app):
    return f'''import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-{project}-secret-key-change-in-prod"

DEBUG = True

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "{app}",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "{project}.urls"

TEMPLATES = [
    {{
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {{
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        }},
    }},
]

WSGI_APPLICATION = "{project}.wsgi.application"

DATABASES = {{
    "default": {{
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }}
}}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {{
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}}
'''


def make_urls(project, app):
    return f'''from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("{app}.urls")),
]
'''


def make_wsgi(project):
    return f'''import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "{project}.settings")
application = get_wsgi_application()
'''


def make_manage(project):
    return f'''#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "{project}.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django."
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()
'''


def make_dockerfile():
    return '''FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py migrate --run-syncdb 2>/dev/null || true

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
'''


def make_requirements(extra=None):
    lines = [
        "Django>=4.2,<5.0",
        "djangorestframework>=3.14",
        "requests>=2.31",
        "django-cors-headers>=4.3",
    ]
    if extra:
        lines.extend(extra)
    return "\n".join(lines) + "\n"


for svc_name, cfg in SERVICES.items():
    print(f"\nGenerating {svc_name}...")
    svc_dir = os.path.join(BASE, svc_name)
    project = cfg["project"]
    app = cfg["app"]

    # manage.py
    write(os.path.join(svc_dir, "manage.py"), make_manage(project))

    # Dockerfile
    write(os.path.join(svc_dir, "Dockerfile"), make_dockerfile())

    # requirements.txt
    extra = None
    if svc_name == "recommender-ai-service":
        extra = ["scikit-learn>=1.3", "numpy>=1.24"]
    write(os.path.join(svc_dir, "requirements.txt"), make_requirements(extra))

    # project package
    pkg = os.path.join(svc_dir, project)
    write(os.path.join(pkg, "__init__.py"), "")
    write(os.path.join(pkg, "settings.py"), make_settings(project, app))
    write(os.path.join(pkg, "urls.py"), make_urls(project, app))
    write(os.path.join(pkg, "wsgi.py"), make_wsgi(project))

    # app package (placeholder files)
    app_dir = os.path.join(svc_dir, app)
    write(os.path.join(app_dir, "__init__.py"), "")
    write(os.path.join(app_dir, "models.py"), "from django.db import models\n")
    write(os.path.join(app_dir, "serializers.py"), "from rest_framework import serializers\n")
    write(os.path.join(app_dir, "views.py"), "from rest_framework import viewsets\n")
    write(os.path.join(app_dir, "urls.py"), "from django.urls import path\n\nurlpatterns = []\n")
    write(os.path.join(app_dir, "admin.py"), "from django.contrib import admin\n")

print("\n✓ All service scaffolds generated.")
