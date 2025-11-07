# API Gateway

The API Gateway is the single entry point for all frontend applications in the EVDMS platform. It handles routing, authentication, rate limiting, and service health monitoring.

## Features

- ✅ Centralized routing to all microservices
- ✅ JWT authentication and authorization
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting (100 requests/minute per user)
- ✅ Request logging and tracing
- ✅ CORS handling
- ✅ Service health monitoring
- ✅ API versioning support
- ✅ Request ID tracking
- ✅ Error handling and response formatting

## Service Routing

The gateway routes requests to the following services:

| Path | Target Service | Port | Authentication |
|------|---------------|------|----------------|
| `/api/v1/auth/*` | Auth Service | 3001 | Public |
| `/api/v1/customers/*` | Customer Service | 3003 | Optional |
| `/api/v1/dealers/*` | Dealer Service | 3002 | Required |
| `/api/v1/manufacturers/*` | Manufacturer Service | 3004 | Required |
| `/api/v1/reports/*` | Report Service | 3005 | Required |
| `/api/v1/notifications/*` | Notification Service | 3006 | Required |

## Endpoints

### Health Checks

- `GET /health` - Gateway health status
- `GET /health/services` - All services health check
- `GET /api` - API information and available endpoints

### Protected Routes

All routes except `/api/v1/auth/*` require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Environment Variables

```env
# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
DEALER_SERVICE_URL=http://localhost:3002
CUSTOMER_SERVICE_URL=http://localhost:3003
MANUFACTURER_SERVICE_URL=http://localhost:3004
REPORT_SERVICE_URL=http://localhost:3005
NOTIFICATION_SERVICE_URL=http://localhost:3006

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# API Version
VERSION=1.0.0
```

## Running the Service

```bash
# Development
npm run dev

# Production
npm run build
npm start

# Type checking
npm run typecheck
```

## Middleware

### 1. Authentication Middleware

- **`authenticateToken`** - Validates JWT token and extracts user information
- **`optionalAuth`** - Validates token if present, doesn't fail if missing
- **`requireRole(...roles)`** - Checks if user has required role

### 2. Rate Limiting

- **Global Rate Limiter** - 100 requests/minute per user or IP
- **API Rate Limiter** - 60 requests/minute for API endpoints
- **Strict Rate Limiter** - 5 requests/15 minutes for sensitive endpoints

### 3. Logging & Tracing

- **Request ID** - Unique ID for each request (`X-Request-ID` header)
- **Request Logger** - Logs all requests with method, path, status, duration

## Authentication

### JWT Token Structure

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "DEALER_ADMIN",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-Based Access

Supported roles:
- `SUPER_ADMIN` - Full system access
- `MANUFACTURER_ADMIN` - Manufacturer management
- `MANUFACTURER_USER` - Manufacturer staff
- `DEALER_ADMIN` - Dealer management
- `DEALER_STAFF` - Dealer staff
- `CUSTOMER` - Customer access

## API Usage Examples

### Public Endpoint (Login)

```bash
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Protected Endpoint (Get Dealers)

```bash
GET http://localhost:3000/api/v1/dealers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Check Service Health

```bash
# Gateway health
GET http://localhost:3000/health

# All services health
GET http://localhost:3000/health/services
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-10-26T10:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "requestId": "uuid-v4",
  "timestamp": "2025-10-26T10:00:00.000Z"
}
```

## Rate Limiting

When rate limit is exceeded:

```json
{
  "success": false,
  "error": "Too many requests, please try again later"
}
```

Headers:
- `RateLimit-Limit` - Request limit
- `RateLimit-Remaining` - Remaining requests
- `RateLimit-Reset` - Reset time (Unix timestamp)

## Service Health Check Response

```json
{
  "success": true,
  "overall": {
    "status": "healthy",
    "healthyCount": 6,
    "totalCount": 6
  },
  "services": [
    {
      "name": "auth-service",
      "url": "http://localhost:3001",
      "status": "healthy",
      "responseTime": 45,
      "timestamp": "2025-10-26T10:00:00.000Z"
    },
    ...
  ]
}
```

## Error Handling

### Common Error Codes

- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Missing or invalid token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Endpoint doesn't exist)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error
- `502` - Bad Gateway (Service unavailable)
- `503` - Service Unavailable

## Request Tracing

Each request gets a unique ID that can be used to trace logs across services:

Request:
```
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
```

Response:
```
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
```

## Load Balancing (Future Enhancement)

The gateway can be configured for round-robin load balancing when services have multiple instances:

```typescript
// Future implementation
const targets = [
  'http://dealer-service-1:3002',
  'http://dealer-service-2:3002',
  'http://dealer-service-3:3002',
];
```

## Monitoring

The gateway logs all requests in JSON format for easy parsing:

```json
{
  "timestamp": "2025-10-26T10:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "GET",
  "path": "/api/v1/dealers",
  "statusCode": 200,
  "duration": "45ms",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

## Security Best Practices

1. **Always use HTTPS in production**
2. **Set strong JWT_SECRET** (minimum 32 characters)
3. **Configure CORS properly** - Don't use `origin: true` in production
4. **Enable helmet security headers**
5. **Keep JWT tokens short-lived** (15-60 minutes)
6. **Use refresh tokens** for longer sessions
7. **Rate limit sensitive endpoints**
8. **Monitor failed authentication attempts**

## Deployment

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
CMD ["node", "dist/server.js"]
```

### Docker Compose

```yaml
api-gateway:
  build: ./gateway
  ports:
    - "3000:3000"
  environment:
    - JWT_SECRET=${JWT_SECRET}
    - AUTH_SERVICE_URL=http://auth-service:3001
    - DEALER_SERVICE_URL=http://dealer-service:3002
    - CUSTOMER_SERVICE_URL=http://customer-service:3003
    - MANUFACTURER_SERVICE_URL=http://manufacturer-service:3004
    - REPORT_SERVICE_URL=http://report-service:3005
    - NOTIFICATION_SERVICE_URL=http://notification-service:3006
  depends_on:
    - auth-service
    - dealer-service
    - customer-service
```

## License

MIT
