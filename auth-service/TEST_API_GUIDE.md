# HƯỚNG DẪN TEST AUTH-SERVICE API

## 📌 Thông tin service
- **URL**: http://localhost:3001
- **Base Path**: /api/auth

---

## ⚠️ LƯU Ý QUAN TRỌNG

**Cần fix DB trước khi start service:**

```sql
-- Kết nối Supabase và chạy script này:
UPDATE users SET email_verified = false WHERE email_verified IS NULL;
UPDATE users SET failed_login_attempts = 0 WHERE failed_login_attempts IS NULL;
UPDATE users SET is_active = true WHERE is_active IS NULL;
UPDATE users SET username = email WHERE username IS NULL;
```

**Hoặc xóa hết data cũ:**
```sql
TRUNCATE TABLE sessions CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE password_reset_tokens CASCADE;
```

---

## 🚀 CÁCH 1: Test bằng PowerShell (Invoke-WebRequest)

### 1️⃣ Test API Health
```powershell
Invoke-WebRequest -Uri http://localhost:3001/api/auth/test -Method GET | Select-Object -ExpandProperty Content
```

### 2️⃣ Đăng ký user mới
```powershell
$registerBody = @{
    email = "test@example.com"
    username = "testuser"
    password = "password123"
    fullName = "Test User"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3001/api/auth/register -Method POST -Body $registerBody -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### 3️⃣ Đăng nhập
```powershell
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri http://localhost:3001/api/auth/login -Method POST -Body $loginBody -ContentType "application/json"
$loginData = $loginResponse.Content | ConvertFrom-Json

# Lưu token để dùng sau
$accessToken = $loginData.accessToken
$refreshToken = $loginData.refreshToken

Write-Host "Access Token: $accessToken"
Write-Host "Refresh Token: $refreshToken"
```

### 4️⃣ Verify Token
```powershell
$verifyBody = @{
    token = $accessToken
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3001/api/auth/verify-token -Method POST -Body $verifyBody -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### 5️⃣ Refresh Token
```powershell
$refreshBody = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

$newTokens = Invoke-WebRequest -Uri http://localhost:3001/api/auth/refresh -Method POST -Body $refreshBody -ContentType "application/json"
$newTokens.Content | ConvertFrom-Json
```

### 6️⃣ Logout
```powershell
$logoutBody = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3001/api/auth/logout -Method POST -Body $logoutBody -ContentType "application/json" | Select-Object -ExpandProperty Content
```

### 7️⃣ Logout All Devices (cần userId)
```powershell
# Giả sử userId là UUID từ kết quả register
$userId = "your-user-uuid-here"
$headers = @{
    "X-User-Id" = $userId
}

Invoke-WebRequest -Uri http://localhost:3001/api/auth/logout-all -Method POST -Headers $headers | Select-Object -ExpandProperty Content
```

---

## 🚀 CÁCH 2: Test bằng curl

### 1️⃣ Test API Health
```bash
curl http://localhost:3001/api/auth/test
```

### 2️⃣ Đăng ký user
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"username\":\"testuser\",\"password\":\"password123\",\"fullName\":\"Test User\"}"
```

### 3️⃣ Đăng nhập
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### 4️⃣ Verify Token
```bash
curl -X POST http://localhost:3001/api/auth/verify-token \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"YOUR_ACCESS_TOKEN_HERE\"}"
```

### 5️⃣ Refresh Token
```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN_HERE\"}"
```

### 6️⃣ Logout
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"YOUR_REFRESH_TOKEN_HERE\"}"
```

### 7️⃣ Logout All
```bash
curl -X POST http://localhost:3001/api/auth/logout-all \
  -H "X-User-Id: YOUR_USER_UUID_HERE"
```

---

## 🚀 CÁCH 3: Test bằng VS Code REST Client Extension

Tạo file `auth-test.http`:

```http
### 1. Test API
GET http://localhost:3001/api/auth/test

### 2. Register
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "password": "password123",
  "fullName": "Test User"
}

### 3. Login
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### 4. Verify Token
POST http://localhost:3001/api/auth/verify-token
Content-Type: application/json

{
  "token": "{{accessToken}}"
}

### 5. Refresh Token
POST http://localhost:3001/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "{{refreshToken}}"
}

### 6. Logout
POST http://localhost:3001/api/auth/logout
Content-Type: application/json

{
  "refreshToken": "{{refreshToken}}"
}

### 7. Logout All
POST http://localhost:3001/api/auth/logout-all
X-User-Id: {{userId}}
```

---

## 📊 KẾT QUẢ MONG ĐỢI

### ✅ Register Success:
```json
{
  "message": "Registration successful",
  "userId": "uuid-here"
}
```

### ✅ Login Success:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "test@example.com",
  "fullName": "Test User",
  "role": "USER"
}
```

### ✅ Verify Token Success:
```json
{
  "valid": true,
  "message": "Token is valid"
}
```

### ✅ Refresh Token Success:
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

### ✅ Logout Success:
```json
{
  "message": "Logged out successfully"
}
```

---

## 🔥 TEST TÍNH NĂNG BẢO MẬT

### Test Account Lockout (5 lần sai password):
```powershell
# Thử login sai 5 lần
1..5 | ForEach-Object {
    $wrongBody = @{
        email = "test@example.com"
        password = "wrongpassword"
    } | ConvertTo-Json
    
    Invoke-WebRequest -Uri http://localhost:3001/api/auth/login -Method POST -Body $wrongBody -ContentType "application/json"
}

# Lần thứ 6 sẽ bị khóa 15 phút
```

### Test Login với account đã logout:
```powershell
# Sau khi logout, thử dùng refresh token cũ
# Sẽ báo lỗi "Invalid refresh token"
```

---

## 🎯 CHECKLIST TEST

- [ ] API Health check
- [ ] Đăng ký user mới thành công
- [ ] Đăng ký với email duplicate → lỗi
- [ ] Đăng nhập đúng password → có token
- [ ] Đăng nhập sai password → lỗi
- [ ] Đăng nhập sai 5 lần → bị khóa 15 phút
- [ ] Verify token hợp lệ → valid: true
- [ ] Verify token hết hạn → valid: false
- [ ] Refresh token → có token mới
- [ ] Logout → xóa session
- [ ] Logout all → xóa tất cả session
- [ ] Dùng refresh token sau khi logout → lỗi

---

**Tạo bởi:** Auth-Service Team  
**Phiên bản:** 1.0  
**Ngày:** 2025-10-21
