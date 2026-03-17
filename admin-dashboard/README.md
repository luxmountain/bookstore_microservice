# Bookstore Admin Studio

Một giao diện quản trị dữ liệu tương tự Prisma Studio được xây dựng bằng Next.js 14 và Shadcn UI để quản lý và xem dữ liệu từ các microservices trong hệ thống bookstore.

## ✨ Tính năng

- 🎨 **Giao diện đẹp mắt**: Sử dụng Shadcn UI với Tailwind CSS
- 📊 **Xem dữ liệu**: Hiển thị dữ liệu từ tất cả các microservices
- 🔍 **Tìm kiếm**: Tìm kiếm nhanh trong dữ liệu
- 📄 **Phân trang**: Hiển thị dữ liệu theo trang
- 🔄 **Refresh**: Làm mới dữ liệu theo thời gian thực
- 📱 **Responsive**: Hỗ trợ mọi kích thước màn hình

## 🚀 Các Services được hỗ trợ

- 📚 **Catalog Service** - Danh mục sách
- 📖 **Book Service** - Quản lý sách
- 👥 **Customer Service** - Khách hàng
- 👨‍💼 **Staff Service** - Nhân viên
- 👔 **Manager Service** - Quản lý
- 🛒 **Cart Service** - Giỏ hàng
- 📦 **Order Service** - Đơn hàng
- 💳 **Payment Service** - Thanh toán
- 🚚 **Shipping Service** - Vận chuyển
- ⭐ **Comment Service** - Đánh giá

## 🛠️ Công nghệ sử dụng

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **Radix UI** - Headless UI components
- **Lucide Icons** - Icon library
- **Axios** - HTTP client

## 📦 Cài đặt

### Chạy với Docker (Khuyến nghị)

```bash
# Build và start tất cả services
docker-compose up --build admin-dashboard

# Hoặc start tất cả
docker-compose up -d
```

Admin Dashboard sẽ chạy tại: **http://localhost:3001**

### Chạy Development Mode

```bash
cd admin-dashboard

# Install dependencies
yarn install

# Run dev server
yarn dev
```

Application sẽ chạy tại: **http://localhost:3000**

## 🎯 Sử dụng

1. **Truy cập trang chủ**: Mở http://localhost:3001
2. **Chọn service**: Click vào một trong các service cards
3. **Xem dữ liệu**: Browse, search và xem dữ liệu
4. **Refresh**: Click nút refresh để cập nhật dữ liệu mới nhất

## 📁 Cấu trúc thư mục

```
admin-dashboard/
├── app/
│   ├── service/[id]/
│   │   └── page.tsx          # Service detail page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── ui/                    # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   └── ...
│   └── data-table.tsx         # Data table component
├── lib/
│   ├── api.ts                 # API client & config
│   └── utils.ts               # Utility functions
├── Dockerfile
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## ⚙️ Cấu hình

Cấu hình API endpoint trong file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ADMIN_USERNAME=manager
NEXT_PUBLIC_ADMIN_PASSWORD=manager123
```

Hoặc khi chạy trong Docker, URL sẽ tự động được set thành `http://api-gateway:8000`

Dashboard sẽ tự đăng nhập qua endpoint `/api/auth/login/` và tự gắn `Authorization: Bearer <token>` vào các request.

## 🎨 Screenshots

### Trang chủ

Hiển thị tất cả các services với icons và mô tả.

### Service Detail

Xem dữ liệu dưới dạng bảng với tính năng:

- Tìm kiếm
- Phân trang
- Refresh
- Responsive design

## 🔧 Customization

### Thêm service mới

Chỉnh sửa file `lib/api.ts`:

```typescript
export const services: Service[] = [
  // ... existing services
  {
    id: "new-service",
    name: "New Service",
    displayName: "Tên hiển thị",
    endpoint: "/api-endpoint/",
    icon: "🎯",
    color: "bg-purple-500",
    description: "Mô tả service",
  },
];
```

### Thay đổi theme

Chỉnh sửa file `app/globals.css` để thay đổi color scheme.

## 📝 Notes

- Đảm bảo API Gateway đang chạy trước khi start Admin Dashboard
- Data được fetch từ API Gateway tại port 8000
- CORS đã được cấu hình sẵn để cho phép requests từ Admin Dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of the Bookstore Microservices system.
