from django.core.management.base import BaseCommand
from payments.models import Payment
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Seed payment data'

    def handle(self, *args, **options):
        statuses = ["pending", "processing", "completed", "failed", "refunded"]
        methods = ["credit_card", "debit_card", "paypal", "bank_transfer", "cod"]

        created_count = 0

        # Create payments for orders (assuming 100 orders exist)
        for order_id in range(1, 101):
            customer_id = random.randint(1, 50)
            amount = Decimal(random.randint(50, 2000) * 1000)
            method = random.choice(methods)
            
            # Weight status distribution: more completed payments
            status_weights = [0.1, 0.1, 0.5, 0.15, 0.15]  # pending, processing, completed, failed, refunded
            status = random.choices(statuses, weights=status_weights, k=1)[0]

            payment, created = Payment.objects.get_or_create(
                order_id=order_id,
                defaults={
                    "customer_id": customer_id,
                    "amount": amount,
                    "method": method,
                    "status": status
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f"Created payment #{payment.id} for order {order_id}")
            else:
                self.stdout.write(f"Payment for order {order_id} already exists")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} payments"))
