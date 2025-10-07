
## 📊 BẢNG TỔNG KẾT ENDPOINTS

| Service | Endpoints | Database | Cache | Queue |
|---------|-----------|----------|-------|-------|
| Auth Service | 20+ | PostgreSQL | Redis | - |
| Customer Service | 30+ | PostgreSQL + MongoDB | Redis | Publish |
| Dealer Service | 40+ | PostgreSQL | Redis | Publish |
| Manufacturer Service | 35+ | PostgreSQL | Redis | Publish |
| Report Service | 25+ | MongoDB | Redis | Subscribe |
| Notification Service | 10+ | PostgreSQL | Redis | Subscribe |
| **TOTAL** | **160+** | - | - | - |

---

## 🔄 LUỒNG DỮ LIỆU QUAN TRỌNG

### Use Case 1: Tạo đơn hàng
```
1. Frontend → API Gateway → Dealer Service
2. Dealer Service → Auth Service (verify customer exists)
3. Dealer Service → Customer Service (get customer details)
4. Dealer Service → Check inventory (có xe không?)
5. Dealer Service → Reserve xe trong kho
6. Dealer Service → Save order to DB
7. Dealer Service → Publish 'order.created' event
8. Report Service ← Subscribe event → Update metrics
9. Notification Service ← Subscribe event → Send email
10. Frontend ← Response: Order created successfully
```

### Use Case 2: EVM Staff phân bổ xe
```
1. Frontend → API Gateway → Manufacturer Service
2. Manufacturer Service → Check available inventory
3. Manufacturer Service → Create allocation record
4. Manufacturer Service → Publish 'allocation.created' event
5. Dealer Service ← Subscribe event → Update inventory
6. Notification Service ← Subscribe event → Email dealer
7. Frontend ← Response: Allocation successful
```

### Use Case 3: AI Forecast
```
1. Cronjob trigger (mỗi đêm 2:00 AM)
2. Report Service → Fetch sales data (3 months)
3. Report Service → Call Python ML service (HTTP API)
4. ML Service → Prophet model → Predict demand
5. Report Service ← Receive predictions
6. Report Service → Save to MongoDB
7. Report Service → Publish 'forecast.generated' event
8. Notification Service → Email manager với insights
```

---

## 🛠️ TECH STACK CHO TỪNG SERVICE

### Backend (Node.js + TypeScript)
```typescript
- Express.js - web framework
- TypeORM / Prisma - ORM cho PostgreSQL
- Mongoose - ODM cho MongoDB
- Redis (ioredis) - caching
- RabbitMQ (amqplib) - message queue
- JWT (jsonwebtoken) - authentication
- Bcrypt - password hashing
- Joi - validation
- Winston - logging
- Helmet - security
- Cors - CORS handling
- Axios - HTTP client (service-to-service)
```

### AI/ML (Python - Optional)
```python
- FastAPI - web framework cho ML API
- Prophet - time-series forecasting
- Scikit-learn - ML algorithms
- Pandas - data processing
- NumPy - numerical computing
```

### Database
```
- PostgreSQL 15 - relational data
- MongoDB 6 - analytics, time-series
- Redis 7 - cache, session
```

### Message Queue
```
- RabbitMQ 3.12 - event-driven communication
```

### DevOps
```
- Docker - containerization
- Docker Compose - local development
- Nginx - reverse proxy (production)
```

---

## 📁 CẤU TRÚC CODE MỖI SERVICE

```
service-name/
├── src/
│   ├── config/
│   │   ├── database.ts       # DB connection
│   │   ├── redis.ts          # Redis connection
│   │   └── rabbitmq.ts       # RabbitMQ connection
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Auth, validation, error handling
│   ├── utils/                # Helper functions
│   ├── events/               # RabbitMQ publishers/consumers
│   ├── types/                # TypeScript types
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── tests/                    # Unit + integration tests
├── Dockerfile
├── package.json
├── tsconfig.json
└── .env.example
```
