# 🚀 Quick Start Guide - Notification Service & API Gateway

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Redis 7+
- RabbitMQ 3.12+

## 1️⃣ Notification Service Setup (Port 3006)

```powershell
# Navigate to notification service
cd services\notification-service

# Install dependencies
npm install

# Copy environment file
Copy-Item .env.example .env

# Edit .env file with your credentials
notepad .env

# Setup database (run from PostgreSQL)
# Connect to your database and run:
psql -U evdms_user -d evdms -f src\db\schema.sql

# Start in development mode
npm run dev
```

### Required Environment Variables

Edit `.env` file:
```env
PORT=3006
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evdms
DB_USER=evdms_user
DB_PASSWORD=your-password

RABBITMQ_URL=amqp://guest:guest@localhost:5672
REDIS_URL=redis://localhost:6379

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_FROM=+1234567890
```

### Verify Installation

```powershell
# Test notification service
curl http://localhost:3006/health

# Send test email
curl -X POST http://localhost:3006/api/v1/notifications/send `
  -H "Content-Type: application/json" `
  -d '{\"channel\":\"EMAIL\",\"recipient\":{\"email\":\"test@example.com\"},\"subject\":\"Test\",\"content\":\"Hello World\"}'
```

---

## 2️⃣ API Gateway Setup (Port 3000)

```powershell
# Navigate to gateway
cd gateway

# Install dependencies
npm install

# Copy environment file
Copy-Item .env.example .env

# Edit .env file
notepad .env

# Start in development mode
npm run dev
```

### Required Environment Variables

Edit `.env` file:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
DEALER_SERVICE_URL=http://localhost:3002
CUSTOMER_SERVICE_URL=http://localhost:3003
MANUFACTURER_SERVICE_URL=http://localhost:3004
REPORT_SERVICE_URL=http://localhost:3005
NOTIFICATION_SERVICE_URL=http://localhost:3006

CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Verify Installation

```powershell
# Test gateway health
curl http://localhost:3000/health

# Test all services health
curl http://localhost:3000/health/services

# Test API info
curl http://localhost:3000/api
```

---

## 3️⃣ Testing the Integration

### Test 1: Send Notification Through Gateway

```powershell
# First, get a JWT token from auth service
$token = "YOUR_JWT_TOKEN_HERE"

# Send notification through gateway
curl -X POST http://localhost:3000/api/v1/notifications/send `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{
    \"channel\":\"EMAIL\",
    \"recipient\":{\"email\":\"customer@example.com\"},
    \"templateId\":\"welcome_email\",
    \"variables\":{\"customer_name\":\"John Doe\"}
  }'
```

### Test 2: Get Notification History

```powershell
# Get notifications through gateway
curl -X GET "http://localhost:3000/api/v1/notifications?limit=10" `
  -H "Authorization: Bearer $token"
```

### Test 3: Manage Templates

```powershell
# List all templates
curl -X GET http://localhost:3000/api/v1/notifications/templates `
  -H "Authorization: Bearer $token"

# Create new template
curl -X POST http://localhost:3000/api/v1/notifications/templates `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{
    \"name\":\"custom_template\",
    \"type\":\"EMAIL\",
    \"subject\":\"Custom Subject\",
    \"content\":\"<p>Hello {{name}}</p>\",
    \"variables\":[\"name\"]
  }'
```

---

## 4️⃣ Database Initialization

### Create PostgreSQL Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database and user
CREATE DATABASE evdms;
CREATE USER evdms_user WITH PASSWORD 'evdms_password';
GRANT ALL PRIVILEGES ON DATABASE evdms TO evdms_user;

-- Connect to evdms database
\c evdms

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO evdms_user;

-- Run the schema
\i services/notification-service/src/db/schema.sql
```

### Verify Tables

```sql
-- Connect to database
psql -U evdms_user -d evdms

-- List tables
\dt

-- Should see:
-- notifications
-- notification_templates
-- notification_preferences

-- Check template data
SELECT name, type FROM notification_templates;
```

---

## 5️⃣ Common Issues & Solutions

### Issue 1: Database Connection Failed

```powershell
# Check PostgreSQL is running
Get-Service postgresql*

# Start if not running
Start-Service postgresql-x64-14
```

### Issue 2: Redis Connection Failed

```powershell
# Check Redis is running
redis-cli ping
# Should return: PONG

# If not installed, install Redis for Windows
# Or use WSL/Docker
```

### Issue 3: RabbitMQ Connection Failed

```powershell
# Check RabbitMQ is running
rabbitmqctl status

# Access management UI
# http://localhost:15672 (guest/guest)
```

### Issue 4: Email Sending Failed

```env
# For Gmail, you need an "App Password"
# 1. Go to Google Account Settings
# 2. Security > 2-Step Verification
# 3. App passwords > Generate password
# 4. Use generated password in SMTP_PASS
```

### Issue 5: JWT Token Invalid

```javascript
// Make sure JWT_SECRET is the same in:
// 1. auth-service/.env
// 2. gateway/.env

// Token must be passed as:
// Authorization: Bearer <token>
```

---

## 6️⃣ Production Build

### Notification Service

```powershell
cd services\notification-service

# Build
npm run build

# Start production
$env:NODE_ENV="production"
npm start
```

### API Gateway

```powershell
cd gateway

# Build
npm run build

# Start production
$env:NODE_ENV="production"
npm start
```

---

## 7️⃣ Docker Deployment (Optional)

### Build Images

```powershell
# Build notification service
docker build -t evdms-notification-service ./services/notification-service

# Build gateway
docker build -t evdms-api-gateway ./gateway
```

### Run with Docker Compose

```powershell
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f notification-service
docker-compose logs -f api-gateway

# Stop all services
docker-compose down
```

---

## 8️⃣ Monitoring & Logs

### View Logs

```powershell
# Notification service logs
Get-Content services\notification-service\logs\combined.log -Tail 50 -Wait

# Gateway doesn't have file logs by default (console only)
# Check Docker logs if using containers
```

### Health Check Script

Create `check-health.ps1`:
```powershell
# Check all services
$services = @{
    "Gateway" = "http://localhost:3000/health"
    "Auth" = "http://localhost:3001/health"
    "Dealer" = "http://localhost:3002/health"
    "Customer" = "http://localhost:3003/health"
    "Manufacturer" = "http://localhost:3004/health"
    "Report" = "http://localhost:3005/health"
    "Notification" = "http://localhost:3006/health"
}

foreach ($service in $services.GetEnumerator()) {
    try {
        $response = Invoke-WebRequest -Uri $service.Value -UseBasicParsing
        Write-Host "$($service.Key): ✅ OK" -ForegroundColor Green
    } catch {
        Write-Host "$($service.Key): ❌ FAIL" -ForegroundColor Red
    }
}
```

Run it:
```powershell
.\check-health.ps1
```

---

## 9️⃣ API Testing with PowerShell

Save as `test-api.ps1`:
```powershell
# Configuration
$gateway = "http://localhost:3000"
$token = "YOUR_JWT_TOKEN"

# Test 1: Gateway health
Write-Host "`n=== Gateway Health ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$gateway/health" | ConvertTo-Json

# Test 2: Services health
Write-Host "`n=== All Services Health ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$gateway/health/services" | ConvertTo-Json -Depth 3

# Test 3: Send notification
Write-Host "`n=== Send Notification ===" -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$body = @{
    channel = "EMAIL"
    recipient = @{ email = "test@example.com" }
    subject = "Test Email"
    content = "<h1>Test</h1><p>This is a test email</p>"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$gateway/api/v1/notifications/send" `
    -Method POST -Headers $headers -Body $body | ConvertTo-Json

# Test 4: Get notifications
Write-Host "`n=== Get Notifications ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$gateway/api/v1/notifications?limit=5" `
    -Headers $headers | ConvertTo-Json -Depth 2
```

---

## 🎯 Next Steps

1. ✅ Configure email SMTP settings
2. ✅ Set up SMS provider (Twilio/ESMS)
3. ✅ Configure Firebase for push notifications
4. ✅ Test all notification channels
5. ✅ Set up monitoring and alerts
6. ✅ Configure production environment variables
7. ✅ Set up SSL/TLS certificates
8. ✅ Configure load balancing (if needed)

---

## 📚 Additional Resources

- **Notification Service Docs**: `services/notification-service/README_UPDATED.md`
- **API Gateway Docs**: `gateway/README.md`
- **Full Implementation Guide**: `NOTIFICATION_GATEWAY_IMPLEMENTATION.md`
- **Database Schema**: `services/notification-service/src/db/schema.sql`

---

## 🆘 Support

If you encounter issues:

1. Check service logs
2. Verify environment variables
3. Ensure all dependencies are running (PostgreSQL, Redis, RabbitMQ)
4. Check firewall settings
5. Review error messages in console

---

**Happy Coding! 🚀**
