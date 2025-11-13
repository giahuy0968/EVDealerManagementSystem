# 🚀 QUICK START - Auth Service Testing

## Bước 1: Fix Database (QUAN TRỌNG!)

### Cách 1: Xóa data cũ (Khuyến nghị cho môi trường dev)
```sql
-- Kết nối Supabase SQL Editor và chạy:
TRUNCATE TABLE sessions CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE password_reset_tokens CASCADE;
TRUNCATE TABLE email_verification_tokens CASCADE;
```

### Cách 2: Update data cũ
```sql
-- Nếu muốn giữ data cũ:
UPDATE users SET email_verified = false WHERE email_verified IS NULL;
UPDATE users SET failed_login_attempts = 0 WHERE failed_login_attempts IS NULL;
UPDATE users SET is_active = true WHERE is_active IS NULL;
UPDATE users SET username = email WHERE username IS NULL;
```

## Bước 2: Start Service

```powershell
cd c:\OOP-BUILD\EVDealerManagementSystem\auth-service
mvn spring-boot:run
```

Đợi đến khi thấy:
```
Started AuthServiceApplication in X.XXX seconds
```

## Bước 3: Test API

### Option A: Auto Test (Khuyến nghị)
Mở terminal mới và chạy:
```powershell
cd c:\OOP-BUILD\EVDealerManagementSystem\auth-service
.\test-api.ps1
```

Sẽ tự động test tất cả 8 endpoints!

### Option B: Manual Test

#### Test 1: Health Check
```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/auth/test -Method GET | Select-Object -ExpandProperty Content
```

#### Test 2: Register
```powershell
$registerBody = @{
    email = "demo@test.com"
    username = "demouser"
    password = "Demo123456"
    fullName = "Demo User"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3001/api/auth/register -Method POST -Body $registerBody -ContentType "application/json" | Select-Object -ExpandProperty Content
```

#### Test 3: Login
```powershell
$loginBody = @{
    email = "demo@test.com"
    password = "Demo123456"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:3001/api/auth/login -Method POST -Body $loginBody -ContentType "application/json"
$tokens = $response.Content | ConvertFrom-Json
$tokens | ConvertTo-Json
```

## ✅ Expected Results

**Register:**
```json
{
  "message": "Registration successful",
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Login:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "demo@test.com",
  "fullName": "Demo User",
  "role": "USER"
}
```

## 📝 Endpoints Đã Implement

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/auth/test` | Health check |
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/logout` | Đăng xuất |
| POST | `/api/auth/logout-all` | Đăng xuất tất cả |
| POST | `/api/auth/refresh` | Làm mới token |
| POST | `/api/auth/verify-token` | Xác thực token |
| POST | `/api/auth/verify-email` | Xác thực email |

## 🔥 Security Features

- ✅ BCrypt password hashing
- ✅ JWT access token (24h)
- ✅ JWT refresh token (7 days)
- ✅ Account lockout (15 min after 5 failed attempts)
- ✅ Failed login tracking
- ✅ Session management
- ✅ Input validation
- ✅ Email/Username duplicate check

## 📚 Xem thêm

- `TEST_API_GUIDE.md` - Hướng dẫn chi tiết
- `test-api.ps1` - Script test tự động
- `fix-existing-users.sql` - SQL fix database

---

**Lưu ý:** Service đang chạy ở `http://localhost:3001`
