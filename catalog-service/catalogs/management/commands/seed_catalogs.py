from django.core.management.base import BaseCommand
from catalogs.models import Catalog


class Command(BaseCommand):
    help = 'Seed catalog data'

    def handle(self, *args, **options):
        catalogs = [
            {"name": "Văn học Việt Nam", "description": "Sách văn học Việt Nam, tiểu thuyết, truyện ngắn"},
            {"name": "Văn học nước ngoài", "description": "Tiểu thuyết, truyện ngắn văn học nước ngoài"},
            {"name": "Kinh tế", "description": "Sách về kinh tế, tài chính, đầu tư"},
            {"name": "Kỹ năng sống", "description": "Sách phát triển bản thân, kỹ năng mềm"},
            {"name": "Khoa học công nghệ", "description": "Sách về khoa học, công nghệ, lập trình"},
            {"name": "Thiếu nhi", "description": "Sách dành cho thiếu nhi, truyện tranh"},
            {"name": "Giáo khoa - Tham khảo", "description": "Sách giáo khoa, sách tham khảo học tập"},
            {"name": "Tâm lý - Triết học", "description": "Sách tâm lý học, triết học"},
            {"name": "Lịch sử - Địa lý", "description": "Sách lịch sử, địa lý, du lịch"},
            {"name": "Y học - Sức khỏe", "description": "Sách về y học, sức khỏe, dinh dưỡng"},
            {"name": "Nghệ thuật - Âm nhạc", "description": "Sách về nghệ thuật, âm nhạc, hội họa"},
            {"name": "Ngoại ngữ", "description": "Sách học ngoại ngữ, từ điển"},
            {"name": "Chính trị - Pháp luật", "description": "Sách về chính trị, pháp luật"},
            {"name": "Tôn giáo - Tâm linh", "description": "Sách về tôn giáo, tâm linh"},
            {"name": "Thể thao", "description": "Sách về thể thao, thể dục"},
        ]

        created_count = 0
        for cat_data in catalogs:
            catalog, created = Catalog.objects.get_or_create(
                name=cat_data["name"],
                defaults={"description": cat_data["description"]}
            )
            if created:
                created_count += 1
                self.stdout.write(f"Created catalog: {catalog.name}")
            else:
                self.stdout.write(f"Catalog already exists: {catalog.name}")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {created_count} catalogs"))
