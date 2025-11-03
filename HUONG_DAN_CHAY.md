# HƯỚNG DẪN CHẠY DOCKER COMPOSE CHO AUTH & CUSTOMER SERVICE

## Các bước đơn giản:

### Bước 1: Mở Docker Desktop
- Tìm **Docker Desktop** trong Start Menu và mở lên
- Đợi icon Docker ở System Tray (góc dưới phải màn hình) chuyển sang màu xanh
- Mất khoảng 1-2 phút

### Bước 2: Mở PowerShell trong VS Code
- Trong VS Code, mở Terminal: **Ctrl + `** (phím backtick bên dưới Esc)
- Hoặc menu **Terminal > New Terminal**
- Đảm bảo terminal hiện "PowerShell" (góc phải trên)

### Bước 3: Chạy script tự động
```powershell
.\start-docker.ps1
```

**Script này sẽ tự động:**
- Kiểm tra Docker có chạy không
- Dừng containers cũ (nếu có)
- Build image cho auth-service và customer-service (mất 5-10 phút lần đầu)
- Khởi động tất cả services (RabbitMQ, Redis, Auth, Customer)
- Hiển thị trạng thái và URLs để test

### Bước 4: Đợi và kiểm tra
- Script sẽ tự động đợi services khởi động (30-60 giây)
- Sau khi xong, bạn sẽ thấy:
  - ✅ `All services are healthy!` (nếu thành công)
  - ⚠️ `Some services may still be starting...` (cần đợi thêm)

### Bước 5: Test API
Mở trình duyệt hoặc Postman để test:

**Health Check:**
- Auth Service: http://localhost:3001/actuator/health
- Customer Service: http://localhost:3003/actuator/health

**Đăng ký user mới:**
```bash
POST http://localhost:3001/api/v1/auth/register
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123",
  "email": "admin@evdms.com",
  "role": "ADMIN"
}
```

**Login để lấy token:**
```bash
POST http://localhost:3001/api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123"
}
```

**Tạo customer (cần token từ bước trên):**
```bash
POST http://localhost:3003/api/v1/customers
Content-Type: application/json
Authorization: Bearer [token_tu_login]

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0123456789",
  "address": "123 Street, City"
}
```

---

## Nếu Gặp Lỗi:

### Lỗi: "Docker not running"
**Giải pháp:** Mở Docker Desktop và đợi nó khởi động xong

### Lỗi: "Port already in use"
**Giải pháp:**
```powershell
# Dừng tất cả containers
docker compose -f docker-compose.production.yml down

# Hoặc tìm process đang dùng port
netstat -ano | findstr :3001
netstat -ano | findstr :3003
```

### Lỗi: "Build failed"
**Giải pháp:**
```powershell
# Xem logs chi tiết
docker compose -f docker-compose.production.yml logs auth-service
docker compose -f docker-compose.production.yml logs customer-service
```

### Services không healthy sau 60 giây
**Giải pháp:**
```powershell
# Kiểm tra trạng thái
docker compose -f docker-compose.production.yml ps

# Xem logs để tìm lỗi
docker compose -f docker-compose.production.yml logs -f
```

---

## Lệnh Thường Dùng:

```powershell
# Xem logs của tất cả services
docker compose -f docker-compose.production.yml logs -f

# Xem logs của 1 service cụ thể
docker compose -f docker-compose.production.yml logs -f auth-service

# Khởi động lại 1 service
docker compose -f docker-compose.production.yml restart auth-service

# Dừng tất cả
docker compose -f docker-compose.production.yml stop

# Khởi động lại (không build)
docker compose -f docker-compose.production.yml start

# Xóa hoàn toàn
docker compose -f docker-compose.production.yml down

# Dọn dẹp images cũ
docker system prune -a
```

---

## Chạy Trên Thiết Bị Khác:

**Các file cần copy:**
1. Thư mục `auth-service/` (toàn bộ)
2. Thư mục `customer-service/` (toàn bộ)
3. File `docker-compose.production.yml`
4. File `start-docker.ps1` (optional)
5. File này (`HUONG_DAN_CHAY.md`)

**Yêu cầu:**
- Docker Desktop đã cài đặt và chạy
- Kết nối internet (để pull images: RabbitMQ, Redis)
- Kết nối đến Supabase (database ở cloud)

**Chạy:**
```powershell
# Trong thư mục chứa docker-compose.production.yml
docker compose -f docker-compose.production.yml up -d --build
```

---

## Lưu Ý Merge với Main Branch:

**Các file đã thay đổi:**
- ✅ `auth-service/Dockerfile` (mới)
- ✅ `customer-service/Dockerfile` (mới)
- ✅ `docker-compose.production.yml` (mới)
- ✅ `start-docker.ps1` (mới)
- ✅ `stop-docker.ps1` (mới)
- ✅ Các file .md hướng dẫn (mới)

**KHÔNG thay đổi:**
- ❌ Các services khác (dealer, manufacturer, report, notification...)
- ❌ API Gateway
- ❌ Frontend
- ❌ Shared code

**Khi merge:**
```bash
git add auth-service/Dockerfile
git add customer-service/Dockerfile
git add docker-compose.production.yml
git add start-docker.ps1 stop-docker.ps1
git add *.md
git commit -m "Add Docker Compose setup for auth-service and customer-service"
git push origin your-branch
```

---

**Hỗ trợ:** Nếu gặp vấn đề, chạy lệnh này và gửi kết quả:
```powershell
docker compose -f docker-compose.production.yml ps
docker compose -f docker-compose.production.yml logs --tail=50
```
