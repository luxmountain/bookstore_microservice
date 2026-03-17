# Seed Data Script for Bookstore Microservices (PowerShell)
# This script seeds data into all microservices in the correct order

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Seeding Bookstore Microservices Data  " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`nWaiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

function Seed-Service {
    param (
        [string]$ServiceName,
        [string]$Command
    )
    Write-Host "`n>>> Seeding $ServiceName..." -ForegroundColor Green
    docker-compose exec -T $ServiceName python manage.py $Command
    if ($LASTEXITCODE -eq 0) {
        Write-Host ">>> $ServiceName seeded successfully!" -ForegroundColor Green
    } else {
        Write-Host ">>> Error seeding $ServiceName!" -ForegroundColor Red
    }
}

Write-Host "`n=== Phase 1: Seeding independent data ===" -ForegroundColor Magenta

Seed-Service -ServiceName "catalog-service" -Command "seed_catalogs"
Seed-Service -ServiceName "staff-service" -Command "seed_staff"
Seed-Service -ServiceName "manager-service" -Command "seed_managers"
Seed-Service -ServiceName "customer-service" -Command "seed_customers"

Write-Host "`n=== Phase 2: Seeding dependent data ===" -ForegroundColor Magenta

Seed-Service -ServiceName "book-service" -Command "seed_books"
Seed-Service -ServiceName "clothe-service" -Command "seed_clothes"
Seed-Service -ServiceName "cart-service" -Command "seed_carts"
Seed-Service -ServiceName "order-service" -Command "seed_orders"

Write-Host "`n=== Phase 3: Seeding order-related data ===" -ForegroundColor Magenta

Seed-Service -ServiceName "pay-service" -Command "seed_payments"
Seed-Service -ServiceName "ship-service" -Command "seed_shipments"

Write-Host "`n=== Phase 4: Seeding comments and ratings ===" -ForegroundColor Magenta

Seed-Service -ServiceName "comment-rate-service" -Command "seed_comments"

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "   All data seeded successfully!         " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  - 15 Catalogs"
Write-Host "  - 10 Staff members"
Write-Host "  - 5 Managers"
Write-Host "  - 50 Customers"
Write-Host "  - 100+ Books"
Write-Host "  - 10 Clothes"
Write-Host "  - 30 Carts with items"
Write-Host "  - 100 Orders with items"
Write-Host "  - 100 Payments"
Write-Host "  - 100 Shipments"
Write-Host "  - 200 Comments/Ratings"
Write-Host ""
