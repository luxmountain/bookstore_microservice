from django.core.management.base import BaseCommand
from clothes.models import Clothe


class Command(BaseCommand):
    help = "Seed clothe data"

    def handle(self, *args, **options):
        clothes_data = [
            {
                "name": "Áo thun nam basic",
                "sku": "CLOTH-TSHIRT-M-001",
                "description": "Áo thun cotton nam form regular, thoáng mát hằng ngày.",
                "price": 189000,
                "stock": 120,
                "is_active": True,
            },
            {
                "name": "Áo sơ mi nữ công sở",
                "sku": "CLOTH-SHIRT-F-001",
                "description": "Áo sơ mi nữ tay dài chất liệu mềm, phù hợp đi làm.",
                "price": 299000,
                "stock": 80,
                "is_active": True,
            },
            {
                "name": "Quần jean nam slimfit",
                "sku": "CLOTH-JEAN-M-001",
                "description": "Quần jean nam co giãn nhẹ, kiểu dáng slimfit hiện đại.",
                "price": 459000,
                "stock": 65,
                "is_active": True,
            },
            {
                "name": "Quần kaki nữ",
                "sku": "CLOTH-KAKI-F-001",
                "description": "Quần kaki nữ dáng suông, dễ phối đồ.",
                "price": 379000,
                "stock": 50,
                "is_active": True,
            },
            {
                "name": "Hoodie unisex nỉ bông",
                "sku": "CLOTH-HOODIE-U-001",
                "description": "Áo hoodie unisex giữ ấm tốt, phong cách trẻ trung.",
                "price": 549000,
                "stock": 40,
                "is_active": True,
            },
            {
                "name": "Áo khoác gió chống nước",
                "sku": "CLOTH-JACKET-U-001",
                "description": "Áo khoác gió nhẹ, chống nước cơ bản cho ngày mưa.",
                "price": 629000,
                "stock": 35,
                "is_active": True,
            },
            {
                "name": "Váy midi nữ",
                "sku": "CLOTH-DRESS-F-001",
                "description": "Váy midi nữ thanh lịch, phù hợp đi làm và đi chơi.",
                "price": 489000,
                "stock": 45,
                "is_active": True,
            },
            {
                "name": "Áo polo nam",
                "sku": "CLOTH-POLO-M-001",
                "description": "Áo polo nam chất liệu pique, lịch sự nhưng thoải mái.",
                "price": 259000,
                "stock": 90,
                "is_active": True,
            },
            {
                "name": "Chân váy chữ A",
                "sku": "CLOTH-SKIRT-F-001",
                "description": "Chân váy chữ A dễ phối, phù hợp nhiều phong cách.",
                "price": 329000,
                "stock": 55,
                "is_active": True,
            },
            {
                "name": "Set đồ thể thao unisex",
                "sku": "CLOTH-SPORT-U-001",
                "description": "Bộ thể thao thấm hút mồ hôi, co giãn tốt khi vận động.",
                "price": 699000,
                "stock": 30,
                "is_active": True,
            },
        ]

        created_count = 0
        for item in clothes_data:
            clothe, created = Clothe.objects.get_or_create(
                sku=item["sku"],
                defaults={
                    "name": item["name"],
                    "description": item["description"],
                    "price": item["price"],
                    "stock": item["stock"],
                    "is_active": item["is_active"],
                },
            )

            if created:
                created_count += 1
                self.stdout.write(f"Created clothe: {clothe.name}")
            else:
                update_fields = []
                for field in ["name", "description", "price", "stock", "is_active"]:
                    if getattr(clothe, field) != item[field]:
                        setattr(clothe, field, item[field])
                        update_fields.append(field)
                if update_fields:
                    clothe.save(update_fields=update_fields)
                self.stdout.write(f"Clothe already exists: {clothe.name}")

        self.stdout.write(
            self.style.SUCCESS(f"Successfully seeded {created_count} clothes")
        )
