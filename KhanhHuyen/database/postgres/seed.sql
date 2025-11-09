-- EVDMS Seed Data
-- This file populates the database with initial data for development/testing

-- Ensure uuid generation function is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample manufacturers
INSERT INTO manufacturers (id, name, code, email, phone, address, website, description, logo) VALUES
(uuid_generate_v4(), 'Tesla Motors', 'TESLA', 'info@tesla.com', '+1-800-TESLA-3', 
    CAST('{"street": "1 Tesla Road", "city": "Austin", "state": "TX", "zipCode": "73301", "country": "USA"}' AS jsonb),
    'https://tesla.com', 'Leading electric vehicle manufacturer', 'https://tesla.com/logo.png'),
(uuid_generate_v4(), 'BYD Company', 'BYD', 'info@byd.com', '+86-755-8988-8888',
    CAST('{"street": "No.3009 BYD Road", "city": "Shenzhen", "state": "Guangdong", "zipCode": "518118", "country": "China"}' AS jsonb),
    'https://byd.com', 'Chinese electric vehicle and battery manufacturer', 'https://byd.com/logo.png'),
(uuid_generate_v4(), 'Nissan Motor', 'NISSAN', 'info@nissan.com', '+81-45-523-5523',
    CAST('{"street": "1-1, Takashima 1-chome", "city": "Yokohama", "state": "Kanagawa", "zipCode": "220-8686", "country": "Japan"}' AS jsonb),
    'https://nissan.com', 'Japanese automotive manufacturer with strong EV presence', 'https://nissan.com/logo.png');

-- Insert sample dealers (use subqueries to link manufacturers)
INSERT INTO dealers (id, name, code, email, phone, address, status, sales_target, territory, manufacturers) VALUES
(uuid_generate_v4(), 'EV Motors Downtown', 'EVD001', 'info@evmotors.com', '+1-555-0101',
 CAST('{"street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA"}' AS jsonb),
 'active', 5000000.00, CAST(ARRAY['New York', 'New Jersey'] AS text[]),
 CAST(ARRAY[(SELECT id FROM manufacturers WHERE code = 'TESLA'), (SELECT id FROM manufacturers WHERE code = 'NISSAN')] AS uuid[])),
(uuid_generate_v4(), 'Green Auto Center', 'GAC001', 'contact@greenautocenter.com', '+1-555-0202',
 CAST('{"street": "456 Green Ave", "city": "Los Angeles", "state": "CA", "zipCode": "90210", "country": "USA"}' AS jsonb),
 'active', 7500000.00, CAST(ARRAY['California', 'Nevada'] AS text[]),
 CAST(ARRAY[(SELECT id FROM manufacturers WHERE code = 'TESLA'), (SELECT id FROM manufacturers WHERE code = 'BYD'), (SELECT id FROM manufacturers WHERE code = 'NISSAN')] AS uuid[]));

-- Insert users (using bcrypt hash for password "password123")
-- Admin user
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status) VALUES
(uuid_generate_v4(), 'admin@evdms.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'System', 'Admin', 'admin', 'active');

-- Dealer managers
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, dealer_id) VALUES
(uuid_generate_v4(), 'manager@evmotors.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'John', 'Smith', 'dealer_manager', 'active', (SELECT id FROM dealers WHERE code = 'EVD001')),
(uuid_generate_v4(), 'manager@greenautocenter.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Sarah', 'Johnson', 'dealer_manager', 'active', (SELECT id FROM dealers WHERE code = 'GAC001'));

-- Update dealers with manager IDs (lookup by email)
UPDATE dealers SET manager_id = (SELECT id FROM users WHERE email = 'manager@evmotors.com') WHERE code = 'EVD001';
UPDATE dealers SET manager_id = (SELECT id FROM users WHERE email = 'manager@greenautocenter.com') WHERE code = 'GAC001';

-- Dealer staff
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, dealer_id) VALUES
(uuid_generate_v4(), 'sales1@evmotors.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Mike', 'Davis', 'dealer_staff', 'active', (SELECT id FROM dealers WHERE code = 'EVD001')),
(uuid_generate_v4(), 'sales1@greenautocenter.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Emily', 'Wilson', 'dealer_staff', 'active', (SELECT id FROM dealers WHERE code = 'GAC001'));

-- Manufacturer staff
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, manufacturer_id) VALUES
(uuid_generate_v4(), 'rep@tesla.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Alex', 'Tesla', 'manufacturer_staff', 'active', (SELECT id FROM manufacturers WHERE code = 'TESLA'));

-- Insert sample vehicles
INSERT INTO vehicles (id, manufacturer_id, model, year, type, fuel_type, battery_capacity, range, price, features, specifications, images, status) VALUES
(uuid_generate_v4(), (SELECT id FROM manufacturers WHERE code = 'TESLA'), 'Model 3', 2024, 'sedan', 'electric', 75.0, 500, 45000.00, 
 CAST(ARRAY['Autopilot', 'Premium Audio', 'Glass Roof', 'Heated Seats'] AS text[]), 
 CAST('{"acceleration": "0-60 mph in 5.8s", "topSpeed": "140 mph", "charging": "Supercharger compatible", "safety": "5-star rating"}' AS jsonb),
 CAST(ARRAY['https://tesla.com/model3/image1.jpg', 'https://tesla.com/model3/image2.jpg'] AS text[]), 'available'),
(uuid_generate_v4(), (SELECT id FROM manufacturers WHERE code = 'TESLA'), 'Model Y', 2024, 'suv', 'electric', 75.0, 450, 55000.00,
 CAST(ARRAY['Autopilot', 'Premium Audio', 'Glass Roof', 'All-Wheel Drive', '7 Seats'] AS text[]),
 CAST('{"acceleration": "0-60 mph in 4.8s", "topSpeed": "150 mph", "charging": "Supercharger compatible", "safety": "5-star rating"}' AS jsonb),
 CAST(ARRAY['https://tesla.com/modely/image1.jpg', 'https://tesla.com/modely/image2.jpg'] AS text[]), 'available'),
(uuid_generate_v4(), (SELECT id FROM manufacturers WHERE code = 'NISSAN'), 'Leaf', 2024, 'hatchback', 'electric', 62.0, 350, 32000.00,
 CAST(ARRAY['ProPILOT Assist', 'NissanConnect', 'Heated Steering Wheel'] AS text[]),
 CAST('{"acceleration": "0-60 mph in 7.9s", "topSpeed": "90 mph", "charging": "CHAdeMO compatible", "safety": "5-star rating"}' AS jsonb),
 CAST(ARRAY['https://nissan.com/leaf/image1.jpg', 'https://nissan.com/leaf/image2.jpg'] AS text[]), 'available');

-- Insert inventory (use subqueries to reference created records)
INSERT INTO inventory (dealer_id, vehicle_id, quantity, reserved_quantity) VALUES
((SELECT id FROM dealers WHERE code = 'EVD001'), (SELECT id FROM vehicles WHERE model = 'Model 3'), 10, 2),
((SELECT id FROM dealers WHERE code = 'EVD001'), (SELECT id FROM vehicles WHERE model = 'Leaf'), 5, 0),
((SELECT id FROM dealers WHERE code = 'GAC001'), (SELECT id FROM vehicles WHERE model = 'Model 3'), 15, 3),
((SELECT id FROM dealers WHERE code = 'GAC001'), (SELECT id FROM vehicles WHERE model = 'Model Y'), 8, 1),
((SELECT id FROM dealers WHERE code = 'GAC001'), (SELECT id FROM vehicles WHERE model = 'Leaf'), 12, 0);

-- Insert sample customers
INSERT INTO customers (id, first_name, last_name, email, phone, address, date_of_birth, status, segment, preferences, dealer_id) VALUES
(uuid_generate_v4(), 'Robert', 'Brown', 'robert.brown@email.com', '+1-555-1001',
 CAST('{"street": "789 Oak St", "city": "New York", "state": "NY", "zipCode": "10002", "country": "USA"}' AS jsonb),
 '1985-06-15', 'active', 'first_time_buyer',
 CAST('{"vehicleTypes": ["sedan", "hatchback"], "priceRange": {"min": 30000, "max": 50000}, "features": ["Autopilot", "Heated Seats"]}' AS jsonb),
 (SELECT id FROM dealers WHERE code = 'EVD001'),
(uuid_generate_v4(), 'Jennifer', 'Lee', 'jennifer.lee@email.com', '+1-555-2001',
 CAST('{"street": "321 Pine St", "city": "Los Angeles", "state": "CA", "zipCode": "90211", "country": "USA"}' AS jsonb),
 '1990-03-22', 'vip', 'luxury_buyer',
 CAST('{"vehicleTypes": ["suv", "sedan"], "priceRange": {"min": 50000, "max": 80000}, "features": ["All-Wheel Drive", "Premium Audio"]}' AS jsonb),
 (SELECT id FROM dealers WHERE code = 'GAC001'));

-- Insert sample orders
INSERT INTO orders (customer_id, dealer_id, vehicle_id, sales_rep_id, order_number, total_amount, down_payment, finance_amount, status, payment_status, order_date, expected_delivery_date) VALUES
((SELECT id FROM customers WHERE email = 'robert.brown@email.com'), (SELECT id FROM dealers WHERE code = 'EVD001'), (SELECT id FROM vehicles WHERE model = 'Model 3'), (SELECT id FROM users WHERE email = 'sales1@evmotors.com'), 'ORD-2024-001', 45000.00, 9000.00, 36000.00, 'confirmed', 'partial', NOW() - INTERVAL '5 days', NOW() + INTERVAL '30 days'),
((SELECT id FROM customers WHERE email = 'jennifer.lee@email.com'), (SELECT id FROM dealers WHERE code = 'GAC001'), (SELECT id FROM vehicles WHERE model = 'Model Y'), (SELECT id FROM users WHERE email = 'sales1@greenautocenter.com'), 'ORD-2024-002', 55000.00, 15000.00, 40000.00, 'pending', 'pending', NOW() - INTERVAL '2 days', NOW() + INTERVAL '45 days');

-- Insert sample test drives
INSERT INTO test_drives (customer_id, vehicle_id, dealer_id, sales_rep_id, scheduled_date, duration, status, feedback, rating) VALUES
((SELECT id FROM customers WHERE email = 'robert.brown@email.com'), (SELECT id FROM vehicles WHERE model = 'Model 3'), (SELECT id FROM dealers WHERE code = 'EVD001'), (SELECT id FROM users WHERE email = 'sales1@evmotors.com'), NOW() - INTERVAL '7 days', 30, 'completed', 'Great experience! Very smooth and quiet ride.', 5),
((SELECT id FROM customers WHERE email = 'jennifer.lee@email.com'), (SELECT id FROM vehicles WHERE model = 'Model Y'), (SELECT id FROM dealers WHERE code = 'GAC001'), (SELECT id FROM users WHERE email = 'sales1@greenautocenter.com'), NOW() + INTERVAL '3 days', 45, 'scheduled', NULL, NULL);

-- Insert sales targets
INSERT INTO sales_targets (dealer_id, user_id, year, month, target_amount, achieved_amount) VALUES
((SELECT id FROM dealers WHERE code = 'EVD001'), (SELECT id FROM users WHERE email = 'manager@evmotors.com'), 2024, 10, 500000.00, 320000.00),
((SELECT id FROM dealers WHERE code = 'EVD001'), (SELECT id FROM users WHERE email = 'sales1@evmotors.com'), 2024, 10, 200000.00, 150000.00),
((SELECT id FROM dealers WHERE code = 'GAC001'), (SELECT id FROM users WHERE email = 'manager@greenautocenter.com'), 2024, 10, 750000.00, 480000.00),
((SELECT id FROM dealers WHERE code = 'GAC001'), (SELECT id FROM users WHERE email = 'sales1@greenautocenter.com'), 2024, 10, 300000.00, 195000.00);

-- Insert sample promotions
INSERT INTO promotions (name, description, discount_type, discount_value, start_date, end_date, vehicle_ids, dealer_ids, is_active) VALUES
('October EV Sale', 'Special discount on all electric vehicles', 'percentage', 5.00, NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days',
 CAST(ARRAY[(SELECT id FROM vehicles WHERE model = 'Model 3'), (SELECT id FROM vehicles WHERE model = 'Model Y'), (SELECT id FROM vehicles WHERE model = 'Leaf')] AS uuid[]),
 CAST(ARRAY[(SELECT id FROM dealers WHERE code = 'EVD001'), (SELECT id FROM dealers WHERE code = 'GAC001')] AS uuid[]), true),
('First Time Buyer Bonus', 'Extra savings for first-time EV buyers', 'fixed', 2000.00, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days',
 CAST(ARRAY[(SELECT id FROM vehicles WHERE model = 'Leaf')] AS uuid[]), CAST(ARRAY[(SELECT id FROM dealers WHERE code = 'EVD001')] AS uuid[]), true);