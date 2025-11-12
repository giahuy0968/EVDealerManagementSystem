# Customer Service - Database Configuration

## ✅ Cấu hình Supabase PostgreSQL

Service đã được cấu hình để kết nối với Supabase PostgreSQL:

```properties
Host: aws-1-ap-southeast-1.pooler.supabase.com
Port: 6543
Database: postgres
Username: postgres.grgbbhzjlddgocgyhekd
Password: Abc@123456!
SSL: require
```

## 🚀 Tự động tạo bảng

**Hibernate sẽ tự động tạo các bảng** từ entity classes khi service khởi động lần đầu:

### Các bảng sẽ được tạo:
1. **customers** - Thông tin khách hàng
2. **leads** - Cơ hội bán hàng
3. **test_drives** - Lịch lái thử
4. **feedbacks** - Đánh giá từ khách hàng
5. **complaints** - Khiếu nại
6. **customer_interactions** - Lịch sử tương tác

### Cấu hình Hibernate DDL:
```properties
spring.jpa.hibernate.ddl-auto=update
```

**Chế độ `update`**:
- ✅ Tự động tạo bảng nếu chưa tồn tại
- ✅ Tự động thêm cột mới nếu entity có thay đổi
- ✅ **KHÔNG XÓA** dữ liệu cũ
- ✅ An toàn cho production

## 🔧 Cách chạy

### 1. Build project:
```bash
cd c:\OOP-BUILD\EVDealerManagementSystem\customer-service
.\mvnw.cmd clean package -DskipTests
```

### 2. Chạy service:
```bash
.\mvnw.cmd spring-boot:run
```

### 3. Kiểm tra logs:
Khi service khởi động, bạn sẽ thấy SQL statements tạo bảng:
```
Hibernate: create table customers (...)
Hibernate: create table leads (...)
Hibernate: create table test_drives (...)
...
```

## 📊 Kiểm tra database

### Sử dụng Supabase Dashboard:
1. Truy cập: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **Table Editor** để xem các bảng đã được tạo

### Hoặc dùng SQL Query:
```sql
-- Xem danh sách các bảng
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Xem cấu trúc bảng customers
\d customers
```

## ⚙️ Cấu hình nâng cao

### Thay đổi chế độ DDL:

**Để tạo lại bảng mỗi lần chạy** (CHỈ dùng cho development):
```properties
spring.jpa.hibernate.ddl-auto=create-drop
```

**Để không tự động tạo/sửa bảng**:
```properties
spring.jpa.hibernate.ddl-auto=validate
```

**Để chỉ tạo bảng lần đầu**:
```properties
spring.jpa.hibernate.ddl-auto=create
```

## 🔍 Debug

### Xem SQL statements:
Đã được bật trong `application.properties`:
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### Kiểm tra kết nối:
```bash
# Test connection
curl http://localhost:3003/actuator/health
```

## ⚠️ Lưu ý

1. **Lần chạy đầu tiên** sẽ mất thời gian vì Hibernate phải tạo tất cả các bảng
2. **Indexes và foreign keys** sẽ được tạo tự động theo định nghĩa trong entities
3. **Dữ liệu sẽ được giữ nguyên** giữa các lần restart (do dùng chế độ `update`)
4. **Backup database** trước khi thay đổi entity trong production

## 🎯 Entities đã định nghĩa

| Entity | Package | File |
|--------|---------|------|
| Customer | entity | Customer.java |
| Lead | entity | Lead.java |
| TestDrive | entity | TestDrive.java |
| Feedback | entity | Feedback.java |
| Complaint | entity | Complaint.java |
| CustomerInteraction | entity | CustomerInteraction.java |

Tất cả đều có các annotations JPA chuẩn:
- `@Entity`
- `@Table(name = "...")`
- `@Id`, `@GeneratedValue`
- `@Column`, `@Enumerated`
- `@ManyToOne`, `@OneToMany`
- `@CreationTimestamp`, `@UpdateTimestamp`

---

**Ready to use!** 🎉 Chỉ cần chạy `mvnw spring-boot:run` và các bảng sẽ tự động được tạo!
