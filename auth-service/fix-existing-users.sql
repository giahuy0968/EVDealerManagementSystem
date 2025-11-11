-- =====================================================
-- QUICK FIX: Update existing users
-- Run this in Supabase SQL Editor
-- =====================================================

-- Fix NULL values
UPDATE users SET email_verified = false WHERE email_verified IS NULL;
UPDATE users SET failed_login_attempts = 0 WHERE failed_login_attempts IS NULL;
UPDATE users SET is_active = true WHERE is_active IS NULL;
UPDATE users SET username = email WHERE username IS NULL;

-- Verify fix
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE email_verified IS NULL) as null_verified,
    COUNT(*) FILTER (WHERE failed_login_attempts IS NULL) as null_attempts,
    COUNT(*) FILTER (WHERE is_active IS NULL) as null_active,
    COUNT(*) FILTER (WHERE username IS NULL) as null_username
FROM users;
