-- =====================================================
-- FIX DATABASE FOR AUTH-SERVICE
-- Run this in Supabase SQL Editor BEFORE starting service
-- =====================================================

-- Option 1: CLEAN START (Recommended for development)
-- This will delete all existing data and start fresh

BEGIN;

-- Drop existing data (keeps table structure)
TRUNCATE TABLE sessions CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE password_reset_tokens CASCADE;

-- If email_verification_tokens table exists, truncate it
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_verification_tokens') THEN
        TRUNCATE TABLE email_verification_tokens CASCADE;
    END IF;
END $$;

COMMIT;

-- Verify tables are empty
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions
UNION ALL
SELECT 'password_reset_tokens', COUNT(*) FROM password_reset_tokens;

-- =====================================================
-- Expected result: All tables should have 0 rows
-- =====================================================
