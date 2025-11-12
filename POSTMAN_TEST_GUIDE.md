# Hướng dẫn Test Auth API trên Postman

Auth Service đang chạy tại: **http://localhost:3001**

## Chuẩn bị

### 1. Tạo Environment trong Postman
- Tên: `EVDMS Local`
- Variables:
  - `baseUrl` = `http://localhost:3001`
  - `accessToken` = (để trống, sẽ tự động gán sau login)
  - `refreshToken` = (để trống, sẽ tự động gán sau login)
  - `userId` = (để trống, sẽ tự động gán sau register)

### 2. Khởi động Auth Service
```powershell
cd c:\OOP-BUILD\EVDealerManagementSystem\auth-service
mvnw.cmd spring-boot:run
```

## Các API Test (theo thứ tự)

### 1. Health Check
**GET** `{{baseUrl}}/actuator/health`

**Kết quả mong đợi:**
```json
{
  "status": "UP"
}
```

---

### 2. Test API (Sanity check)
**GET** `{{baseUrl}}/api/v1/auth/test`

**Kết quả mong đợi:**
```
Auth API is working!
```

---

### 3. Đăng ký tài khoản (Register)
**POST** `{{baseUrl}}/api/v1/auth/register`

**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test@123456",
  "fullName": "Test User"
}
```

**Lưu ý:** Password phải có:
- Tối thiểu 8 ký tự
- Ít nhất 1 chữ hoa
- Ít nhất 1 số
- Ít nhất 1 ký tự đặc biệt

**Kết quả mong đợi:**
```json
{
  "message": "Registration successful",
  "userId": "uuid-here"
}
```

**Script (Tests tab - tự động lưu userId):**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("userId", jsonData.userId);
}
```

---

### 4. Đăng nhập (Login)
**POST** `{{baseUrl}}/api/v1/auth/login`

**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "Test@123456"
}
```

**Kết quả mong đợi:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "test@example.com",
  "fullName": "Test User",
  "role": "USER"
}
```

**Script (Tests tab - tự động lưu tokens):**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.token);
    pm.environment.set("refreshToken", jsonData.refreshToken);
}
```

---

### 5. Verify Token
**GET** `{{baseUrl}}/api/v1/auth/verify`

**Headers:**
- `Authorization: Bearer {{accessToken}}`

**Kết quả mong đợi:**
```json
{
  "valid": true,
  "message": "Token is valid"
}
```

---

### 6. Lấy thông tin Profile
**GET** `{{baseUrl}}/api/v1/auth/profile`

**Headers:**
- `Authorization: Bearer {{accessToken}}`

**Kết quả mong đợi:**
```json
{
  "id": "uuid",
  "email": "test@example.com",
  "username": "testuser",
  "fullName": "Test User",
  "role": "USER",
  "avatarUrl": null
}
```

---

### 7. Cập nhật Profile
**PUT** `{{baseUrl}}/api/v1/auth/profile`

**Headers:**
- `Authorization: Bearer {{accessToken}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "fullName": "Test User Updated",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Kết quả mong đợi:**
```json
{
  "message": "Profile updated",
  "fullName": "Test User Updated",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

---

### 8. Refresh Token
**POST** `{{baseUrl}}/api/v1/auth/refresh`

**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**Kết quả mong đợi:**
```json
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

**Script (Tests tab - cập nhật tokens mới):**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.accessToken);
    pm.environment.set("refreshToken", jsonData.refreshToken);
}
```

---

### 9. Đổi mật khẩu (Change Password)
**POST** `{{baseUrl}}/api/v1/auth/change-password`

**Headers:**
- `Authorization: Bearer {{accessToken}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "currentPassword": "Test@123456",
  "newPassword": "NewPass@2025"
}
```

**Kết quả mong đợi:**
```json
{
  "message": "Password changed successfully"
}
```

**Lưu ý:** Sau khi đổi mật khẩu, tất cả sessions sẽ bị revoke. Bạn cần login lại.

---

### 10. Quên mật khẩu (Forgot Password)
**POST** `{{baseUrl}}/api/v1/auth/forgot-password`

**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "email": "test@example.com"
}
```

**Kết quả mong đợi:**
```json
{
  "message": "Reset email sent",
  "token": "reset-token-here"
}
```

**Lưu ý:** Token được trả về chỉ để test dev. Production sẽ gửi qua email.

---

### 11. Reset mật khẩu (Reset Password)
**POST** `{{baseUrl}}/api/v1/auth/reset-password`

**Headers:**
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "token": "reset-token-from-forgot-password",
  "newPassword": "NewPass@2025"
}
```

**Kết quả mong đợi:**
```json
{
  "message": "Password reset successfully"
}
```

---

### 12. Xem danh sách Sessions
**GET** `{{baseUrl}}/api/v1/auth/sessions`

**Headers:**
- `Authorization: Bearer {{accessToken}}`

**Kết quả mong đợi:**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "refreshToken": "token",
    "deviceInfo": "{}",
    "ipAddress": "unknown",
    "expiresAt": "2025-11-10T...",
    "createdAt": "2025-11-03T..."
  }
]
```

---

### 13. Xóa một Session
**DELETE** `{{baseUrl}}/api/v1/auth/sessions/{sessionId}`

**Headers:**
- `Authorization: Bearer {{accessToken}}`

**Path Variables:**
- `sessionId`: UUID của session muốn xóa (lấy từ API sessions ở trên)

**Kết quả mong đợi:**
```json
{
  "message": "Session revoked"
}
```

---

### 14. Đăng xuất (Logout)
**POST** `{{baseUrl}}/api/v1/auth/logout`

**Headers:**
- `Authorization: Bearer {{accessToken}}`
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**Kết quả mong đợi:**
```json
{
  "message": "Logged out successfully"
}
```

**Lưu ý:** Access token sẽ được blacklist trong 15 phút. Sau logout, cần login lại để lấy token mới.

---

### 15. Đăng xuất khỏi tất cả thiết bị (Logout All)
**POST** `{{baseUrl}}/api/v1/auth/logout-all`

**Headers:**
- `X-User-Id: {{userId}}`

**Kết quả mong đợi:**
```json
{
  "message": "Logged out from all devices"
}
```

---

## Lỗi thường gặp

### 401 Unauthorized
- **Nguyên nhân:** Token không hợp lệ hoặc hết hạn
- **Giải pháp:** Dùng refresh token để lấy token mới, hoặc login lại

### 403 Forbidden
- **Nguyên nhân:** Không có quyền truy cập endpoint
- **Giải pháp:** Kiểm tra role của user hoặc endpoint có public không

### 400 Bad Request
- **Nguyên nhân:** Validation lỗi (email sai format, password yếu, field bắt buộc thiếu)
- **Giải pháp:** Kiểm tra lại body request theo đúng format

### 500 Internal Server Error
- **Nguyên nhân:** Lỗi server (duplicate email/username, database error, etc.)
- **Giải pháp:** Xem log server để biết chi tiết lỗi

---

## Tips

1. **Tự động set tokens:** Dùng script trong Tests tab để tự động lưu accessToken và refreshToken sau mỗi login/refresh
2. **Test luồng đầy đủ:** Register → Login → Profile → Refresh → Logout
3. **Test validation:** Thử các trường hợp invalid (email sai, password yếu, field thiếu) để kiểm tra validation
4. **Rate limiting:** Login sai quá 5 lần trong 15 phút sẽ bị block
5. **Token expiry:** Access token hết hạn sau 15 phút, refresh token sau 7 ngày

---

## Database H2 Console (Optional)

Nếu muốn xem trực tiếp database:

**URL:** http://localhost:3001/h2-console

**Thông tin kết nối:**
- JDBC URL: `jdbc:h2:mem:evdms_auth`
- Username: `sa`
- Password: (để trống)

**Lưu ý:** Data sẽ mất khi restart service vì dùng in-memory database.

---

## Chuyển sang PostgreSQL Production

Khi deploy production, set các ENV variables:

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=postgres.grgbbhzjlddgocgyhekd
SPRING_DATASOURCE_PASSWORD=Abc@123456!
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

Service sẽ tự động chuyển từ H2 sang PostgreSQL.
