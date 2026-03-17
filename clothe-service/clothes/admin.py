from django.contrib import admin
from .models import Clothe


@admin.register(Clothe)
class ClotheAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "sku", "price", "stock", "is_active")
    search_fields = ("name", "sku")
    list_filter = ("is_active",)
