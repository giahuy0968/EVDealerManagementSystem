-- EVDMS Seed Data for Supabase PostgreSQL
-- This file populates the database with initial data for development/testing

-- Insert sample manufacturers
INSERT INTO manufacturers (id, name, code, email, phone, address, website, description, logo) VALUES
(gen_random_uuid(), 'Tesla Motors', 'TESLA', 'info@tesla.com', '+1-800-TESLA-3', 
 '{"street": "1 Tesla Road", "city": "Austin", "state": "TX", "zipCode": "73301", "country": "USA"}',
 'https://tesla.com', 'Leading electric vehicle manufacturer', 'https://tesla.com/logo.png'),
(gen_random_uuid(), 'BYD Company', 'BYD', 'info@byd.com', '+86-755-8988-8888',
 '{"street": "No.3009 BYD Road", "city": "Shenzhen", "state": "Guangdong", "zipCode": "518118", "country": "China"}',
 'https://byd.com', 'Chinese electric vehicle and battery manufacturer', 'https://byd.com/logo.png'),
(gen_random_uuid(), 'Nissan Motor', 'NISSAN', 'info@nissan.com', '+81-45-523-5523',
 '{"street": "1-1, Takashima 1-chome", "city": "Yokohama", "state": "Kanagawa", "zipCode": "220-8686", "country": "Japan"}',
 'https://nissan.com', 'Japanese automotive manufacturer with strong EV presence', 'https://nissan.com/logo.png');

-- Insert sample dealers (will get manufacturer IDs dynamically)
INSERT INTO dealers (id, name, code, email, phone, address, status, sales_target, territory) VALUES
(gen_random_uuid(), 'EV Motors Downtown', 'EVD001', 'info@evmotors.com', '+1-555-0101',
 '{"street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA"}',
 'active', 5000000.00, ARRAY['New York', 'New Jersey']),
(gen_random_uuid(), 'Green Auto Center', 'GAC001', 'contact@greenautocenter.com', '+1-555-0202',
 '{"street": "456 Green Ave", "city": "Los Angeles", "state": "CA", "zipCode": "90210", "country": "USA"}',
 'active', 7500000.00, ARRAY['California', 'Nevada']);

-- Insert admin user (password: password123)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status) VALUES
(gen_random_uuid(), 'admin@evdms.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'System', 'Admin', 'admin', 'active');

-- Insert dealer managers
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, dealer_id) VALUES
(gen_random_uuid(), 'manager@evmotors.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'John', 'Smith', 'dealer_manager', 'active', 
 (SELECT id FROM dealers WHERE code = 'EVD001')),
(gen_random_uuid(), 'manager@greenautocenter.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Sarah', 'Johnson', 'dealer_manager', 'active',
 (SELECT id FROM dealers WHERE code = 'GAC001'));

-- Update dealers with manager IDs
UPDATE dealers SET manager_id = (SELECT id FROM users WHERE email = 'manager@evmotors.com') WHERE code = 'EVD001';
UPDATE dealers SET manager_id = (SELECT id FROM users WHERE email = 'manager@greenautocenter.com') WHERE code = 'GAC001';

-- Insert dealer staff
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, dealer_id) VALUES
(gen_random_uuid(), 'sales1@evmotors.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Mike', 'Davis', 'dealer_staff', 'active',
 (SELECT id FROM dealers WHERE code = 'EVD001')),
(gen_random_uuid(), 'sales1@greenautocenter.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Emily', 'Wilson', 'dealer_staff', 'active',
 (SELECT id FROM dealers WHERE code = 'GAC001'));

-- Insert manufacturer staff
INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, manufacturer_id) VALUES
(gen_random_uuid(), 'rep@tesla.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Alex', 'Tesla', 'manufacturer_staff', 'active',
 (SELECT id FROM manufacturers WHERE code = 'TESLA'));

-- Insert sample vehicles
INSERT INTO vehicles (id, manufacturer_id, model, year, type, fuel_type, battery_capacity, range, price, features, specifications, images, status) VALUES
(gen_random_uuid(), (SELECT id FROM manufacturers WHERE code = 'TESLA'), 'Model 3', 2024, 'sedan', 'electric', 75.0, 500, 45000.00, 
 ARRAY['Autopilot', 'Premium Audio', 'Glass Roof', 'Heated Seats'], 
 '{"acceleration": "0-60 mph in 5.8s", "topSpeed": "140 mph", "charging": "Supercharger compatible", "safety": "5-star rating"}',
 ARRAY['https://tesla.com/model3/image1.jpg', 'https://tesla.com/model3/image2.jpg'], 'available'),
(gen_random_uuid(), (SELECT id FROM manufacturers WHERE code = 'TESLA'), 'Model Y', 2024, 'suv', 'electric', 75.0, 450, 55000.00,
 ARRAY['Autopilot', 'Premium Audio', 'Glass Roof', 'All-Wheel Drive', '7 Seats'],
 '{"acceleration": "0-60 mph in 4.8s", "topSpeed": "150 mph", "charging": "Supercharger compatible", "safety": "5-star rating"}',
 ARRAY['https://tesla.com/modely/image1.jpg', 'https://tesla.com/modely/image2.jpg'], 'available'),
(gen_random_uuid(), (SELECT id FROM manufacturers WHERE code = 'NISSAN'), 'Leaf', 2024, 'hatchback', 'electric', 62.0, 350, 32000.00,
 ARRAY['ProPILOT Assist', 'NissanConnect', 'Heated Steering Wheel'],
 '{"acceleration": "0-60 mph in 7.9s", "topSpeed": "90 mph", "charging": "CHAdeMO compatible", "safety": "5-star rating"}',
 ARRAY['https://nissan.com/leaf/image1.jpg', 'https://nissan.com/leaf/image2.jpg'], 'available');

-- Insert sample customers
INSERT INTO customers (id, first_name, last_name, email, phone, address, date_of_birth, status, segment, preferences, dealer_id) VALUES
(gen_random_uuid(), 'Robert', 'Brown', 'robert.brown@email.com', '+1-555-1001',
 '{"street": "789 Oak St", "city": "New York", "state": "NY", "zipCode": "10002", "country": "USA"}',
 '1985-06-15', 'active', 'first_time_buyer',
 '{"vehicleTypes": ["sedan", "hatchback"], "priceRange": {"min": 30000, "max": 50000}, "features": ["Autopilot", "Heated Seats"]}',
 (SELECT id FROM dealers WHERE code = 'EVD001')),
(gen_random_uuid(), 'Jennifer', 'Lee', 'jennifer.lee@email.com', '+1-555-2001',
 '{"street": "321 Pine St", "city": "Los Angeles", "state": "CA", "zipCode": "90211", "country": "USA"}',
 '1990-03-22', 'vip', 'luxury_buyer',
 '{"vehicleTypes": ["suv", "sedan"], "priceRange": {"min": 50000, "max": 80000}, "features": ["All-Wheel Drive", "Premium Audio"]}',
 (SELECT id FROM dealers WHERE code = 'GAC001'));