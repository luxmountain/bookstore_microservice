from django.core.management.base import BaseCommand
from carts.models import Cart, CartItem
import random


class Command(BaseCommand):
    help = 'Seed cart data'

    def handle(self, *args, **options):
        # Create carts for 30 customers with items
        created_cart_count = 0
        created_item_count = 0

        # Assume we have 50 customers (IDs 1-50) and 100+ books (IDs 1-100)
        for customer_id in range(1, 31):
            cart, created = Cart.objects.get_or_create(
                customer_id=customer_id
            )
            
            if created:
                created_cart_count += 1
                self.stdout.write(f"Created cart for customer {customer_id}")
            
            # Add 1-5 items to each cart
            num_items = random.randint(1, 5)
            book_ids = random.sample(range(1, 101), min(num_items, 100))
            
            for book_id in book_ids:
                cart_item, item_created = CartItem.objects.get_or_create(
                    cart=cart,
                    book_id=book_id,
                    defaults={"quantity": random.randint(1, 3)}
                )
                if item_created:
                    created_item_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded {created_cart_count} carts with {created_item_count} items"
        ))
