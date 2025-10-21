# 🔧 BƯỚC 1: FIX DATABASE

## Mục đích
Fix các NULL values trong database để service có thể start được.

## Lựa chọn của bạn

### ✅ OPTION 1: Clean Start (KHUYẾN NGHỊ)
**Dùng khi:** Đây là môi trường dev/test, bạn OK với việc xóa hết data cũ.

**Các bước:**
1. Mở **Supabase Dashboard**: https://supabase.com/dashboard
2. Chọn project của bạn
3. Click **SQL Editor** (icon database bên trái)
4. Click **New query**
5. Copy và paste nội dung từ file: `scripts/01-clean-database.sql`
6. Click **Run** (hoặc Ctrl+Enter)

**Kết quả mong đợi:**
```
table_name              | row_count
------------------------|----------
users                   | 0
sessions                | 0
password_reset_tokens   | 0
```

✅ Nếu thấy kết quả trên → **Hoàn thành!** Chuyển sang Bước 2.

---

### ⚙️ OPTION 2: Update Existing Data
**Dùng khi:** Bạn muốn giữ users hiện tại trong DB.

**Các bước:**
1. Mở **Supabase Dashboard** → **SQL Editor**
2. Copy nội dung từ file: `scripts/02-fix-existing-data.sql`
3. Paste và click **Run**

**Kết quả mong đợi:**
Sẽ hiển thị 10 users với các giá trị:
- `email_verified` = false
- `is_active` = true
- `failed_login_attempts` = 0
- `username` = có giá trị (không NULL)

✅ Nếu thấy các giá trị hợp lệ → **Hoàn thành!** Chuyển sang Bước 2.

---

## ⚡ Quick Fix - Manual SQL

Nếu không muốn dùng file, copy paste trực tiếp:

### Clean Start:
```sql
TRUNCATE TABLE sessions CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE password_reset_tokens CASCADE;
```

### Fix Existing:
```sql
UPDATE users SET email_verified = false WHERE email_verified IS NULL;
UPDATE users SET failed_login_attempts = 0 WHERE failed_login_attempts IS NULL;
UPDATE users SET is_active = true WHERE is_active IS NULL;
UPDATE users SET username = email WHERE username IS NULL;
```

---

## ❌ Troubleshooting

### Lỗi: "permission denied"
**Giải pháp:** Đảm bảo bạn đã login đúng project Supabase và có quyền admin.

### Lỗi: "table does not exist"
**Giải pháp:** Service chưa chạy lần nào. Cần start service 1 lần để Hibernate tạo tables.

**Cách fix:**
1. Start service: `mvn spring-boot:run`
2. Đợi đến khi thấy lỗi (bỏ qua lỗi)
3. Stop service: Ctrl+C
4. Quay lại chạy SQL fix
5. Start lại service

---

## ✅ Xác nhận hoàn thành

Chạy query này để verify:
```sql
SELECT 
    COUNT(*) FILTER (WHERE email_verified IS NULL) as null_email_verified,
    COUNT(*) FILTER (WHERE failed_login_attempts IS NULL) as null_failed_attempts,
    COUNT(*) FILTER (WHERE is_active IS NULL) as null_is_active,
    COUNT(*) FILTER (WHERE username IS NULL) as null_username
FROM users;
```

**Kết quả đúng:** Tất cả các cột đều = 0

---

## 📝 Sau khi hoàn thành

✅ Database đã sẵn sàng!  
➡️ **Tiếp theo:** Bước 2 - Start Service

---

**File tham khảo:**
- `scripts/01-clean-database.sql` - Clean start
- `scripts/02-fix-existing-data.sql` - Fix existing data
