from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from customers.models import Customer
import random


class Command(BaseCommand):
    help = 'Seed customer data'

    def handle(self, *args, **options):
        first_names = [
            "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Vũ", "Võ", "Đặng", "Bùi",
            "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Phan", "Tạ", "Cao", "Đinh", "Lương"
        ]
        middle_names = [
            "Văn", "Thị", "Hoàng", "Minh", "Đức", "Thanh", "Quang", "Ngọc", "Hồng", "Mai"
        ]
        last_names = [
            "An", "Bình", "Cường", "Dũng", "Em", "Phương", "Giang", "Hà", "Hùng", "Kim",
            "Long", "Mai", "Nam", "Oanh", "Phúc", "Quân", "Sơn", "Thảo", "Tùng", "Vy",
            "Xuân", "Yến", "Hải", "Linh", "Tú", "Hương", "Lan", "Hoa", "Đào", "Trúc"
        ]
        
        districts = [
            "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7",
            "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Bình Thạnh",
            "Tân Bình", "Tân Phú", "Phú Nhuận", "Gò Vấp", "Thủ Đức", "Bình Tân"
        ]
        
        streets = [
            "Nguyễn Huệ", "Lê Lợi", "Đồng Khởi", "Hai Bà Trưng", "Pasteur",
            "Nam Kỳ Khởi Nghĩa", "Điện Biên Phủ", "Võ Văn Tần", "Nguyễn Thị Minh Khai",
            "Trần Hưng Đạo", "Cách Mạng Tháng 8", "Lý Tự Trọng", "Nguyễn Du"
        ]

        created_count = 0
        for i in range(1, 51):
            first_name = random.choice(first_names)
            middle_name = random.choice(middle_names)
            last_name = random.choice(last_names)
            
            username = f"khachhang{i}"
            email = f"khachhang{i}@email.com"
            phone = f"09{random.randint(10000000, 99999999)}"
            
            street_number = random.randint(1, 500)
            street = random.choice(streets)
            district = random.choice(districts)
            address = f"{street_number} {street}, {district}, TP. Hồ Chí Minh"

            customer, created = Customer.objects.get_or_create(
                username=username,
                defaults={
                    "email": email,
                    "password": make_password("password123"),
                    "first_name": first_name,
                    "last_name": f"{middle_name} {last_name}",
                    "phone": phone,
                    "address": address,
                    "is_active": True
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f"Created customer: {customer.username}")
            else:
                self.stdout.write(f"Customer already exists: {customer.username}")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} customers"))
