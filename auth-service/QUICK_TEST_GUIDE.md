# ✅ Auth Service - Quick Start

## 🎯 Service đã chạy thành công!

- **URL**: http://localhost:3001
- **Database**: H2 in-memory (không cần setup, mất data khi restart)
- **H2 Console**: http://localhost:3001/h2-console
  - JDBC URL: `jdbc:h2:mem:evdms_auth`
  - Username: `sa`
  - Password: (để trống)

---

## 🚀 Test Nhanh 5 Phút

### 1. Health Check
```bash
curl http://localhost:3001/actuator/health
```
**Expect**: `{"status":"UP"}`

### 2. Register User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo_user",
    "email": "demo@example.com",
    "password": "DemoPass@123",
    "fullName": "Demo User"
  }'
```
**Expect**: `{"message":"Registration successful","userId":"..."}`

### 3. Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "DemoPass@123"
  }'
```
**Expect**: Nhận được `token` và `refreshToken`

### 4. Get Profile (cần token từ bước 3)
```bash
curl http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Logout
```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## 📋 Danh Sách Đầy Đủ API

### Public Endpoints (không cần auth)
- ✅ POST `/api/v1/auth/register` - Đăng ký
- ✅ POST `/api/v1/auth/login` - Đăng nhập
- ✅ POST `/api/v1/auth/refresh` - Refresh token
- ✅ GET `/api/v1/auth/verify` - Verify token
- ✅ POST `/api/v1/auth/forgot-password` - Quên mật khẩu
- ✅ POST `/api/v1/auth/reset-password` - Reset mật khẩu
- ✅ POST `/api/v1/auth/verify-email` - Xác thực email
- ✅ GET `/api/v1/auth/test` - Test endpoint
- ✅ GET `/actuator/health` - Health check
- ✅ GET `/actuator/info` - Info

### Protected Endpoints (cần Bearer token)
- ✅ POST `/api/v1/auth/logout` - Đăng xuất
- ✅ POST `/api/v1/auth/logout-all` - Đăng xuất tất cả
- ✅ POST `/api/v1/auth/change-password` - Đổi mật khẩu
- ✅ GET `/api/v1/auth/profile` - Lấy profile
- ✅ PUT `/api/v1/auth/profile` - Cập nhật profile
- ✅ PUT `/api/v1/auth/profile/avatar` - Upload avatar
- ✅ GET `/api/v1/auth/sessions` - Danh sách sessions
- ✅ DELETE `/api/v1/auth/sessions/{id}` - Xóa session

### Admin Endpoints (cần role ADMIN)
- ✅ GET `/api/v1/auth/users` - Danh sách users
- ✅ GET `/api/v1/auth/users/{id}` - Chi tiết user
- ✅ PUT `/api/v1/auth/users/{id}` - Cập nhật user
- ✅ DELETE `/api/v1/auth/users/{id}` - Xóa user (soft delete)
- ✅ PUT `/api/v1/auth/users/{id}/role` - Đổi role
- ✅ PUT `/api/v1/auth/users/{id}/status` - Đổi status

---

## 📖 Hướng Dẫn Chi Tiết

Xem file: **`POSTMAN_TEST_GUIDE.md`** để có:
- Collection Postman đầy đủ
- Test scripts tự động
- Các test cases
- Xử lý lỗi
- Best practices

---

## ⚙️ Cấu Hình

### Token Expiry
- Access Token: **15 phút**
- Refresh Token: **7 ngày**

### Security
- Password: min 8 ký tự, 1 chữ hoa, 1 số, 1 ký tự đặc biệt
- Account lockout: 5 lần sai → lock 15 phút
- Rate limiting: 5 requests/15 min (login)

### Roles
- `ADMIN` - Quản trị viên
- `DEALER_MANAGER` - Quản lý đại lý
- `DEALER_STAFF` - Nhân viên đại lý
- `EVM_STAFF` - Nhân viên EVM

---

## 🛠️ Lệnh Hữu Ích

### Start Service
```powershell
cd c:\OOP-BUILD\EVDealerManagementSystem\auth-service
mvn spring-boot:run
```

### Stop Service
```
Ctrl + C
```

### Kill Port 3001 (nếu bị chiếm)
```powershell
Get-NetTCPConnection -LocalPort 3001 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Build JAR
```powershell
mvn clean package -DskipTests
```

### Run JAR
```powershell
java -jar target\auth-service-0.0.1-SNAPSHOT.jar
```

---

## 🐛 Xử Lý Lỗi

### 401 Unauthorized
- Token hết hạn → Dùng refresh token
- Token không hợp lệ → Login lại

### 403 Forbidden
- Không có quyền → Kiểm tra role
- Endpoint yêu cầu ADMIN

### 400 Bad Request
- Validation lỗi → Kiểm tra body
- Email/username đã tồn tại

### 503 Service Unavailable
- Service chưa chạy → Start service
- Port bị chiếm → Kill port 3001

---

## 💡 Tips

1. **Postman Environment**: Tạo biến `baseUrl`, `accessToken`, `refreshToken` để tái sử dụng
2. **Auto-save tokens**: Dùng Tests script trong Postman để tự động lưu tokens
3. **H2 Console**: Xem dữ liệu realtime tại `/h2-console`
4. **Rate Limit**: Nếu bị block, đổi `ipAddress` trong login request
5. **Data**: H2 in-memory sẽ reset khi restart service

---

**Status**: ✅ Running on port 3001  
**Version**: 0.0.1-SNAPSHOT  
**Last Updated**: 2025-11-03 21:28
