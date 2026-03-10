#!/bin/bash

# Seed Data Script for Bookstore Microservices
# This script seeds data into all microservices in the correct order

set -e

echo "=========================================="
echo "   Seeding Bookstore Microservices Data  "
echo "=========================================="

# Function to run a seed command in a service
seed_service() {
    local service=$1
    local command=$2
    echo ""
    echo ">>> Seeding $service..."
    docker-compose exec -T $service python manage.py $command
    echo ">>> $service seeded successfully!"
}

# Wait for services to be ready
echo ""
echo "Waiting for services to be ready..."
sleep 5

# 1. Seed independent services first (no foreign key dependencies)
echo ""
echo "=== Phase 1: Seeding independent data ==="

seed_service "catalog-service" "seed_catalogs"
seed_service "staff-service" "seed_staff"
seed_service "manager-service" "seed_managers"
seed_service "customer-service" "seed_customers"

# 2. Seed services that depend on previous data
echo ""
echo "=== Phase 2: Seeding dependent data ==="

seed_service "book-service" "seed_books"
seed_service "cart-service" "seed_carts"
seed_service "order-service" "seed_orders"

# 3. Seed services that depend on orders
echo ""
echo "=== Phase 3: Seeding order-related data ==="

seed_service "pay-service" "seed_payments"
seed_service "ship-service" "seed_shipments"

# 4. Seed comments/ratings (depends on customers and books)
echo ""
echo "=== Phase 4: Seeding comments and ratings ==="

seed_service "comment-rate-service" "seed_comments"

echo ""
echo "=========================================="
echo "   All data seeded successfully!         "
echo "=========================================="
echo ""
echo "Summary:"
echo "  - 15 Catalogs"
echo "  - 10 Staff members"
echo "  - 5 Managers"
echo "  - 50 Customers"
echo "  - 100+ Books"
echo "  - 30 Carts with items"
echo "  - 100 Orders with items"
echo "  - 100 Payments"
echo "  - 100 Shipments"
echo "  - 200 Comments/Ratings"
echo ""
