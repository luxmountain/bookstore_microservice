from django.core.management.base import BaseCommand
from shipping.models import Shipment
import random


class Command(BaseCommand):
    help = 'Seed shipment data'

    def handle(self, *args, **options):
        statuses = ["pending", "processing", "shipped", "in_transit", "delivered", "failed"]
        methods = ["standard", "express", "overnight"]
        
        districts = [
            "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7",
            "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Bình Thạnh",
            "Tân Bình", "Tân Phú", "Phú Nhuận", "Gò Vấp", "Thủ Đức", "Bình Tân"
        ]
        
        streets = [
            "Nguyễn Huệ", "Lê Lợi", "Đồng Khởi", "Hai Bà Trưng", "Pasteur",
            "Nam Kỳ Khởi Nghĩa", "Điện Biên Phủ", "Võ Văn Tần", "Nguyễn Thị Minh Khai"
        ]

        created_count = 0

        # Create shipments for orders (assuming 100 orders exist)
        for order_id in range(1, 101):
            customer_id = random.randint(1, 50)
            method = random.choice(methods)
            
            # Weight status distribution: more delivered shipments
            status_weights = [0.1, 0.1, 0.15, 0.15, 0.4, 0.1]  # pending, processing, shipped, in_transit, delivered, failed
            status = random.choices(statuses, weights=status_weights, k=1)[0]
            
            street_number = random.randint(1, 500)
            street = random.choice(streets)
            district = random.choice(districts)
            address = f"{street_number} {street}, {district}, TP. Hồ Chí Minh"

            shipment, created = Shipment.objects.get_or_create(
                order_id=order_id,
                defaults={
                    "customer_id": customer_id,
                    "address": address,
                    "method": method,
                    "status": status
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f"Created shipment #{shipment.id} for order {order_id}")
            else:
                self.stdout.write(f"Shipment for order {order_id} already exists")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} shipments"))
