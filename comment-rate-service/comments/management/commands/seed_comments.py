from django.core.management.base import BaseCommand
from comments.models import CommentRate
import random


class Command(BaseCommand):
    help = 'Seed comment and rating data'

    def handle(self, *args, **options):
        comments_positive = [
            "Sách rất hay, nội dung hấp dẫn!",
            "Đóng gói cẩn thận, giao hàng nhanh.",
            "Tuyệt vời! Đúng như mô tả.",
            "Sách in đẹp, giấy tốt.",
            "Rất hài lòng với sản phẩm này.",
            "Một cuốn sách đáng đọc!",
            "Nội dung sâu sắc, đáng suy ngẫm.",
            "Recommend cho mọi người!",
            "Sách hay, ship nhanh, đóng gói đẹp.",
            "Chất lượng tuyệt vời, sẽ mua thêm.",
            "Cuốn sách này thay đổi cách nhìn của tôi.",
            "Tác giả viết rất cuốn hút.",
            "Đọc một mạch hết sách luôn!",
            "Giá cả hợp lý, chất lượng tốt.",
            "5 sao cho shop và sản phẩm!",
        ]
        
        comments_neutral = [
            "Sách ổn, nội dung tạm được.",
            "Giao hàng hơi lâu nhưng sách ok.",
            "Chất lượng bình thường.",
            "Không như kỳ vọng lắm.",
            "Sách được, giá hơi cao.",
            "Tạm ổn, có thể đọc được.",
        ]
        
        comments_negative = [
            "Sách bị móp góc khi nhận.",
            "Giao hàng chậm.",
            "Nội dung không như mô tả.",
            "Giấy in hơi mỏng.",
        ]

        created_count = 0
        # Create 200 comment/ratings
        used_pairs = set()
        
        while created_count < 200:
            customer_id = random.randint(1, 50)
            book_id = random.randint(1, 100)
            
            # Ensure unique (customer_id, book_id) pair
            if (customer_id, book_id) in used_pairs:
                continue
            used_pairs.add((customer_id, book_id))
            
            # Weight ratings: more positive reviews
            rating = random.choices(
                [1, 2, 3, 4, 5],
                weights=[0.05, 0.05, 0.15, 0.35, 0.4],
                k=1
            )[0]
            
            # Select comment based on rating
            if rating >= 4:
                comment = random.choice(comments_positive)
            elif rating == 3:
                comment = random.choice(comments_neutral)
            else:
                comment = random.choice(comments_negative)
            
            comment_rate, created = CommentRate.objects.get_or_create(
                customer_id=customer_id,
                book_id=book_id,
                defaults={
                    "rating": rating,
                    "comment": comment
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f"Created comment/rating for customer {customer_id} on book {book_id}")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} comments/ratings"))
