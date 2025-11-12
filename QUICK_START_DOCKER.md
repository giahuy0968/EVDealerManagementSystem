# 🚀 QUICK START - DOCKER COMPOSE

## ✅ Yêu cầu
- Docker Desktop đã cài và đang chạy (icon xanh ở System Tray)

---

## 🎯 CÁCH 1: DÙNG SCRIPT TỰ ĐỘNG (Khuyên dùng)

### Trên Windows (PowerShell):

**1. Mở PowerShell tại thư mục root project**

```powershell
cd C:\OOP-BUILD\EVDealerManagementSystem
```

**2. Chạy script khởi động**

```powershell
.\start-docker.ps1
```

**3. Đợi 1-2 phút để services khởi động**

**4. Kiểm tra:**
- Auth Service: http://localhost:3001/actuator/health
- Customer Service: http://localhost:3003/actuator/health
- RabbitMQ UI: http://localhost:15672 (guest/guest)

**5. Dừng services khi không dùng:**

```powershell
.\stop-docker.ps1
```

---

## 🎯 CÁCH 2: DÙNG LỆNH DOCKER COMPOSE

### Khởi động:

```powershell
docker compose -f docker-compose.production.yml up -d --build
```

### Xem status:

```powershell
docker compose -f docker-compose.production.yml ps
```

### Xem logs:

```powershell
docker compose -f docker-compose.production.yml logs -f
```

### Dừng:

```powershell
docker compose -f docker-compose.production.yml down
```

---

## 🧪 TEST API NHANH

### 1. Đăng ký user:

```powershell
curl -X POST http://localhost:3001/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"Admin@123\",\"email\":\"admin@test.com\",\"fullName\":\"Admin User\",\"role\":\"ADMIN\"}'
```

### 2. Đăng nhập:

```powershell
curl -X POST http://localhost:3001/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"Admin@123\"}'
```

**Lưu accessToken từ response!**

### 3. Tạo customer:

```powershell
$token = "YOUR_ACCESS_TOKEN_HERE"
curl -X POST http://localhost:3003/api/v1/customers `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -H "X-Dealer-Id: 00000000-0000-0000-0000-000000000001" `
  -d '{\"fullName\":\"Test Customer\",\"phone\":\"0912345678\",\"email\":\"test@test.com\"}'
```

---

## 🐛 Gặp lỗi?

**Xem logs:**
```powershell
docker compose -f docker-compose.production.yml logs -f auth-service
docker compose -f docker-compose.production.yml logs -f customer-service
```

**Restart một service:**
```powershell
docker compose -f docker-compose.production.yml restart auth-service
```

**Build lại khi có code mới:**
```powershell
docker compose -f docker-compose.production.yml up -d --build --force-recreate
```

---

## 📚 Tài liệu đầy đủ

Xem file `DOCKER_GUIDE.md` để biết chi tiết hơn!
