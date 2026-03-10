from django.core.management.base import BaseCommand
from books.models import Book
import random


class Command(BaseCommand):
    help = 'Seed book data'

    def handle(self, *args, **options):
        # Books categorized by catalog_id (1-15)
        books_data = [
            # Catalog 1: Văn học Việt Nam
            {"title": "Dế Mèn Phiêu Lưu Ký", "author": "Tô Hoài", "catalog_id": 1, "price": 45000},
            {"title": "Tắt Đèn", "author": "Ngô Tất Tố", "catalog_id": 1, "price": 55000},
            {"title": "Chí Phèo", "author": "Nam Cao", "catalog_id": 1, "price": 48000},
            {"title": "Số Đỏ", "author": "Vũ Trọng Phụng", "catalog_id": 1, "price": 65000},
            {"title": "Vợ Nhặt", "author": "Kim Lân", "catalog_id": 1, "price": 42000},
            {"title": "Lão Hạc", "author": "Nam Cao", "catalog_id": 1, "price": 38000},
            {"title": "Người Đàn Bà Trên Chuyến Tàu Tốc Hành", "author": "Nguyễn Minh Châu", "catalog_id": 1, "price": 72000},
            {"title": "Nỗi Buồn Chiến Tranh", "author": "Bảo Ninh", "catalog_id": 1, "price": 95000},
            {"title": "Mắt Biếc", "author": "Nguyễn Nhật Ánh", "catalog_id": 1, "price": 85000},
            {"title": "Tôi Thấy Hoa Vàng Trên Cỏ Xanh", "author": "Nguyễn Nhật Ánh", "catalog_id": 1, "price": 89000},
            {"title": "Cho Tôi Xin Một Vé Đi Tuổi Thơ", "author": "Nguyễn Nhật Ánh", "catalog_id": 1, "price": 75000},
            {"title": "Kính Vạn Hoa", "author": "Nguyễn Nhật Ánh", "catalog_id": 1, "price": 68000},

            # Catalog 2: Văn học nước ngoài
            {"title": "Đắc Nhân Tâm", "author": "Dale Carnegie", "catalog_id": 2, "price": 108000},
            {"title": "Nhà Giả Kim", "author": "Paulo Coelho", "catalog_id": 2, "price": 79000},
            {"title": "1984", "author": "George Orwell", "catalog_id": 2, "price": 125000},
            {"title": "Trại Súc Vật", "author": "George Orwell", "catalog_id": 2, "price": 85000},
            {"title": "Giết Con Chim Nhại", "author": "Harper Lee", "catalog_id": 2, "price": 135000},
            {"title": "Gatsby Vĩ Đại", "author": "F. Scott Fitzgerald", "catalog_id": 2, "price": 98000},
            {"title": "Bắt Trẻ Đồng Xanh", "author": "J.D. Salinger", "catalog_id": 2, "price": 89000},
            {"title": "Harry Potter và Hòn Đá Phù Thủy", "author": "J.K. Rowling", "catalog_id": 2, "price": 145000},
            {"title": "Harry Potter và Phòng Chứa Bí Mật", "author": "J.K. Rowling", "catalog_id": 2, "price": 155000},
            {"title": "Harry Potter và Tên Tù Nhân Ngục Azkaban", "author": "J.K. Rowling", "catalog_id": 2, "price": 165000},
            {"title": "Hoàng Tử Bé", "author": "Antoine de Saint-Exupéry", "catalog_id": 2, "price": 65000},
            {"title": "Hai Số Phận", "author": "Jeffrey Archer", "catalog_id": 2, "price": 175000},
            {"title": "Cuốn Theo Chiều Gió", "author": "Margaret Mitchell", "catalog_id": 2, "price": 195000},

            # Catalog 3: Kinh tế
            {"title": "Cha Giàu Cha Nghèo", "author": "Robert Kiyosaki", "catalog_id": 3, "price": 110000},
            {"title": "Nghĩ Giàu Làm Giàu", "author": "Napoleon Hill", "catalog_id": 3, "price": 95000},
            {"title": "Người Giàu Có Nhất Thành Babylon", "author": "George S. Clason", "catalog_id": 3, "price": 85000},
            {"title": "Bí Mật Tư Duy Triệu Phú", "author": "T. Harv Eker", "catalog_id": 3, "price": 125000},
            {"title": "Khởi Nghiệp Tinh Gọn", "author": "Eric Ries", "catalog_id": 3, "price": 145000},
            {"title": "Từ Tốt Đến Vĩ Đại", "author": "Jim Collins", "catalog_id": 3, "price": 165000},
            {"title": "7 Thói Quen Thành Đạt", "author": "Stephen R. Covey", "catalog_id": 3, "price": 135000},
            {"title": "Chiến Lược Đại Dương Xanh", "author": "W. Chan Kim", "catalog_id": 3, "price": 175000},
            {"title": "Quốc Gia Khởi Nghiệp", "author": "Dan Senor", "catalog_id": 3, "price": 155000},
            {"title": "Zero To One", "author": "Peter Thiel", "catalog_id": 3, "price": 129000},

            # Catalog 4: Kỹ năng sống
            {"title": "Đừng Bao Giờ Đi Ăn Một Mình", "author": "Keith Ferrazzi", "catalog_id": 4, "price": 112000},
            {"title": "Sức Mạnh Của Thói Quen", "author": "Charles Duhigg", "catalog_id": 4, "price": 135000},
            {"title": "Dọn Dẹp Để Đời Thay Đổi", "author": "Marie Kondo", "catalog_id": 4, "price": 89000},
            {"title": "Tư Duy Nhanh Và Chậm", "author": "Daniel Kahneman", "catalog_id": 4, "price": 189000},
            {"title": "Atomic Habits - Thói Quen Nguyên Tử", "author": "James Clear", "catalog_id": 4, "price": 149000},
            {"title": "Bí Mật Của May Mắn", "author": "Alex Rovira", "catalog_id": 4, "price": 78000},
            {"title": "Hành Trình Về Phương Đông", "author": "Baird T. Spalding", "catalog_id": 4, "price": 125000},
            {"title": "Khéo Ăn Nói Sẽ Có Được Thiên Hạ", "author": "Trác Nhã", "catalog_id": 4, "price": 95000},
            {"title": "Tuổi Trẻ Đáng Giá Bao Nhiêu", "author": "Rosie Nguyễn", "catalog_id": 4, "price": 85000},

            # Catalog 5: Khoa học công nghệ
            {"title": "Clean Code", "author": "Robert C. Martin", "catalog_id": 5, "price": 450000},
            {"title": "The Pragmatic Programmer", "author": "David Thomas", "catalog_id": 5, "price": 520000},
            {"title": "Design Patterns", "author": "Gang of Four", "catalog_id": 5, "price": 480000},
            {"title": "Introduction to Algorithms", "author": "Thomas H. Cormen", "catalog_id": 5, "price": 650000},
            {"title": "Artificial Intelligence: A Modern Approach", "author": "Stuart Russell", "catalog_id": 5, "price": 750000},
            {"title": "Deep Learning", "author": "Ian Goodfellow", "catalog_id": 5, "price": 680000},
            {"title": "Lược Sử Thời Gian", "author": "Stephen Hawking", "catalog_id": 5, "price": 145000},
            {"title": "Sapiens: Lược Sử Loài Người", "author": "Yuval Noah Harari", "catalog_id": 5, "price": 199000},
            {"title": "Homo Deus", "author": "Yuval Noah Harari", "catalog_id": 5, "price": 215000},
            {"title": "Python Crash Course", "author": "Eric Matthes", "catalog_id": 5, "price": 385000},

            # Catalog 6: Thiếu nhi
            {"title": "Doraemon Tập 1", "author": "Fujiko F. Fujio", "catalog_id": 6, "price": 22000},
            {"title": "Doraemon Tập 2", "author": "Fujiko F. Fujio", "catalog_id": 6, "price": 22000},
            {"title": "Conan Tập 1", "author": "Aoyama Gosho", "catalog_id": 6, "price": 25000},
            {"title": "Conan Tập 2", "author": "Aoyama Gosho", "catalog_id": 6, "price": 25000},
            {"title": "Shin - Cậu Bé Bút Chì Tập 1", "author": "Yoshito Usui", "catalog_id": 6, "price": 22000},
            {"title": "Doremon Tập 3", "author": "Fujiko F. Fujio", "catalog_id": 6, "price": 22000},
            {"title": "Bí Kíp Ở Nhà Một Mình", "author": "Tủ Sách Kỹ Năng", "catalog_id": 6, "price": 45000},
            {"title": "Cẩm Nang Sinh Tồn", "author": "Bear Grylls", "catalog_id": 6, "price": 125000},
            {"title": "Dế Mèn Phiêu Lưu Ký - Bản Thiếu Nhi", "author": "Tô Hoài", "catalog_id": 6, "price": 55000},

            # Catalog 7: Giáo khoa - Tham khảo
            {"title": "Toán 12 Nâng Cao", "author": "Bộ Giáo Dục", "catalog_id": 7, "price": 35000},
            {"title": "Văn 12 - Sách Tham Khảo", "author": "Nhiều Tác Giả", "catalog_id": 7, "price": 45000},
            {"title": "Tiếng Anh 12", "author": "Bộ Giáo Dục", "catalog_id": 7, "price": 42000},
            {"title": "Vật Lý 12 Nâng Cao", "author": "Bộ Giáo Dục", "catalog_id": 7, "price": 38000},
            {"title": "Hóa Học 12", "author": "Bộ Giáo Dục", "catalog_id": 7, "price": 36000},
            {"title": "Sinh Học 12", "author": "Bộ Giáo Dục", "catalog_id": 7, "price": 34000},
            {"title": "Lịch Sử 12", "author": "Bộ Giáo Dục", "catalog_id": 7, "price": 32000},
            {"title": "Địa Lý 12", "author": "Bộ Giáo Dục", "catalog_id": 7, "price": 32000},
            {"title": "Bộ Đề Thi Thử THPT Quốc Gia", "author": "Nhiều Tác Giả", "catalog_id": 7, "price": 85000},

            # Catalog 8: Tâm lý - Triết học
            {"title": "Đời Ngắn Đừng Ngủ Dài", "author": "Robin Sharma", "catalog_id": 8, "price": 95000},
            {"title": "Nghệ Thuật Sống", "author": "Thích Nhất Hạnh", "catalog_id": 8, "price": 75000},
            {"title": "Sức Mạnh Hiện Tại", "author": "Eckhart Tolle", "catalog_id": 8, "price": 135000},
            {"title": "Tâm Lý Học Đám Đông", "author": "Gustave Le Bon", "catalog_id": 8, "price": 85000},
            {"title": "Giải Mã Giấc Mơ", "author": "Sigmund Freud", "catalog_id": 8, "price": 125000},
            {"title": "Con Người Trưởng Thành", "author": "Carl Jung", "catalog_id": 8, "price": 145000},
            {"title": "Siêu Tư Duy", "author": "Edward de Bono", "catalog_id": 8, "price": 115000},
            {"title": "Biết Người Biết Ta", "author": "Nguyễn Hiến Lê", "catalog_id": 8, "price": 89000},

            # Catalog 9: Lịch sử - Địa lý
            {"title": "Lịch Sử Việt Nam", "author": "Trần Trọng Kim", "catalog_id": 9, "price": 185000},
            {"title": "Đại Việt Sử Ký Toàn Thư", "author": "Ngô Sĩ Liên", "catalog_id": 9, "price": 350000},
            {"title": "Súng, Vi Trùng Và Thép", "author": "Jared Diamond", "catalog_id": 9, "price": 215000},
            {"title": "1000 Năm Thăng Long", "author": "Nhiều Tác Giả", "catalog_id": 9, "price": 275000},
            {"title": "Việt Nam Sử Lược", "author": "Trần Trọng Kim", "catalog_id": 9, "price": 125000},
            {"title": "Hồi Ký Chiến Tranh", "author": "Winston Churchill", "catalog_id": 9, "price": 295000},
            {"title": "Thế Giới Phẳng", "author": "Thomas Friedman", "catalog_id": 9, "price": 175000},

            # Catalog 10: Y học - Sức khỏe
            {"title": "Ăn Gì Cho Khỏe", "author": "Bác Sĩ Nguyễn Lân Đính", "catalog_id": 10, "price": 125000},
            {"title": "Sống Khỏe Để Già", "author": "Dr. Nguyễn Ý Đức", "catalog_id": 10, "price": 145000},
            {"title": "Yoga - Nghệ Thuật Chữa Lành", "author": "B.K.S. Iyengar", "catalog_id": 10, "price": 195000},
            {"title": "Đông Y Gia Truyền", "author": "Hải Thượng Lãn Ông", "catalog_id": 10, "price": 225000},
            {"title": "Ăn Sạch Sống Sáng", "author": "Clean Eating", "catalog_id": 10, "price": 115000},
            {"title": "Bí Quyết Sống Thọ", "author": "Dan Buettner", "catalog_id": 10, "price": 165000},

            # Catalog 11: Nghệ thuật - Âm nhạc
            {"title": "Lịch Sử Mỹ Thuật Việt Nam", "author": "Nguyễn Quân", "catalog_id": 11, "price": 285000},
            {"title": "Học Vẽ Căn Bản", "author": "Betty Edwards", "catalog_id": 11, "price": 175000},
            {"title": "Âm Nhạc Việt Nam", "author": "Trần Văn Khê", "catalog_id": 11, "price": 195000},
            {"title": "Nghệ Thuật Nhiếp Ảnh", "author": "Michael Freeman", "catalog_id": 11, "price": 325000},
            {"title": "Thiết Kế Đồ Họa", "author": "David Dabner", "catalog_id": 11, "price": 275000},

            # Catalog 12: Ngoại ngữ
            {"title": "English Grammar In Use", "author": "Raymond Murphy", "catalog_id": 12, "price": 185000},
            {"title": "TOEIC 990", "author": "YBM", "catalog_id": 12, "price": 225000},
            {"title": "IELTS Practice Tests", "author": "Cambridge", "catalog_id": 12, "price": 295000},
            {"title": "Tiếng Nhật Sơ Cấp", "author": "Minna no Nihongo", "catalog_id": 12, "price": 245000},
            {"title": "Tiếng Hàn Cơ Bản", "author": "Seoul University", "catalog_id": 12, "price": 215000},
            {"title": "Tiếng Trung Cơ Bản", "author": "HSK Standard", "catalog_id": 12, "price": 235000},
            {"title": "Từ Điển Anh-Việt", "author": "Lạc Việt", "catalog_id": 12, "price": 165000},

            # Catalog 13: Chính trị - Pháp luật
            {"title": "Luật Dân Sự", "author": "Bộ Tư Pháp", "catalog_id": 13, "price": 125000},
            {"title": "Luật Hình Sự", "author": "Bộ Tư Pháp", "catalog_id": 13, "price": 135000},
            {"title": "Hiến Pháp Việt Nam", "author": "Quốc Hội Việt Nam", "catalog_id": 13, "price": 85000},
            {"title": "Tư Tưởng Hồ Chí Minh", "author": "Nhiều Tác Giả", "catalog_id": 13, "price": 95000},
            {"title": "Đường Kách Mệnh", "author": "Hồ Chí Minh", "catalog_id": 13, "price": 65000},

            # Catalog 14: Tôn giáo - Tâm linh
            {"title": "Phật Giáo Việt Nam", "author": "Thích Minh Châu", "catalog_id": 14, "price": 145000},
            {"title": "Kinh Thánh", "author": "Hội Thánh", "catalog_id": 14, "price": 175000},
            {"title": "Thiền Định Căn Bản", "author": "Thích Nhất Hạnh", "catalog_id": 14, "price": 95000},
            {"title": "Đạo Đức Kinh", "author": "Lão Tử", "catalog_id": 14, "price": 85000},
            {"title": "Tôn Giáo Học Đại Cương", "author": "Nhiều Tác Giả", "catalog_id": 14, "price": 125000},

            # Catalog 15: Thể thao
            {"title": "Luật Bóng Đá", "author": "FIFA", "catalog_id": 15, "price": 75000},
            {"title": "Kỹ Thuật Cơ Bản Bóng Rổ", "author": "NBA Training", "catalog_id": 15, "price": 125000},
            {"title": "Cờ Vua Căn Bản", "author": "Bobby Fischer", "catalog_id": 15, "price": 95000},
            {"title": "Tennis Cho Người Mới", "author": "Roger Federer Foundation", "catalog_id": 15, "price": 135000},
            {"title": "Bơi Lội Căn Bản", "author": "Olympic Training", "catalog_id": 15, "price": 85000},
        ]

        # Sample image URLs
        image_urls = [
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300",
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300",
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300",
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300",
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300",
            "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300",
            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300",
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300",
        ]

        descriptions = [
            "Một cuốn sách tuyệt vời, được nhiều độc giả yêu thích.",
            "Tác phẩm kinh điển không thể bỏ qua trong tủ sách gia đình.",
            "Cuốn sách mang đến những bài học quý giá về cuộc sống.",
            "Được viết bởi tác giả nổi tiếng, đã bán hàng triệu bản trên thế giới.",
            "Nội dung phong phú, hấp dẫn từ đầu đến cuối.",
            "Sách hay, trình bày đẹp, giấy in chất lượng cao.",
            "Một cuốn sách cần đọc ít nhất một lần trong đời.",
            "Tác phẩm đạt nhiều giải thưởng văn học uy tín.",
        ]

        created_count = 0
        for i, book_data in enumerate(books_data):
            isbn = f"978{random.randint(1000000000, 9999999999)}"
            
            book, created = Book.objects.get_or_create(
                title=book_data["title"],
                author=book_data["author"],
                defaults={
                    "isbn": isbn,
                    "price": book_data["price"],
                    "stock": random.randint(10, 200),
                    "catalog_id": book_data["catalog_id"],
                    "description": random.choice(descriptions),
                    "image_url": random.choice(image_urls),
                    "created_by_staff_id": random.randint(1, 10)
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(f"Created book: {book.title}")
            else:
                self.stdout.write(f"Book already exists: {book.title}")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} books"))
