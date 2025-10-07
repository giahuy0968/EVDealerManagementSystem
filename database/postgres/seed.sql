-- EVDMS Seed Data
-- This file populates the database with initial data for development/testing

-- Insert sample manufacturers
INSERT INTO manufacturers (id, name, code, email, phone, address, website, description, logo) VALUES
(uuid_generate_v4(), 'Tesla Motors', 'TESLA', 'info@tesla.com', '+1-800-TESLA-3', 
 '{"street": "1 Tesla Road", "city": "Austin", "state": "TX", "zipCode": "73301", "country": "USA"}',
 'https://tesla.com', 'Leading electric vehicle manufacturer', 'https://tesla.com/logo.png'),
(uuid_generate_v4(), 'BYD Company', 'BYD', 'info@byd.com', '+86-755-8988-8888',
 '{"street": "No.3009 BYD Road", "city": "Shenzhen", "state": "Guangdong", "zipCode": "518118", "country": "China"}',
 'https://byd.com', 'Chinese electric vehicle and battery manufacturer', 'https://byd.com/logo.png'),
(uuid_generate_v4(), 'Nissan Motor', 'NISSAN', 'info@nissan.com', '+81-45-523-5523',
 '{"street": "1-1, Takashima 1-chome", "city": "Yokohama", "state": "Kanagawa", "zipCode": "220-8686", "country": "Japan"}',
 'https://nissan.com', 'Japanese automotive manufacturer with strong EV presence', 'https://nissan.com/logo.png');

-- Get manufacturer IDs for later use
DO $$
DECLARE
    tesla_id UUID;
    byd_id UUID;
    nissan_id UUID;
    dealer1_id UUID;
    dealer2_id UUID;
    admin_id UUID;
    manager1_id UUID;
    manager2_id UUID;
    staff1_id UUID;
    staff2_id UUID;
    vehicle1_id UUID;
    vehicle2_id UUID;
    vehicle3_id UUID;
    customer1_id UUID;
    customer2_id UUID;
BEGIN
    -- Get manufacturer IDs
    SELECT id INTO tesla_id FROM manufacturers WHERE code = 'TESLA';
    SELECT id INTO byd_id FROM manufacturers WHERE code = 'BYD';
    SELECT id INTO nissan_id FROM manufacturers WHERE code = 'NISSAN';

    -- Insert sample dealers
    INSERT INTO dealers (id, name, code, email, phone, address, status, sales_target, territory, manufacturers) VALUES
    (uuid_generate_v4(), 'EV Motors Downtown', 'EVD001', 'info@evmotors.com', '+1-555-0101',
     '{"street": "123 Main St", "city": "New York", "state": "NY", "zipCode": "10001", "country": "USA"}',
     'active', 5000000.00, ARRAY['New York', 'New Jersey'], ARRAY[tesla_id, nissan_id]),
    (uuid_generate_v4(), 'Green Auto Center', 'GAC001', 'contact@greenautocenter.com', '+1-555-0202',
     '{"street": "456 Green Ave", "city": "Los Angeles", "state": "CA", "zipCode": "90210", "country": "USA"}',
     'active', 7500000.00, ARRAY['California', 'Nevada'], ARRAY[tesla_id, byd_id, nissan_id]);

    -- Get dealer IDs
    SELECT id INTO dealer1_id FROM dealers WHERE code = 'EVD001';
    SELECT id INTO dealer2_id FROM dealers WHERE code = 'GAC001';

    -- Insert users (using bcrypt hash for password "password123")
    -- Admin user
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, status) VALUES
    (uuid_generate_v4(), 'admin@evdms.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'System', 'Admin', 'admin', 'active');

    SELECT id INTO admin_id FROM users WHERE email = 'admin@evdms.com';

    -- Dealer managers
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, dealer_id) VALUES
    (uuid_generate_v4(), 'manager@evmotors.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'John', 'Smith', 'dealer_manager', 'active', dealer1_id),
    (uuid_generate_v4(), 'manager@greenautocenter.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Sarah', 'Johnson', 'dealer_manager', 'active', dealer2_id);

    SELECT id INTO manager1_id FROM users WHERE email = 'manager@evmotors.com';
    SELECT id INTO manager2_id FROM users WHERE email = 'manager@greenautocenter.com';

    -- Update dealers with manager IDs
    UPDATE dealers SET manager_id = manager1_id WHERE id = dealer1_id;
    UPDATE dealers SET manager_id = manager2_id WHERE id = dealer2_id;

    -- Dealer staff
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, dealer_id) VALUES
    (uuid_generate_v4(), 'sales1@evmotors.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Mike', 'Davis', 'dealer_staff', 'active', dealer1_id),
    (uuid_generate_v4(), 'sales1@greenautocenter.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Emily', 'Wilson', 'dealer_staff', 'active', dealer2_id);

    SELECT id INTO staff1_id FROM users WHERE email = 'sales1@evmotors.com';
    SELECT id INTO staff2_id FROM users WHERE email = 'sales1@greenautocenter.com';

    -- Manufacturer staff
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, manufacturer_id) VALUES
    (uuid_generate_v4(), 'rep@tesla.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYkYF8wT3Qw5wUu', 'Alex', 'Tesla', 'manufacturer_staff', 'active', tesla_id);

    -- Insert sample vehicles
    INSERT INTO vehicles (id, manufacturer_id, model, year, type, fuel_type, battery_capacity, range, price, features, specifications, images, status) VALUES
    (uuid_generate_v4(), tesla_id, 'Model 3', 2024, 'sedan', 'electric', 75.0, 500, 45000.00, 
     ARRAY['Autopilot', 'Premium Audio', 'Glass Roof', 'Heated Seats'], 
     '{"acceleration": "0-60 mph in 5.8s", "topSpeed": "140 mph", "charging": "Supercharger compatible", "safety": "5-star rating"}',
     ARRAY['https://tesla.com/model3/image1.jpg', 'https://tesla.com/model3/image2.jpg'], 'available'),
    (uuid_generate_v4(), tesla_id, 'Model Y', 2024, 'suv', 'electric', 75.0, 450, 55000.00,
     ARRAY['Autopilot', 'Premium Audio', 'Glass Roof', 'All-Wheel Drive', '7 Seats'],
     '{"acceleration": "0-60 mph in 4.8s", "topSpeed": "150 mph", "charging": "Supercharger compatible", "safety": "5-star rating"}',
     ARRAY['https://tesla.com/modely/image1.jpg', 'https://tesla.com/modely/image2.jpg'], 'available'),
    (uuid_generate_v4(), nissan_id, 'Leaf', 2024, 'hatchback', 'electric', 62.0, 350, 32000.00,
     ARRAY['ProPILOT Assist', 'NissanConnect', 'Heated Steering Wheel'],
     '{"acceleration": "0-60 mph in 7.9s", "topSpeed": "90 mph", "charging": "CHAdeMO compatible", "safety": "5-star rating"}',
     ARRAY['https://nissan.com/leaf/image1.jpg', 'https://nissan.com/leaf/image2.jpg'], 'available');

    -- Get vehicle IDs
    SELECT id INTO vehicle1_id FROM vehicles WHERE model = 'Model 3';
    SELECT id INTO vehicle2_id FROM vehicles WHERE model = 'Model Y';
    SELECT id INTO vehicle3_id FROM vehicles WHERE model = 'Leaf';

    -- Insert inventory
    INSERT INTO inventory (dealer_id, vehicle_id, quantity, reserved_quantity) VALUES
    (dealer1_id, vehicle1_id, 10, 2),
    (dealer1_id, vehicle3_id, 5, 0),
    (dealer2_id, vehicle1_id, 15, 3),
    (dealer2_id, vehicle2_id, 8, 1),
    (dealer2_id, vehicle3_id, 12, 0);

    -- Insert sample customers
    INSERT INTO customers (id, first_name, last_name, email, phone, address, date_of_birth, status, segment, preferences, dealer_id) VALUES
    (uuid_generate_v4(), 'Robert', 'Brown', 'robert.brown@email.com', '+1-555-1001',
     '{"street": "789 Oak St", "city": "New York", "state": "NY", "zipCode": "10002", "country": "USA"}',
     '1985-06-15', 'active', 'first_time_buyer',
     '{"vehicleTypes": ["sedan", "hatchback"], "priceRange": {"min": 30000, "max": 50000}, "features": ["Autopilot", "Heated Seats"]}',
     dealer1_id),
    (uuid_generate_v4(), 'Jennifer', 'Lee', 'jennifer.lee@email.com', '+1-555-2001',
     '{"street": "321 Pine St", "city": "Los Angeles", "state": "CA", "zipCode": "90211", "country": "USA"}',
     '1990-03-22', 'vip', 'luxury_buyer',
     '{"vehicleTypes": ["suv", "sedan"], "priceRange": {"min": 50000, "max": 80000}, "features": ["All-Wheel Drive", "Premium Audio"]}',
     dealer2_id);

    -- Get customer IDs
    SELECT id INTO customer1_id FROM customers WHERE email = 'robert.brown@email.com';
    SELECT id INTO customer2_id FROM customers WHERE email = 'jennifer.lee@email.com';

    -- Insert sample orders
    INSERT INTO orders (customer_id, dealer_id, vehicle_id, sales_rep_id, order_number, total_amount, down_payment, finance_amount, status, payment_status, order_date, expected_delivery_date) VALUES
    (customer1_id, dealer1_id, vehicle1_id, staff1_id, 'ORD-2024-001', 45000.00, 9000.00, 36000.00, 'confirmed', 'partial', NOW() - INTERVAL '5 days', NOW() + INTERVAL '30 days'),
    (customer2_id, dealer2_id, vehicle2_id, staff2_id, 'ORD-2024-002', 55000.00, 15000.00, 40000.00, 'pending', 'pending', NOW() - INTERVAL '2 days', NOW() + INTERVAL '45 days');

    -- Insert sample test drives
    INSERT INTO test_drives (customer_id, vehicle_id, dealer_id, sales_rep_id, scheduled_date, duration, status, feedback, rating) VALUES
    (customer1_id, vehicle1_id, dealer1_id, staff1_id, NOW() - INTERVAL '7 days', 30, 'completed', 'Great experience! Very smooth and quiet ride.', 5),
    (customer2_id, vehicle2_id, dealer2_id, staff2_id, NOW() + INTERVAL '3 days', 45, 'scheduled', NULL, NULL);

    -- Insert sales targets
    INSERT INTO sales_targets (dealer_id, user_id, year, month, target_amount, achieved_amount) VALUES
    (dealer1_id, manager1_id, 2024, 10, 500000.00, 320000.00),
    (dealer1_id, staff1_id, 2024, 10, 200000.00, 150000.00),
    (dealer2_id, manager2_id, 2024, 10, 750000.00, 480000.00),
    (dealer2_id, staff2_id, 2024, 10, 300000.00, 195000.00);

    -- Insert sample promotions
    INSERT INTO promotions (name, description, discount_type, discount_value, start_date, end_date, vehicle_ids, dealer_ids, is_active) VALUES
    ('October EV Sale', 'Special discount on all electric vehicles', 'percentage', 5.00, NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', ARRAY[vehicle1_id, vehicle2_id, vehicle3_id], ARRAY[dealer1_id, dealer2_id], true),
    ('First Time Buyer Bonus', 'Extra savings for first-time EV buyers', 'fixed', 2000.00, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', ARRAY[vehicle3_id], ARRAY[dealer1_id], true);

END $$;