-- =====================================================
-- ALTERNATIVE: UPDATE EXISTING DATA
-- Use this if you want to keep existing users
-- =====================================================

BEGIN;

-- Fix NULL values in users table for new columns
UPDATE users 
SET email_verified = false 
WHERE email_verified IS NULL;

UPDATE users 
SET failed_login_attempts = 0 
WHERE failed_login_attempts IS NULL;

UPDATE users 
SET is_active = true 
WHERE is_active IS NULL;

UPDATE users 
SET username = COALESCE(username, email)
WHERE username IS NULL;

UPDATE users 
SET locked_until = NULL
WHERE locked_until IS NOT NULL AND locked_until < NOW();

UPDATE users
SET created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW());

COMMIT;

-- Verify the fix
SELECT 
    id,
    email,
    username,
    email_verified,
    is_active,
    failed_login_attempts,
    created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- Expected result: All NULL values should be fixed
-- =====================================================
