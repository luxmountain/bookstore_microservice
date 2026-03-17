# Assignment 06 - Industry-Level Microservices Report

## 1) JWT Authentication Service

### Implemented

- New `auth-service` (port `8012`) with endpoints:
  - `POST /api/auth/login/`
  - `POST /api/auth/validate/`
  - `GET /api/auth/health/`
  - `GET /api/auth/metrics/`
- JWT contains `sub`, `username`, `role`, `iat`, `exp`.
- API Gateway validates Bearer token by calling `auth-service`.
- Role-based access control is enforced at Gateway for write operations.

### Demo Accounts (default)

- `manager / manager123`
- `staff / staff123`
- `customer / customer123`

## 2) Saga Pattern (Order Orchestration)

### Implemented orchestration flow

1. Order API creates order in `pending` state.
2. `order.saga.start` event is published to RabbitMQ.
3. `order-saga-worker` sends `payment.reserve` command (RPC over RabbitMQ).
4. `order-saga-worker` sends `shipping.reserve` command (RPC over RabbitMQ).
5. If both succeed: order becomes `confirmed`, emits `order.saga.completed`.
6. If shipping fails after payment success: sends `payment.compensate`, order becomes `cancelled`.
7. If payment fails: order becomes `cancelled`.

### Fault simulation

`POST /api/orders/create_from_cart/` accepts:

- `simulate_payment_failure: true|false`
- `simulate_shipping_failure: true|false`

## 3) Event Bus Integration

### Implemented

- RabbitMQ added (`5672`, management UI `15672`).
- Async queues:
  - `order.saga.start`
  - `payment.reserve`
  - `payment.compensate`
  - `shipping.reserve`
  - `shipping.compensate`
- Dedicated worker containers:
  - `order-saga-worker`
  - `pay-event-worker`
  - `ship-event-worker`

## 4) API Gateway Responsibilities

### Implemented

- Routing (existing proxy behavior retained).
- Authentication validation (`auth-service` integration).
- Logging middleware (`method`, `path`, `status`, `duration_ms`).
- In-memory rate limiting (`120 req / 60 seconds / IP`).

## 5) Observability

### Implemented

- Health endpoints:
  - Gateway: `GET /api/health/`
  - Auth: `GET /api/auth/health/`
  - Orders: `GET /api/orders/health/`
  - Payments: `GET /api/payments/health/`
  - Shipping: `GET /api/shipments/health/`
- Metrics endpoints:
  - Gateway: `GET /api/metrics/`
  - Auth: `GET /api/auth/metrics/`
  - Orders: `GET /api/orders/metrics/`
  - Payments: `GET /api/payments/metrics/`
  - Shipping: `GET /api/shipments/metrics/`

## 6) Load Testing

### Script recommendation

Use k6 or Locust. Example k6 command:

```bash
k6 run scripts/load/order-create.js
```

### Current status in this environment

- Code and architecture are ready for load testing.
- Benchmarks were not executed in this environment because the full multi-container stack was not started during this implementation turn.

## 7) Architecture Justification

- **JWT at Gateway** centralizes auth logic and avoids duplicating token verification in every service.
- **Saga orchestration** keeps distributed transaction logic in one place (`order-saga-worker`).
- **RabbitMQ async commands** reduce tight REST coupling between order/payment/shipping.
- **Compensation actions** provide failure recovery for partial success scenarios.
- **Health + metrics endpoints** improve operational visibility and incident response.
