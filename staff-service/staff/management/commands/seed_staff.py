from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from staff.models import Staff


class Command(BaseCommand):
    help = 'Seed staff data'

    def handle(self, *args, **options):
        staff_list = [
            {"username": "nhanvien1", "email": "nhanvien1@bookstore.com", "first_name": "Nguyễn", "last_name": "Văn An", "phone": "0901234567"},
            {"username": "nhanvien2", "email": "nhanvien2@bookstore.com", "first_name": "Trần", "last_name": "Thị Bình", "phone": "0902345678"},
            {"username": "nhanvien3", "email": "nhanvien3@bookstore.com", "first_name": "Lê", "last_name": "Văn Cường", "phone": "0903456789"},
            {"username": "nhanvien4", "email": "nhanvien4@bookstore.com", "first_name": "Phạm", "last_name": "Thị Dung", "phone": "0904567890"},
            {"username": "nhanvien5", "email": "nhanvien5@bookstore.com", "first_name": "Hoàng", "last_name": "Văn Em", "phone": "0905678901"},
            {"username": "nhanvien6", "email": "nhanvien6@bookstore.com", "first_name": "Vũ", "last_name": "Thị Phương", "phone": "0906789012"},
            {"username": "nhanvien7", "email": "nhanvien7@bookstore.com", "first_name": "Đặng", "last_name": "Văn Giang", "phone": "0907890123"},
            {"username": "nhanvien8", "email": "nhanvien8@bookstore.com", "first_name": "Bùi", "last_name": "Thị Hà", "phone": "0908901234"},
            {"username": "nhanvien9", "email": "nhanvien9@bookstore.com", "first_name": "Đỗ", "last_name": "Văn Hùng", "phone": "0909012345"},
            {"username": "nhanvien10", "email": "nhanvien10@bookstore.com", "first_name": "Ngô", "last_name": "Thị Kim", "phone": "0910123456"},
        ]

        created_count = 0
        for staff_data in staff_list:
            staff, created = Staff.objects.get_or_create(
                username=staff_data["username"],
                defaults={
                    "email": staff_data["email"],
                    "password": make_password("password123"),
                    "first_name": staff_data["first_name"],
                    "last_name": staff_data["last_name"],
                    "phone": staff_data["phone"],
                    "is_active": True
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f"Created staff: {staff.username}")
            else:
                self.stdout.write(f"Staff already exists: {staff.username}")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} staff members"))
