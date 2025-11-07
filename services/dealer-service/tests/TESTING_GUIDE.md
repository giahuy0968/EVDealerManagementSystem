# 🧪 HƯỚNG DẪN TEST DEALER SERVICE

## ✅ ĐÃ HOÀN THÀNH
- ✅ Cài đặt dependencies (`npm install`)
- ✅ Tạo file `.env` với config Supabase
- ✅ Tạo test server đơn giản (không cần database)
- ✅ Tạo test script

## 🚀 CÁCH TEST

### Bước 1: Mở Terminal 1 - Khởi động Service

```powershell
cd services\dealer-service
node test-simple.js
```

**Kết quả mong đợi:**
```
✅ Dealer Service TEST MODE running on http://localhost:3002
📊 Test endpoints:
   - GET http://localhost:3002/health
   - GET http://localhost:3002/api/v1/cars
   - GET http://localhost:3002/api/v1/orders
   - GET http://localhost:3002/api/v1/quotations
```

### Bước 2: Mở Terminal 2 - Test API

```powershell
cd services\dealer-service
.\test-api.ps1
```

**Hoặc test thủ công từng endpoint:**

#### Test 1: Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:3002/health" -Method GET | ConvertTo-Json
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "message": "Dealer Service is running!",
  "timestamp": "2024-11-07T..."
}
```

#### Test 2: Get Cars
```powershell
Invoke-RestMethod -Uri "http://localhost:3002/api/v1/cars" -Method GET | ConvertTo-Json -Depth 3
```

**Kết quả mong đợi:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "model": "Tesla Model 3",
      "manufacturer": "Tesla",
      "year": 2024,
      "price": 1200000000,
      "stock": 5
    },
    {
      "id": "2",
      "model": "BYD Seal",
      "manufacturer": "BYD",
      "year": 2024,
      "price": 950000000,
      "stock": 8
    }
  ]
}
```

#### Test 3: Get Orders
```powershell
Invoke-RestMethod -Uri "http://localhost:3002/api/v1/orders" -Method GET | ConvertTo-Json -Depth 3
```

#### Test 4: Get Quotations
```powershell
Invoke-RestMethod -Uri "http://localhost:3002/api/v1/quotations" -Method GET | ConvertTo-Json -Depth 3
```

### Bước 3: Test với Frontend

1. Mở Dealer Dashboard (nếu chưa chạy):
```powershell
cd frontend\dealer-dashboard
npm run dev
```

2. Mở browser: http://localhost:5176

3. Cập nhật `.env.development` trong dealer-dashboard:
```
VITE_API_URL=http://localhost:3002
```

4. Reload browser và test các tính năng:
   - ✅ Vehicles page → Gọi GET /api/v1/cars
   - ✅ Orders page → Gọi GET /api/v1/orders
   - ✅ Quotations page → Gọi GET /api/v1/quotations

## 📝 LƯU Ý

### Tại sao dùng test-simple.js thay vì npm run dev?

**Vấn đề:** Supabase free tier có giới hạn connections rất thấp (3-5 connections). Khi chạy với TypeORM, service tạo nhiều connections và bị lỗi `Max client connections reached`.

**Giải pháp tạm thời:** Dùng test server đơn giản với mock data để test:
- ✅ HTTP server hoạt động
- ✅ Routes hoạt động
- ✅ CORS config đúng
- ✅ Frontend có thể gọi API

### Để chạy service đầy đủ với database:

**Option 1: PostgreSQL Local**
```powershell
# Cài PostgreSQL local
# Tạo database: evdms
# Tạo user: evdms_user / evdms_password

# Update .env:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evdms
DB_USER=evdms_user
DB_PASSWORD=evdms_password

# Chạy service:
npm run dev
```

**Option 2: Docker PostgreSQL**
```powershell
# Từ root folder
docker-compose -f docker-compose.dev.yml up -d postgres-dev

# Update .env:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=evdealerdb_dev
DB_USER=evuser
DB_PASSWORD=evpassword

# Chạy service:
npm run dev
```

**Option 3: Nâng cấp Supabase** (khuyến nghị nếu dùng production)
- Upgrade lên Supabase Pro để có nhiều connections hơn

## 🎯 KẾT QUẢ TEST MONG ĐỢI

### ✅ Test Server thành công:
- [x] Server khởi động trên port 3002
- [x] Health check trả về 200 OK
- [x] GET /api/v1/cars trả về danh sách xe
- [x] GET /api/v1/orders trả về danh sách đơn hàng
- [x] GET /api/v1/quotations trả về danh sách báo giá
- [x] CORS headers đúng (cho phép frontend gọi API)

### 🔄 Tích hợp Frontend:
- [ ] Frontend gọi được API từ localhost:5176
- [ ] Vehicles page hiển thị data từ API
- [ ] Orders page hiển thị data từ API
- [ ] Quotations page hiển thị data từ API

## 🐛 TROUBLESHOOTING

### Lỗi: "Cannot find module 'express'"
```powershell
cd services\dealer-service
npm install
```

### Lỗi: "Port 3002 already in use"
```powershell
# Tìm process đang dùng port 3002
netstat -ano | findstr :3002

# Kill process
taskkill /PID <PID> /F
```

### Lỗi: CORS blocked
- Check CORS_ORIGIN trong .env có chứa origin của frontend không
- Restart service sau khi update .env

## 📊 TỔNG KẾT

### ✅ Backend Implementation:
- ✅ 40+ endpoints đã được implement
- ✅ 6 TypeORM models
- ✅ 6 repositories
- ✅ 6 services
- ✅ 6 controllers
- ✅ Validation schemas
- ✅ Rate limiting
- ✅ Error handling

### ⚠️ Database Connection:
- ⚠️ Supabase free tier limit connections
- ✅ Test server với mock data hoạt động
- 💡 Cần PostgreSQL local/Docker cho development

### 🎯 Next Steps:
1. ✅ Test basic HTTP server với mock data
2. ⏳ Setup PostgreSQL local/Docker
3. ⏳ Test full service với database
4. ⏳ Test tích hợp với Frontend
5. ⏳ Implement các service khác (customer-service, manufacturer-service)
