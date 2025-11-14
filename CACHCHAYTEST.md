# HƯỚNG DẪN CHẠY TEST CHO AUTH SERVICE VÀ CUSTOMER SERVICE

## 📋 MỤC LỤC
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Chuẩn bị môi trường](#chuẩn-bị-môi-trường)
3. [Khởi động Services](#khởi-động-services)
4. [Chạy Test](#chạy-test)
5. [Xử lý sự cố](#xử-lý-sự-cố)
6. [Kết quả hiện tại](#kết-quả-hiện-tại)

---

## 🔧 YÊU CẦU HỆ THỐNG

### Phần mềm cần thiết:
- **Docker Desktop** (đang chạy)
- **PowerShell** (Windows 10/11)
- **Docker Compose** (đi kèm Docker Desktop)

### Kiểm tra yêu cầu:
```powershell
# Kiểm tra Docker đang chạy
docker --version
docker-compose --version

# Kiểm tra PowerShell version
$PSVersionTable.PSVersion
```

---

## 🚀 CHUẨN BỊ MÔI TRƯỜNG

### Bước 1: Mở PowerShell
```powershell
# Chạy PowerShell as Administrator (nếu cần)
# Hoặc mở PowerShell thường trong VS Code
```

### Bước 2: Di chuyển đến thư mục project
```powershell
cd c:\OOP-BUILD\EVDealerManagementSystem
```

### Bước 3: Kiểm tra file cấu hình Docker
```powershell
# Kiểm tra các file docker-compose có tồn tại
ls *.yml

# Kết quả mong đợi:
# - docker-compose.yml
# - docker-compose.dev.yml
# - docker-compose.production.yml
```

---

## 🐳 KHỞI ĐỘNG SERVICES

### OPTION 1: Khởi động từ đầu (Recommended cho lần đầu)

#### Bước 1.1: Dừng tất cả containers cũ
```powershell
cd c:\OOP-BUILD\EVDealerManagementSystem
docker-compose -f docker-compose.production.yml down
```

#### Bước 1.2: Build lại images
```powershell
# Build Auth Service
docker-compose -f docker-compose.production.yml build auth-service

# Build Customer Service
docker-compose -f docker-compose.production.yml build customer-service
```
⏱️ **Thời gian**: Mỗi service build khoảng 40-60 giây

#### Bước 1.3: Khởi động tất cả services
```powershell
docker-compose -f docker-compose.production.yml up -d
```

#### Bước 1.4: Đợi services khởi động hoàn toàn
```powershell
# Đợi 60 giây để services khởi động đầy đủ
Start-Sleep -Seconds 60
```

#### Bước 1.5: Kiểm tra trạng thái
```powershell
docker ps --filter "name=evdms" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**Kết quả mong đợi:**
```
NAMES                    STATUS                   PORTS
evdms-customer-service   Up X minutes (healthy)   0.0.0.0:3003->3003/tcp
evdms-auth-service       Up X minutes (healthy)   0.0.0.0:3001->3001/tcp
evdms-redis              Up X minutes (healthy)   0.0.0.0:6379->6379/tcp
evdms-rabbitmq           Up X minutes (healthy)   0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp
```

---

### OPTION 2: Restart services đang chạy (Nhanh hơn)

#### Bước 2.1: Kiểm tra services đang chạy
```powershell
docker ps --filter "name=evdms"
```

#### Bước 2.2: Restart từng service nếu cần
```powershell
# Restart Auth Service
docker rm -f evdms-auth-service
docker-compose -f docker-compose.production.yml up -d auth-service
Start-Sleep -Seconds 35

# Restart Customer Service  
docker rm -f evdms-customer-service
docker-compose -f docker-compose.production.yml up -d customer-service
Start-Sleep -Seconds 30
```

---

### OPTION 3: Rebuild chỉ 1 service (Khi sửa code)

#### Rebuild Auth Service:
```powershell
cd c:\OOP-BUILD\EVDealerManagementSystem
docker-compose -f docker-compose.production.yml build auth-service
docker rm -f evdms-auth-service
docker-compose -f docker-compose.production.yml up -d auth-service
Start-Sleep -Seconds 35
```

#### Rebuild Customer Service:
```powershell
cd c:\OOP-BUILD\EVDealerManagementSystem
docker-compose -f docker-compose.production.yml build customer-service
docker rm -f evdms-customer-service
docker-compose -f docker-compose.production.yml up -d customer-service
Start-Sleep -Seconds 30
```

---

## 🧪 CHẠY TEST

### Test Auth Service

#### Bước 1: Di chuyển đến thư mục auth-service
```powershell
cd c:\OOP-BUILD\EVDealerManagementSystem\auth-service
```

#### Bước 2: Chạy test script
```powershell
powershell -ExecutionPolicy Bypass -File auth-test-clean.ps1
```

⏱️ **Thời gian chạy**: Khoảng 20-30 giây

#### Kết quả hiện tại:
```
Total Tests: 39
Passed: 31
Failed: 8  
Pass Rate: 79.49%
```

**Các test FAILED:**
1. Login with Invalid Password - Expected 401 got 400
2. Login with Non-existent User - Expected 401 got 400
3. Change Password with Correct Old Password - 400 error
4. Login with New Password - 400 error
5. Forgot Password with Non-existent Email - Expected 404 got 400
6. Get Profile without Token - Expected 401 got 403
7. Login as Deactivated User - Expected 403 got 400
8. SQL Injection Attempt - Expected 401 got 400

---

### Test Customer Service

#### Bước 1: Di chuyển đến thư mục customer-service
```powershell
cd c:\OOP-BUILD\EVDealerManagementSystem\customer-service
```

#### Bước 2: Chạy test script
```powershell
powershell -ExecutionPolicy Bypass -File test-customer-simple.ps1
```

⏱️ **Thời gian chạy**: Khoảng 15-25 giây

#### Kết quả hiện tại:
```
Total Tests: 32
Passed: 24
Failed: 7
Skipped: 1
Pass Rate: 75%
```

**Các test FAILED:**
1. **Add Note to Customer** - Returns 200 instead of 201 (minor issue)
2. **Assign Lead to Staff** - Error: Missing staffId parameter
3. **Create Test Drive** - vehicle_id FK constraint violation
4. **Get Test Drive by ID** - Empty ID → 500 error (cascade from #3)
5. **Update Test Drive** - Empty ID → 500 error (cascade from #3)
6. **Update Test Drive Status** - Empty ID → 403 (cascade from #3)
7. **Add Test Drive Feedback** - Empty ID → 403 (cascade from #3)

**Test SKIPPED:**
- **Get Customer Orders** - Endpoint not implemented (by design)

---

## 🔄 CHẠY CẢ HAI TEST LIÊN TIẾP (ONE COMMAND)

```powershell
# Chạy từ thư mục root
cd c:\OOP-BUILD\EVDealerManagementSystem

# Chạy Auth Service test
Write-Host "`n========== TESTING AUTH SERVICE ==========`n" -ForegroundColor Cyan
cd auth-service
powershell -ExecutionPolicy Bypass -File auth-test-clean.ps1

# Chạy Customer Service test
Write-Host "`n========== TESTING CUSTOMER SERVICE ==========`n" -ForegroundColor Cyan
cd ..\customer-service
powershell -ExecutionPolicy Bypass -File test-customer-simple.ps1

Write-Host "`n========== ALL TESTS COMPLETED ==========`n" -ForegroundColor Green
```

---

## 🛠️ XỬ LÝ SỰ CỐ

### Vấn đề 1: Services không khởi động
```powershell
# Xem logs để debug
docker logs evdms-auth-service --tail 50
docker logs evdms-customer-service --tail 50

# Restart lại service có vấn đề
docker rm -f evdms-auth-service
docker-compose -f docker-compose.production.yml up -d auth-service
```

### Vấn đề 2: Connection refused
```powershell
# Kiểm tra ports đang được sử dụng
netstat -ano | findstr "3001"
netstat -ano | findstr "3003"

# Nếu port bị chiếm, kill process hoặc stop service cũ
docker stop $(docker ps -a -q)
```

### Vấn đề 3: Build lỗi
```powershell
# Xóa images cũ và rebuild
docker rmi evdms-auth-service -f
docker rmi evdms-customer-service -f

# Rebuild lại
docker-compose -f docker-compose.production.yml build --no-cache auth-service
docker-compose -f docker-compose.production.yml build --no-cache customer-service
```

### Vấn đề 4: Database connection error
```powershell
# Kiểm tra PostgreSQL/Supabase connection
docker logs evdms-auth-service | Select-String "database"
docker logs evdms-customer-service | Select-String "database"

# Restart lại database services nếu cần
docker restart evdms-postgres
```

### Vấn đề 5: Test script không chạy
```powershell
# Kiểm tra execution policy
Get-ExecutionPolicy

# Nếu bị Restricted, chạy lệnh này:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Hoặc bypass cho 1 lần:
powershell -ExecutionPolicy Bypass -File test-customer-simple.ps1
```

---

## 📊 KẾT QUẢ HIỆN TẠI

### Auth Service: 79.49% Pass (31/39)
✅ **Hoạt động tốt:**
- User Registration (với validation)
- User Login & JWT Authentication
- Token Verification & Refresh
- Password Management cơ bản
- Profile Management
- Admin User Management (CRUD, Role, Status)
- Session Management
- Security (XSS, Long inputs)

❌ **Cần sửa:**
- Status codes không nhất quán (400 vs 401, 403)
- Change password flow có lỗi
- Error handling chưa chuẩn

---

### Customer Service: 75% Pass (24/32)
✅ **Hoạt động tốt:**
- Customer CRUD operations
- Lead Management (Create, Read, Update, Convert)
- Feedback Management (full CRUD)
- Complaint Management (full CRUD)
- Customer Segmentation & Scoring
- Search by Phone/Email

❌ **Cần sửa:**
- Test Drive module: Vehicle FK constraint
- Lead Assign: Parameter binding issue
- Add Note: Status code 200 vs 201

---

## 📝 GHI CHÚ QUAN TRỌNG

### Thứ tự chạy:
1. **LUÔN** build/rebuild service trước khi test
2. **LUÔN** đợi service khởi động xong (30-60s)
3. Chạy test script
4. Nếu test fail, check logs để debug

### Best Practices:
- Sau khi sửa code backend → **PHẢI rebuild** Docker image
- Không rebuild → code mới không được áp dụng
- Kiểm tra logs nếu có lỗi: `docker logs <service-name>`
- Services phải ở trạng thái `(healthy)` trước khi test

### Thời gian ước tính:
- **Full rebuild + test**: ~4-5 phút
- **Restart + test**: ~1-2 phút
- **Chỉ test**: ~30 giây

---

## 🎯 ROADMAP ĐỂ ĐẠT 100%

### Auth Service (cần fix 8 tests):
1. Chuẩn hóa error status codes (400/401/403/404)
2. Fix change password logic
3. Fix forgot password validation
4. Cải thiện authentication error messages

### Customer Service (cần fix 7 tests):
1. **Priority 1**: Tạo default vehicle trong InitDataService (fix 5 tests)
2. **Priority 2**: Fix Lead Assign parameter binding (fix 1 test)
3. **Priority 3**: Change Add Note return status 201 (fix 1 test)

---

## 🔗 THAM KHẢO

- **Auth Service API**: http://localhost:3001/api/v1/auth
- **Customer Service API**: http://localhost:3003/api/v1
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

---

**Tạo ngày**: 14/11/2025  
**Phiên bản**: 1.0  
**Tác giả**: AI Assistant  
**Status**: Auth 79.49% | Customer 75%
