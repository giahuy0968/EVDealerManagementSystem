-- Create Admin User for Testing
-- Password: admin123 (BCrypt hash below)
-- Role: ADMIN

-- Delete existing admin if any
DELETE FROM user_sessions WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';

-- Insert admin user
INSERT INTO users (
    id,
    username,
    email,
    password,
    full_name,
    role,
    dealer_id,
    is_active,
    email_verified,
    phone,
    created_at,
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'admin',
    'admin@evdms.com',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cyhQQdF9IXhRNaSJPk4EAQmC0bHbi', -- password: admin123
    'System Administrator',
    'ADMIN',
    NULL,
    true,
    true,
    '+84123456789',
    NOW(),
    NOW()
);

-- Create Dealer Manager
DELETE FROM user_sessions WHERE user_id IN (SELECT id FROM users WHERE username = 'manager');
DELETE FROM users WHERE username = 'manager';

INSERT INTO users (
    id,
    username,
    email,
    password,
    full_name,
    role,
    dealer_id,
    is_active,
    email_verified,
    phone,
    created_at,
    updated_at
) VALUES (
    '22222222-2222-2222-2222-222222222222'::uuid,
    'manager',
    'manager@evdms.com',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cyhQQdF9IXhRNaSJPk4EAQmC0bHbi', -- password: admin123
    'Dealer Manager',
    'DEALER_MANAGER',
    '00000000-0000-0000-0000-000000000001'::uuid, -- Default dealer ID from customer-service
    true,
    true,
    '+84987654321',
    NOW(),
    NOW()
);

-- Create Dealer Staff
DELETE FROM user_sessions WHERE user_id IN (SELECT id FROM users WHERE username = 'staff');
DELETE FROM users WHERE username = 'staff';

INSERT INTO users (
    id,
    username,
    email,
    password,
    full_name,
    role,
    dealer_id,
    is_active,
    email_verified,
    phone,
    created_at,
    updated_at
) VALUES (
    '33333333-3333-3333-3333-333333333333'::uuid,
    'staff',
    'staff@evdms.com',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cyhQQdF9IXhRNaSJPk4EAQmC0bHbi', -- password: admin123
    'Dealer Staff',
    'DEALER_STAFF',
    '00000000-0000-0000-0000-000000000001'::uuid, -- Default dealer ID from customer-service
    true,
    true,
    '+84912345678',
    NOW(),
    NOW()
);

-- Verify users created
SELECT 
    username,
    email,
    full_name,
    role,
    dealer_id,
    is_active
FROM users
WHERE username IN ('admin', 'manager', 'staff')
ORDER BY role;
