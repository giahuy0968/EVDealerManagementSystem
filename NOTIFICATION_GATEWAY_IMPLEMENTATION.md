# 🚀 EVDMS Notification Service & API Gateway Implementation

## 📋 Overview

Successfully implemented **Notification Service (Port 3006)** and **API Gateway (Port 3000)** for the EV Dealer Management System.

---

## 📬 NOTIFICATION SERVICE

### ✅ Implemented Features

#### 1. **Core Notification Endpoints**
- ✅ `POST /api/v1/notifications/send` - Send single notification
- ✅ `POST /api/v1/notifications/send-batch` - Batch notifications
- ✅ `GET /api/v1/notifications` - Notification history with filters
- ✅ `GET /api/v1/notifications/:id` - Get notification details
- ✅ `POST /api/v1/notifications/:id/retry` - Retry failed notifications

#### 2. **Template Management**
- ✅ `GET /api/v1/notifications/templates` - List all templates
- ✅ `POST /api/v1/notifications/templates` - Create template
- ✅ `PUT /api/v1/notifications/templates/:id` - Update template
- ✅ `DELETE /api/v1/notifications/templates/:id` - Delete template

#### 3. **User Preferences**
- ✅ `GET /api/v1/notifications/preferences` - Get user preferences
- ✅ `PUT /api/v1/notifications/preferences` - Update preferences

### 🎯 Notification Types (26 Types)

#### Customer-Facing (9 types)
- `WELCOME_EMAIL` - Welcome new customers
- `TEST_DRIVE_CONFIRMATION` - Test drive booking
- `TEST_DRIVE_REMINDER` - 1 day before reminder
- `QUOTATION_SENT` - Price quotation
- `ORDER_CONFIRMED` - Order confirmation
- `ORDER_READY` - Vehicle ready for pickup
- `ORDER_DELIVERED` - Delivery confirmation
- `PAYMENT_RECEIVED` - Payment receipt
- `CONTRACT_SIGNED` - Contract confirmation

#### Staff-Facing (5 types)
- `NEW_LEAD_ASSIGNED` - New lead notification
- `TEST_DRIVE_SCHEDULED` - Test drive booking alert
- `ORDER_CREATED` - New order alert
- `STOCK_LOW` - Low inventory warning
- `CUSTOMER_COMPLAINT` - Complaint notification

#### Manager-Facing (5 types)
- `DAILY_SALES_REPORT` - Daily summary
- `WEEKLY_SUMMARY` - Weekly report
- `MONTHLY_REPORT` - Monthly analytics
- `TARGET_ACHIEVED` - Target milestone
- `DEBT_OVERDUE` - Payment overdue warning

#### Manufacturer-Facing (3 types)
- `STOCK_REQUEST_CREATED` - Stock order from dealer
- `DEALER_SUSPENDED` - Dealer suspension alert
- `NEW_DEALER_REGISTERED` - New dealer onboarding

### 📊 Database Schema

**Three main tables:**

1. **notifications** - Notification records
   - Stores all sent notifications
   - Tracks delivery status
   - Retry count and error messages
   - Metadata for context

2. **notification_templates** - Email/SMS/Push templates
   - Pre-configured message templates
   - Variable substitution support
   - Multi-channel templates
   - Active/inactive status

3. **notification_preferences** - User preferences
   - Email/SMS/Push enable/disable
   - Channel preferences per notification type
   - Per-user customization

### 🔧 Technical Features

#### Multi-Channel Support
- **EMAIL** - SMTP (Nodemailer, Gmail, SendGrid, AWS SES)
- **SMS** - Twilio, ESMS.vn, Viettel SMS Gateway
- **PUSH** - Firebase Cloud Messaging (FCM), OneSignal
- **IN_APP** - Internal notifications

#### Business Logic
- ✅ **Retry mechanism** - 3 attempts with exponential backoff
- ✅ **Rate limiting** - 100 SMS per hour per user
- ✅ **Email validation** - RFC 5322 compliant
- ✅ **Phone validation** - Vietnamese format support
- ✅ **SMS splitting** - Auto-split messages > 160 chars
- ✅ **Unsubscribe links** - Auto-added to emails
- ✅ **Template variables** - `{{variable_name}}` substitution

#### Integrations
- **RabbitMQ** - Event-driven notifications
- **Redis** - Rate limiting and caching
- **PostgreSQL** - Primary data store

### 📁 Project Structure

```
services/notification-service/
├── src/
│   ├── config/
│   │   ├── index.ts              # Configuration
│   │   ├── database.ts           # PostgreSQL connection
│   │   └── rabbitmq.ts           # RabbitMQ setup
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── repositories/
│   │   ├── NotificationRepository.ts
│   │   ├── TemplateRepository.ts
│   │   └── PreferencesRepository.ts
│   ├── services/
│   │   ├── NotificationService.ts # Main logic
│   │   ├── EmailService.ts
│   │   ├── SmsService.ts
│   │   ├── PushService.ts
│   │   └── TemplateService.ts
│   ├── routes/
│   │   └── notifications.ts      # API routes
│   ├── middlewares/              # Auth, validation
│   ├── events/                   # RabbitMQ consumers
│   ├── utils/
│   │   └── logger.ts             # Winston logger
│   ├── db/
│   │   └── schema.sql            # Database schema
│   ├── templates/                # Email templates
│   ├── app.ts                    # Express app
│   └── server.ts                 # Server entry
├── .env.example                  # Environment template
├── package.json
├── tsconfig.json
├── Dockerfile
└── README_UPDATED.md             # Documentation
```

---

## 🌐 API GATEWAY

### ✅ Implemented Features

#### 1. **Service Routing**
- ✅ `/api/v1/auth/*` → Auth Service (3001)
- ✅ `/api/v1/customers/*` → Customer Service (3003)
- ✅ `/api/v1/dealers/*` → Dealer Service (3002)
- ✅ `/api/v1/manufacturers/*` → Manufacturer Service (3004)
- ✅ `/api/v1/reports/*` → Report Service (3005)
- ✅ `/api/v1/notifications/*` → Notification Service (3006)

#### 2. **Middleware Stack**
- ✅ **JWT Authentication** - Token validation
- ✅ **Role-Based Access Control** - Permission checking
- ✅ **Rate Limiting** - 100 req/min per user
- ✅ **Request Logging** - Structured JSON logs
- ✅ **Request Tracing** - Unique request IDs
- ✅ **CORS** - Cross-origin support
- ✅ **Helmet** - Security headers
- ✅ **Error Handling** - Standardized responses

#### 3. **Health Monitoring**
- ✅ `GET /health` - Gateway health check
- ✅ `GET /health/services` - All services status
- ✅ `GET /api` - API information

### 🔐 Authentication & Authorization

#### JWT Token Structure
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "DEALER_ADMIN",
  "iat": 1234567890,
  "exp": 1234567890
}
```

#### Middleware Functions
- **`authenticateToken`** - Validates JWT, extracts user
- **`optionalAuth`** - Non-blocking auth validation
- **`requireRole(...roles)`** - Role-based access

### 🚦 Rate Limiting

**Three tiers:**
1. **Global** - 100 requests/minute (per user/IP)
2. **API** - 60 requests/minute (general APIs)
3. **Strict** - 5 requests/15 minutes (auth endpoints)

### 📁 Project Structure

```
gateway/
├── src/
│   ├── middleware/
│   │   ├── auth.ts              # JWT & RBAC
│   │   ├── rateLimit.ts         # Rate limiters
│   │   └── logging.ts           # Request logging
│   ├── services/
│   │   └── healthCheck.ts       # Health monitoring
│   ├── routes/
│   │   └── registerRoutes.ts    # Proxy routing
│   ├── app.ts                   # Express setup
│   └── server.ts                # Entry point
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md                    # Documentation
```

---

## 🚀 Getting Started

### 1. **Notification Service Setup**

```bash
# Navigate to notification service
cd services/notification-service

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Setup database
psql -U evdms_user -d evdms -f src/db/schema.sql

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

### 2. **API Gateway Setup**

```bash
# Navigate to gateway
cd gateway

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with JWT_SECRET and service URLs

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

---

## 🔧 Environment Configuration

### Notification Service (.env)
```env
PORT=3006
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evdms
DB_USER=evdms_user
DB_PASSWORD=evdms_password

RABBITMQ_URL=amqp://guest:guest@localhost:5672
REDIS_URL=redis://localhost:6379

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_FROM=+1234567890

FCM_SERVER_KEY=your-fcm-key
```

### API Gateway (.env)
```env
PORT=3000
JWT_SECRET=your-secret-key-min-32-characters

AUTH_SERVICE_URL=http://localhost:3001
DEALER_SERVICE_URL=http://localhost:3002
CUSTOMER_SERVICE_URL=http://localhost:3003
MANUFACTURER_SERVICE_URL=http://localhost:3004
REPORT_SERVICE_URL=http://localhost:3005
NOTIFICATION_SERVICE_URL=http://localhost:3006

CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

---

## 📝 API Usage Examples

### Send Email Notification

```bash
POST http://localhost:3006/api/v1/notifications/send
Content-Type: application/json

{
  "channel": "EMAIL",
  "recipient": {
    "id": "user-uuid",
    "email": "customer@example.com"
  },
  "templateId": "welcome_email",
  "variables": {
    "customer_name": "John Doe"
  }
}
```

### Through API Gateway

```bash
POST http://localhost:3000/api/v1/notifications/send
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "channel": "SMS",
  "recipient": {
    "phone": "+84901234567"
  },
  "content": "Your order is ready for pickup!"
}
```

### Check Service Health

```bash
# Gateway health
GET http://localhost:3000/health

# All services health
GET http://localhost:3000/health/services
```

---

## 🎯 Key Features Summary

### Notification Service ✅
- Multi-channel notifications (Email, SMS, Push)
- Template management with variables
- User preferences & channels
- Retry mechanism (3x exponential backoff)
- Rate limiting (100 SMS/hour)
- RabbitMQ event consumers
- PostgreSQL + Redis integration

### API Gateway ✅
- Centralized routing
- JWT authentication
- Role-based access control
- Rate limiting (100 req/min)
- Request tracing (X-Request-ID)
- Service health monitoring
- Error standardization
- CORS & Security headers

---

## 📚 Documentation

- **Notification Service**: `services/notification-service/README_UPDATED.md`
- **API Gateway**: `gateway/README.md`
- **Database Schema**: `services/notification-service/src/db/schema.sql`

---

## 🧪 Testing

```bash
# Test notification service
curl -X POST http://localhost:3006/api/v1/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "EMAIL",
    "recipient": {"email": "test@example.com"},
    "subject": "Test",
    "content": "Test notification"
  }'

# Test gateway health
curl http://localhost:3000/health
curl http://localhost:3000/health/services

# Test protected route through gateway
curl -X GET http://localhost:3000/api/v1/dealers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🐳 Docker Deployment

Both services include Dockerfile and are ready for containerization:

```bash
# Build notification service
docker build -t evdms-notification-service ./services/notification-service

# Build gateway
docker build -t evdms-api-gateway ./gateway

# Run with docker-compose
docker-compose up -d
```

---

## ✅ Implementation Checklist

### Notification Service
- [x] Database schema with 3 tables
- [x] Multi-channel support (Email, SMS, Push)
- [x] Template management CRUD
- [x] User preferences management
- [x] Retry mechanism with backoff
- [x] Rate limiting for SMS
- [x] Email & phone validation
- [x] RabbitMQ integration
- [x] Redis caching
- [x] Comprehensive logging
- [x] Pre-configured templates
- [x] API documentation
- [x] Environment configuration
- [x] Docker support

### API Gateway
- [x] Service routing (6 services)
- [x] JWT authentication
- [x] Role-based access control
- [x] Rate limiting (3 tiers)
- [x] Request logging
- [x] Request ID tracing
- [x] CORS handling
- [x] Security headers (Helmet)
- [x] Health monitoring
- [x] Error handling
- [x] API information endpoint
- [x] Environment configuration
- [x] Docker support
- [x] Complete documentation

---

## 🎉 Result

Both **Notification Service** and **API Gateway** are fully implemented with:
- ✅ Complete feature set as specified
- ✅ Production-ready code structure
- ✅ Comprehensive documentation
- ✅ Environment configuration
- ✅ Docker support
- ✅ Type safety (TypeScript)
- ✅ Error handling
- ✅ Logging & monitoring
- ✅ Security best practices

Ready for integration testing and deployment! 🚀
