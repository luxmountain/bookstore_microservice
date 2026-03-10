from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from manager.models import Manager


class Command(BaseCommand):
    help = 'Seed manager data'

    def handle(self, *args, **options):
        managers = [
            {"username": "quanly1", "email": "quanly1@bookstore.com", "first_name": "Nguyễn", "last_name": "Minh Tuấn", "phone": "0911111111", "department": "Quản lý sách"},
            {"username": "quanly2", "email": "quanly2@bookstore.com", "first_name": "Trần", "last_name": "Hoàng Long", "phone": "0922222222", "department": "Quản lý kho"},
            {"username": "quanly3", "email": "quanly3@bookstore.com", "first_name": "Lê", "last_name": "Thị Mai", "phone": "0933333333", "department": "Quản lý đơn hàng"},
            {"username": "quanly4", "email": "quanly4@bookstore.com", "first_name": "Phạm", "last_name": "Văn Nam", "phone": "0944444444", "department": "Quản lý khách hàng"},
            {"username": "admin", "email": "admin@bookstore.com", "first_name": "Admin", "last_name": "System", "phone": "0900000000", "department": "Hệ thống"},
        ]

        created_count = 0
        for manager_data in managers:
            manager, created = Manager.objects.get_or_create(
                username=manager_data["username"],
                defaults={
                    "email": manager_data["email"],
                    "password": make_password("password123"),
                    "first_name": manager_data["first_name"],
                    "last_name": manager_data["last_name"],
                    "phone": manager_data["phone"],
                    "department": manager_data["department"],
                    "is_active": True
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f"Created manager: {manager.username}")
            else:
                self.stdout.write(f"Manager already exists: {manager.username}")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} managers"))
