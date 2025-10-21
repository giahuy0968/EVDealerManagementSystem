# 🎯 SCRIPT ĐỂ CHẠY TRONG SUPABASE SQL EDITOR

Hibernate đã tạo columns mới, giờ cần fix NULL values.

## Copy & Paste vào Supabase SQL Editor:

```sql
-- Fix NULL values in users table
UPDATE users SET email_verified = false WHERE email_verified IS NULL;
UPDATE users SET failed_login_attempts = 0 WHERE failed_login_attempts IS NULL;
UPDATE users SET is_active = true WHERE is_active IS NULL;
UPDATE users SET username = email WHERE username IS NULL;

-- Verify fix
SELECT 
    id,
    email,
    username,
    email_verified,
    is_active,
    failed_login_attempts
FROM users
ORDER BY created_at DESC NULLS LAST
LIMIT 5;
```

## Kết quả mong đợi:
- Tất cả users có `email_verified` = false
- Tất cả users có `failed_login_attempts` = 0
- Tất cả users có `is_active` = true
- Tất cả users có `username` = email (nếu chưa có)

## ✅ Sau khi xong:
Báo lại "Đã fix xong" để chuyển sang BƯỚC 2!
