@echo off
REM Seed Data Script for Bookstore Microservices (Windows)
REM This script seeds data into all microservices in the correct order

echo ==========================================
echo    Seeding Bookstore Microservices Data
echo ==========================================

echo.
echo Waiting for services to be ready...
timeout /t 5 /nobreak >nul

echo.
echo === Phase 1: Seeding independent data ===

echo.
echo ^>^>^> Seeding catalog-service...
docker-compose exec -T catalog-service python manage.py seed_catalogs
echo ^>^>^> catalog-service seeded successfully!

echo.
echo ^>^>^> Seeding staff-service...
docker-compose exec -T staff-service python manage.py seed_staff
echo ^>^>^> staff-service seeded successfully!

echo.
echo ^>^>^> Seeding manager-service...
docker-compose exec -T manager-service python manage.py seed_managers
echo ^>^>^> manager-service seeded successfully!

echo.
echo ^>^>^> Seeding customer-service...
docker-compose exec -T customer-service python manage.py seed_customers
echo ^>^>^> customer-service seeded successfully!

echo.
echo === Phase 2: Seeding dependent data ===

echo.
echo ^>^>^> Seeding book-service...
docker-compose exec -T book-service python manage.py seed_books
echo ^>^>^> book-service seeded successfully!

echo.
echo ^>^>^> Seeding cart-service...
docker-compose exec -T cart-service python manage.py seed_carts
echo ^>^>^> cart-service seeded successfully!

echo.
echo ^>^>^> Seeding order-service...
docker-compose exec -T order-service python manage.py seed_orders
echo ^>^>^> order-service seeded successfully!

echo.
echo === Phase 3: Seeding order-related data ===

echo.
echo ^>^>^> Seeding pay-service...
docker-compose exec -T pay-service python manage.py seed_payments
echo ^>^>^> pay-service seeded successfully!

echo.
echo ^>^>^> Seeding ship-service...
docker-compose exec -T ship-service python manage.py seed_shipments
echo ^>^>^> ship-service seeded successfully!

echo.
echo === Phase 4: Seeding comments and ratings ===

echo.
echo ^>^>^> Seeding comment-rate-service...
docker-compose exec -T comment-rate-service python manage.py seed_comments
echo ^>^>^> comment-rate-service seeded successfully!

echo.
echo ==========================================
echo    All data seeded successfully!
echo ==========================================
echo.
echo Summary:
echo   - 15 Catalogs
echo   - 10 Staff members
echo   - 5 Managers
echo   - 50 Customers
echo   - 100+ Books
echo   - 30 Carts with items
echo   - 100 Orders with items
echo   - 100 Payments
echo   - 100 Shipments
echo   - 200 Comments/Ratings
echo.
pause
