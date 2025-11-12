# 🐳 HƯỚNG DẪN CHẠY DOCKER COMPOSE - EVDMS

## 📋 YÊU CẦU TRƯỚC KHI BẮT ĐẦU

- ✅ **Docker Desktop** đã cài đặt và đang chạy
- ✅ **Git** đã cài đặt (để clone project)
- ✅ Có kết nối internet (để tải Docker images và kết nối Supabase)

---

## 🚀 BƯỚC 1: CHUẨN BỊ MÔI TRƯỜNG

### 1.1. Kiểm tra Docker Desktop đang chạy

**Mở PowerShell** và chạy:

```powershell
docker --version
docker compose version
```

**Kết quả mong đợi:**
```
Docker version 24.0.7, build afdd53b
Docker Compose version v2.23.0
```

### 1.2. Clone hoặc copy project

```powershell
# Nếu dùng Git
git clone https://github.com/giahuy0968/EVDealerManagementSystem.git
cd EVDealerManagementSystem

# Hoặc copy thư mục project vào máy khác
# Sau đó cd vào thư mục root
cd C:\path\to\EVDealerManagementSystem
```

---

## 🏗️ BƯỚC 2: BUILD VÀ KHỞI ĐỘNG SERVICES

### 2.1. Mở PowerShell tại thư mục root của project

```powershell
cd C:\OOP-BUILD\EVDealerManagementSystem
```

### 2.2. Build và khởi động tất cả services

**Lệnh chạy trong PowerShell:**

```powershell
docker compose -f docker-compose.production.yml up -d --build
```

**Giải thích từng tham số:**
- `docker compose` - Lệnh Docker Compose
- `-f docker-compose.production.yml` - Chỉ định file compose (production mode với Supabase)
- `up` - Khởi động containers
- `-d` - Chạy ở chế độ detached (chạy nền)
- `--build` - Build lại Docker images trước khi chạy

**⏱️ Quá trình build lần đầu mất khoảng 5-10 phút** (tải base images + compile Java code)

### 2.3. Theo dõi quá trình build

Trong lúc đợi, bạn có thể xem logs để biết tiến trình:

```powershell
docker compose -f docker-compose.production.yml logs -f
```

Nhấn `Ctrl + C` để thoát xem logs (containers vẫn chạy)

---

## ✅ BƯỚC 3: KIỂM TRA SERVICES ĐANG CHẠY

### 3.1. Xem danh sách containers

```powershell
docker compose -f docker-compose.production.yml ps
```

**Kết quả mong đợi:**

```
NAME                      STATUS         PORTS
evdms-auth-service        Up (healthy)   0.0.0.0:3001->3001/tcp
evdms-customer-service    Up (healthy)   0.0.0.0:3003->3003/tcp
evdms-rabbitmq            Up (healthy)   0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp
evdms-redis               Up (healthy)   0.0.0.0:6379->6379/tcp
```

### 3.2. Kiểm tra health của từng service

#### Auth Service:
```powershell
curl http://localhost:3001/actuator/health
```
**Response:** `{"status":"UP"}`

#### Customer Service:
```powershell
curl http://localhost:3003/actuator/health
```
**Response:** `{"status":"UP"}`

#### RabbitMQ Management UI:
Mở trình duyệt: http://localhost:15672
- Username: `guest`
- Password: `guest`

---

## 📝 BƯỚC 4: XEM LOGS CỦA SERVICES

### 4.1. Xem logs tất cả services

```powershell
docker compose -f docker-compose.production.yml logs -f
```

### 4.2. Xem logs một service cụ thể

#### Auth Service:
```powershell
docker compose -f docker-compose.production.yml logs -f auth-service
```

#### Customer Service:
```powershell
docker compose -f docker-compose.production.yml logs -f customer-service
```

#### RabbitMQ:
```powershell
docker compose -f docker-compose.production.yml logs -f rabbitmq
```

**Nhấn `Ctrl + C` để thoát xem logs**

---

## 🧪 BƯỚC 5: TEST API

### 5.1. Test Auth Service - Đăng ký user

**Trong PowerShell:**

```powershell
curl -X POST http://localhost:3001/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"email\":\"admin@test.com\",\"password\":\"Admin@123\",\"fullName\":\"Admin User\",\"role\":\"ADMIN\"}'
```

**Response mẫu:**
```json
{
  "id": "uuid-here",
  "username": "admin",
  "email": "admin@test.com",
  "fullName": "Admin User",
  "role": "ADMIN",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 5.2. Test Auth Service - Đăng nhập

```powershell
curl -X POST http://localhost:3001/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"Admin@123\"}'
```

**Lưu accessToken từ response** để dùng cho các request tiếp theo!

### 5.3. Test Customer Service - Tạo customer

**Thay YOUR_ACCESS_TOKEN bằng token vừa lấy:**

```powershell
$token = "YOUR_ACCESS_TOKEN"
curl -X POST http://localhost:3003/api/v1/customers `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -H "X-Dealer-Id: 00000000-0000-0000-0000-000000000001" `
  -d '{\"fullName\":\"Nguyen Van A\",\"phone\":\"0912345678\",\"email\":\"a@test.com\",\"source\":\"WEBSITE\",\"customerType\":\"INDIVIDUAL\"}'
```

---

## 🔄 BƯỚC 6: QUẢN LÝ CONTAINERS

### 6.1. Dừng tất cả services

```powershell
docker compose -f docker-compose.production.yml stop
```

### 6.2. Khởi động lại services (không build lại)

```powershell
docker compose -f docker-compose.production.yml start
```

### 6.3. Restart một service cụ thể

```powershell
docker compose -f docker-compose.production.yml restart auth-service
docker compose -f docker-compose.production.yml restart customer-service
```

### 6.4. Dừng và xóa containers (giữ lại volumes/data)

```powershell
docker compose -f docker-compose.production.yml down
```

### 6.5. Dừng và xóa tất cả (kể cả data)

```powershell
docker compose -f docker-compose.production.yml down -v
```

**⚠️ Cảnh báo:** Lệnh này xóa cả data trong RabbitMQ và Redis!

---

## 🔧 BƯỚC 7: BUILD LẠI KHI CÓ THAY ĐỔI CODE

### 7.1. Build lại tất cả services

```powershell
docker compose -f docker-compose.production.yml up -d --build --force-recreate
```

### 7.2. Build lại một service cụ thể

#### Auth Service:
```powershell
docker compose -f docker-compose.production.yml up -d --build --force-recreate auth-service
```

#### Customer Service:
```powershell
docker compose -f docker-compose.production.yml up -d --build --force-recreate customer-service
```

---

## 🐛 BƯỚC 8: XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "Cannot connect to Docker daemon"

**Nguyên nhân:** Docker Desktop chưa chạy

**Fix:**
1. Mở Docker Desktop
2. Đợi icon Docker ở System Tray chuyển màu xanh
3. Chạy lại lệnh

---

### Lỗi 2: "port is already allocated"

**Nguyên nhân:** Port 3001/3003 đang được dùng bởi process khác

**Fix:**

```powershell
# Kiểm tra process đang dùng port
netstat -ano | findstr :3001
netstat -ano | findstr :3003

# Kill process (thay PID bằng số ở cột cuối)
taskkill /PID <PID_NUMBER> /F
```

---

### Lỗi 3: "connection refused" khi gọi API

**Fix:**

```powershell
# Kiểm tra logs xem service có lỗi không
docker compose -f docker-compose.production.yml logs auth-service
docker compose -f docker-compose.production.yml logs customer-service

# Kiểm tra health
docker compose -f docker-compose.production.yml ps
```

---

### Lỗi 4: "build failed" hoặc "Maven build error"

**Fix:**

```powershell
# Clean tất cả và build lại
docker compose -f docker-compose.production.yml down
docker system prune -f
docker compose -f docker-compose.production.yml up -d --build
```

---

## 📊 BƯỚC 9: MONITORING

### 9.1. Xem resource usage của containers

```powershell
docker stats
```

**Output:**
```
CONTAINER ID   NAME                        CPU %   MEM USAGE / LIMIT
abc123...      evdms-auth-service          2.5%    512MB / 2GB
def456...      evdms-customer-service      3.1%    512MB / 2GB
ghi789...      evdms-rabbitmq              1.2%    256MB / 1GB
```

### 9.2. Xem thông tin chi tiết một container

```powershell
docker inspect evdms-auth-service
```

### 9.3. Vào shell của container (debug)

```powershell
# Auth Service
docker exec -it evdms-auth-service sh

# Customer Service
docker exec -it evdms-customer-service sh

# RabbitMQ
docker exec -it evdms-rabbitmq sh

# Redis
docker exec -it evdms-redis sh
```

Gõ `exit` để thoát shell.

---

## 🌍 BƯỚC 10: TRIỂN KHAI LÊN MÁY KHÁC

### 10.1. Copy project sang máy mới

**Cách 1: Dùng Git**
```powershell
git clone https://github.com/giahuy0968/EVDealerManagementSystem.git
cd EVDealerManagementSystem
```

**Cách 2: Copy thư mục**
- Copy toàn bộ thư mục `EVDealerManagementSystem`
- Paste vào máy mới

### 10.2. Trên máy mới, chạy

```powershell
cd C:\path\to\EVDealerManagementSystem
docker compose -f docker-compose.production.yml up -d --build
```

**Lưu ý:** Máy mới phải có:
- Docker Desktop đã cài và chạy
- Kết nối internet (để tải images + kết nối Supabase)

---

## 📖 TỔNG KẾT CÁC LỆNH QUAN TRỌNG

| Mục đích | Lệnh PowerShell |
|----------|----------------|
| **Khởi động lần đầu** | `docker compose -f docker-compose.production.yml up -d --build` |
| **Xem status** | `docker compose -f docker-compose.production.yml ps` |
| **Xem logs** | `docker compose -f docker-compose.production.yml logs -f` |
| **Dừng services** | `docker compose -f docker-compose.production.yml stop` |
| **Khởi động lại** | `docker compose -f docker-compose.production.yml start` |
| **Build lại khi có code mới** | `docker compose -f docker-compose.production.yml up -d --build --force-recreate` |
| **Dừng và xóa** | `docker compose -f docker-compose.production.yml down` |
| **Restart một service** | `docker compose -f docker-compose.production.yml restart auth-service` |

---

## 🎯 CHECKLIST HOÀN THÀNH

- [ ] Docker Desktop đã chạy (icon xanh)
- [ ] Đã cd vào thư mục root project
- [ ] Đã chạy `docker compose up -d --build`
- [ ] Tất cả containers đều `Up (healthy)`
- [ ] Test health endpoints thành công
- [ ] Đăng ký/đăng nhập auth-service OK
- [ ] Tạo customer thành công
- [ ] RabbitMQ Management UI truy cập được

---

## 📞 HỖ TRỢ

Nếu gặp lỗi, check logs:
```powershell
docker compose -f docker-compose.production.yml logs -f
```

Hoặc liên hệ team dev để được hỗ trợ! 🚀
