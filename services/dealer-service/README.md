# Dealer Service

## Overview
Dealer Service handles all dealer-related operations including vehicle inventory, quotations, orders, stock requests, contracts, and payments.

## Features
- 🚗 Vehicle/Car Management
- 💰 Quotation Management
- 📦 Order Management & Tracking
- 📋 Stock Request Management
- 📄 Contract Management
- 💳 Payment Processing
- 🔔 Event Publishing (RabbitMQ)
- 💾 Caching (Redis)

## Tech Stack
- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (TypeORM)
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Validation**: Joi
- **Logging**: Winston

## API Endpoints (40+)

### Cars
- `GET /api/v1/cars` - Get all cars
- `GET /api/v1/cars/:id` - Get car by ID
- `POST /api/v1/cars/compare` - Compare multiple cars
- `POST /api/v1/cars` - Create new car
- `PUT /api/v1/cars/:id` - Update car
- `DELETE /api/v1/cars/:id` - Delete car
- `PUT /api/v1/cars/:id/stock` - Update car stock

### Quotations
- `GET /api/v1/quotations` - Get all quotations
- `GET /api/v1/quotations/:id` - Get quotation by ID
- `POST /api/v1/quotations` - Create quotation
- `PUT /api/v1/quotations/:id` - Update quotation
- `PUT /api/v1/quotations/:id/status` - Update quotation status
- `DELETE /api/v1/quotations/:id` - Delete quotation

### Orders
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get order by ID
- `GET /api/v1/orders/:id/tracking` - Track order
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/:id/status` - Update order status
- `DELETE /api/v1/orders/:id` - Delete order

### Stock Requests
- `GET /api/v1/stock-requests` - Get all stock requests
- `GET /api/v1/stock-requests/:id` - Get stock request by ID
- `POST /api/v1/stock-requests` - Create stock request
- `PUT /api/v1/stock-requests/:id/status` - Update request status
- `DELETE /api/v1/stock-requests/:id` - Delete stock request

### Contracts
- `GET /api/v1/contracts` - Get all contracts
- `GET /api/v1/contracts/:id` - Get contract by ID
- `POST /api/v1/contracts` - Create contract
- `PUT /api/v1/contracts/:id` - Update contract
- `PUT /api/v1/contracts/:id/status` - Update contract status
- `DELETE /api/v1/contracts/:id` - Delete contract

### Payments
- `GET /api/v1/payments` - Get all payments
- `GET /api/v1/payments/:id` - Get payment by ID
- `POST /api/v1/payments` - Create payment
- `PUT /api/v1/payments/:id/status` - Update payment status
- `DELETE /api/v1/payments/:id` - Delete payment

## Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Redis 7+
- RabbitMQ 3.12+

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

### Environment Variables

```env
PORT=3002
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evdms
DB_USER=evdms_user
DB_PASSWORD=evdms_password

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
CUSTOMER_SERVICE_URL=http://localhost:3003
MANUFACTURER_SERVICE_URL=http://localhost:3004
```

### Running the Service

```bash
# Development mode
npm run dev

# Build
npm run build

# Production mode
npm start
```

## Docker

```bash
# Build image
docker build -t dealer-service .

# Run container
docker run -p 3002:3002 --env-file .env dealer-service
```

## Events Published

- `order.created` - When a new order is created
- `order.status.updated` - When order status changes
- `order.fully.paid` - When order is fully paid
- `payment.created` - When a payment is created
- `payment.status.updated` - When payment status changes
- `stock.request.created` - When a stock request is created
- `stock.request.status.updated` - When stock request status changes

## Database Schema

The service uses TypeORM with automatic schema synchronization in development mode. Main entities:

- **Car** - Vehicle information and inventory
- **Quotation** - Price quotations for customers
- **Order** - Customer orders
- **StockRequest** - Requests for vehicle stock from manufacturer
- **Contract** - Sales contracts
- **Payment** - Payment records

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## License
MIT
