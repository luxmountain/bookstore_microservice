# BookStore Microservices

A microservice-based bookstore built with **Django REST Framework**, **Docker Compose**, and independent databases.

## Architecture

| #   | Service                    | Port | Description                                             |
| --- | -------------------------- | ---- | ------------------------------------------------------- |
| 1   | **api-gateway**            | 8000 | Routes all client requests to downstream services       |
| 1.1 | **auth-service**           | 8012 | JWT issuance/validation + role claims                   |
| 2   | **staff-service**          | 8001 | Staff user management (CRUD)                            |
| 3   | **manager-service**        | 8002 | Manager user management (CRUD)                          |
| 4   | **customer-service**       | 8003 | Customer registration (auto-creates cart) & login       |
| 5   | **catalog-service**        | 8004 | Book categories/catalogs                                |
| 6   | **book-service**           | 8005 | Book CRUD (managed by staff), search, stock             |
| 7   | **cart-service**           | 8006 | Shopping cart add/view/update/remove                    |
| 8   | **order-service**          | 8007 | Order creation (triggers payment & shipping)            |
| 9   | **ship-service**           | 8008 | Shipment tracking & status                              |
| 10  | **pay-service**            | 8009 | Payment processing & refunds                            |
| 11  | **comment-rate-service**   | 8010 | Book ratings & comments                                 |
| 12  | **recommender-ai-service** | 8011 | AI-based book recommendations (collaborative filtering) |

## Quick Start

```bash
docker-compose up --build
```

## API Endpoints (via Gateway at port 8000)

### Customers

- `POST /api/customers/register/` — Register (auto-creates cart)
- `POST /api/customers/login/`
- `GET /api/customers/`

### Books

- `GET /api/books/` — List all books
- `POST /api/books/` — Create book (staff)
- `GET /api/books/{id}/`
- `GET /api/books/search/?q=keyword`
- `GET /api/books/by_catalog/?catalog_id=1`

### Cart

- `GET /api/carts/by_customer/?customer_id=1` — View cart
- `POST /api/carts/add_item/` — Add book to cart `{customer_id, book_id, quantity}`
- `PUT /api/carts/update_item/` — Update quantity `{customer_id, book_id, quantity}`
- `DELETE /api/carts/remove_item/?customer_id=1&book_id=1`

### Orders

- `POST /api/orders/create_from_cart/` — Create order `{customer_id, payment_method, shipping_method, shipping_address}`
- `GET /api/orders/by_customer/?customer_id=1`
- `POST /api/orders/{id}/cancel/`

### Payments

- `GET /api/payments/by_order/?order_id=1`
- `POST /api/payments/{id}/process/`
- `POST /api/payments/{id}/refund/`

### Shipping

- `GET /api/shipments/by_order/?order_id=1`
- `GET /api/shipments/track/?tracking_number=SHIP-XXXX`
- `POST /api/shipments/{id}/update_status/` — `{status: "shipped"}`

### Comments & Ratings

- `POST /api/comments/` — `{customer_id, book_id, rating, comment}`
- `GET /api/comments/by_book/?book_id=1`
- `GET /api/comments/by_customer/?customer_id=1`

### Recommendations

- `GET /api/recommendations/?customer_id=1&top_n=5`

### Catalogs

- `GET /api/catalogs/`
- `POST /api/catalogs/` — `{name, description}`

### Staff & Managers

- `GET /api/staff/`
- `POST /api/staff/`
- `GET /api/managers/`
- `POST /api/managers/`

## Inter-Service Communication

Hybrid communication model:

- **REST HTTP** for gateway proxying and query-style fetches.
- **RabbitMQ messaging** for order/payment/shipping Saga orchestration.

- **customer-service → cart-service**: Auto-create cart on registration
- **order-service → cart-service**: Fetch cart items
- **order-service → book-service**: Fetch prices, update stock
- **order-saga-worker → pay-event-worker**: `payment.reserve` / `payment.compensate`
- **order-saga-worker → ship-event-worker**: `shipping.reserve`
- **cart-service → book-service**: Enrich cart items with book details
- **recommender-ai-service → comment-rate-service**: Fetch all ratings
- **recommender-ai-service → book-service**: Fetch book details
- **api-gateway → all services**: Proxy HTTP requests

## Assignment 06 Deliverables

See [docs/ASSIGNMENT_06_REPORT.md](docs/ASSIGNMENT_06_REPORT.md) for JWT, Saga, RabbitMQ, observability, fault simulation, and load-testing notes.

## Technical Stack

### Backend

- **Framework**: Django 4.x + Django REST Framework
- **Language**: Python 3.11
- **Database**: PostgreSQL 15 (independent database per service)
- **Inter-service**: REST HTTP (requests library)
- **Containerization**: Docker + Docker Compose
- **AI**: Collaborative filtering (recommender-ai-service)

### Frontend

- **Main App** (port 3000): React 18 + Vite + TypeScript
- **Admin Dashboard** (port 3001): Next.js 14 + TypeScript + Shadcn UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Package Manager**: Yarn

## Frontend Applications

### Customer Web App (port 3000)

Main customer-facing application built with React + Vite.

```bash
cd frontend
yarn install
yarn dev
```

### Admin Dashboard (port 3001)

Prisma Studio-like data management interface built with Next.js 14 and Shadcn UI.

```bash
cd admin-dashboard
yarn install
yarn dev
```

Access at: http://localhost:3001

Features:

- 📊 View all service data in beautiful tables
- 🔍 Search and filter data
- 📄 Pagination
- 🔄 Real-time refresh
- 📱 Fully responsive

## Seed Data

The project includes seed scripts to populate databases with test data:

```powershell
# PowerShell (Windows)
.\seed_data.ps1

# Batch (Windows)
seed_data.bat

# Bash (Linux/Mac)
./seed_data.sh
```

This will create:

- 15 Catalogs
- 10 Staff members
- 5 Managers
- 50 Customers
- 100+ Books
- 30 Carts with items
- 100 Orders with items
- 100 Payments
- 100 Shipments
- 200 Comments/Ratings

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Fast setup and common commands
- **[GitHub Copilot Guide](COPILOT_GUIDE.md)** - Using Copilot with this project
- **[Admin Dashboard Guide](admin-dashboard/README.md)** - Admin dashboard documentation
- **[Copilot Instructions](.github/copilot-instructions.md)** - AI assistance configuration

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bookstore_microservice
   ```

2. **Start all services**

   ```bash
   docker-compose up --build -d
   ```

3. **Wait for services to be healthy**

   ```bash
   docker-compose ps
   ```

4. **Seed test data**

   ```powershell
   .\seed_data.ps1
   ```

5. **Access applications**
   - Frontend: http://localhost:3000
   - Admin Dashboard: http://localhost:3001
   - API Gateway: http://localhost:8000

## 🛠️ Development

### Backend Services

```bash
# View logs
docker-compose logs -f [service-name]

# Execute commands in container
docker-compose exec [service-name] bash

# Run migrations
docker-compose exec [service-name] python manage.py migrate

# Create superuser
docker-compose exec [service-name] python manage.py createsuperuser
```

### Frontend Development

```bash
# React App
cd frontend
yarn install
yarn dev

# Admin Dashboard
cd admin-dashboard
yarn install
yarn dev
```

## 📊 Service URLs

| Service          | Development | Docker | Admin Link                                     |
| ---------------- | ----------- | ------ | ---------------------------------------------- |
| API Gateway      | -           | :8000  | -                                              |
| Frontend         | :3000       | :3000  | -                                              |
| Admin Dashboard  | :3000       | :3001  | [View](http://localhost:3001)                  |
| Catalog Service  | -           | :8004  | [Data](http://localhost:3001/service/catalog)  |
| Book Service     | -           | :8005  | [Data](http://localhost:3001/service/book)     |
| Customer Service | -           | :8003  | [Data](http://localhost:3001/service/customer) |
| Staff Service    | -           | :8001  | [Data](http://localhost:3001/service/staff)    |
| Manager Service  | -           | :8002  | [Data](http://localhost:3001/service/manager)  |
| Cart Service     | -           | :8006  | [Data](http://localhost:3001/service/cart)     |
| Order Service    | -           | :8007  | [Data](http://localhost:3001/service/order)    |
| Payment Service  | -           | :8009  | [Data](http://localhost:3001/service/payment)  |
| Shipping Service | -           | :8008  | [Data](http://localhost:3001/service/shipping) |
| Comment Service  | -           | :8010  | [Data](http://localhost:3001/service/comment)  |

## 🤝 Contributing

Contributions are welcome! Please read the coding standards in the [Copilot Instructions](.github/copilot-instructions.md) file.

## 📄 License

This project is for educational purposes.

## 🔗 Useful Resources

- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL](https://www.postgresql.org/docs/)

---

**Built with ❤️ using Microservices Architecture**
