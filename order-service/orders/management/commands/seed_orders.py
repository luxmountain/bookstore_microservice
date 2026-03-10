from django.core.management.base import BaseCommand
from orders.models import Order, OrderItem
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Seed order data'

    def handle(self, *args, **options):
        statuses = ["pending", "confirmed", "paid", "shipped", "delivered", "cancelled"]
        payment_methods = ["credit_card", "debit_card", "paypal", "bank_transfer", "cod"]
        shipping_methods = ["standard", "express", "overnight"]
        
        districts = [
            "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7",
            "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Bình Thạnh",
            "Tân Bình", "Tân Phú", "Phú Nhuận", "Gò Vấp", "Thủ Đức", "Bình Tân"
        ]
        
        streets = [
            "Nguyễn Huệ", "Lê Lợi", "Đồng Khởi", "Hai Bà Trưng", "Pasteur",
            "Nam Kỳ Khởi Nghĩa", "Điện Biên Phủ", "Võ Văn Tần", "Nguyễn Thị Minh Khai"
        ]

        # Sample book prices (simulate fetching from book-service)
        book_prices = {i: Decimal(random.randint(30, 500) * 1000) for i in range(1, 101)}

        created_order_count = 0
        created_item_count = 0

        # Create 100 orders for various customers
        for i in range(1, 101):
            customer_id = random.randint(1, 50)
            status = random.choice(statuses)
            payment_method = random.choice(payment_methods)
            shipping_method = random.choice(shipping_methods)
            
            street_number = random.randint(1, 500)
            street = random.choice(streets)
            district = random.choice(districts)
            shipping_address = f"{street_number} {street}, {district}, TP. Hồ Chí Minh"

            order = Order.objects.create(
                customer_id=customer_id,
                total_amount=Decimal("0"),
                status=status,
                payment_method=payment_method,
                shipping_method=shipping_method,
                shipping_address=shipping_address,
                payment_id=i if status in ["paid", "shipped", "delivered"] else None,
                shipping_id=i if status in ["shipped", "delivered"] else None
            )
            created_order_count += 1

            # Add 1-5 items to each order
            num_items = random.randint(1, 5)
            book_ids = random.sample(range(1, 101), min(num_items, 100))
            total = Decimal("0")
            
            for book_id in book_ids:
                quantity = random.randint(1, 3)
                price = book_prices.get(book_id, Decimal("50000"))
                
                OrderItem.objects.create(
                    order=order,
                    book_id=book_id,
                    quantity=quantity,
                    price=price
                )
                created_item_count += 1
                total += price * quantity

            # Update order total
            order.total_amount = total
            order.save()
            
            self.stdout.write(f"Created order #{order.id} for customer {customer_id}")

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded {created_order_count} orders with {created_item_count} items"
        ))
