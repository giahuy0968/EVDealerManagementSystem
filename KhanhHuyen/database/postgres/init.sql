-- EVDMS Database Initialization Script
-- PostgreSQL Database Schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'dealer_manager', 'dealer_staff', 'manufacturer_staff');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE vehicle_status AS ENUM ('available', 'reserved', 'sold', 'in_transit', 'maintenance');
CREATE TYPE vehicle_type AS ENUM ('sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck', 'van');
CREATE TYPE fuel_type AS ENUM ('electric', 'hybrid', 'plugin_hybrid');
CREATE TYPE customer_status AS ENUM ('active', 'inactive', 'vip');
CREATE TYPE customer_segment AS ENUM ('first_time_buyer', 'returning_customer', 'luxury_buyer', 'fleet_customer');
CREATE TYPE order_status AS ENUM ('draft', 'pending', 'confirmed', 'in_production', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid', 'refunded', 'failed');
CREATE TYPE dealer_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE test_drive_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- Manufacturers Table
CREATE TABLE manufacturers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address JSONB NOT NULL,
    website VARCHAR(255),
    description TEXT,
    logo VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dealers Table
CREATE TABLE dealers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address JSONB NOT NULL,
    manager_id UUID,
    status dealer_status DEFAULT 'active',
    sales_target DECIMAL(15,2) DEFAULT 0,
    territory TEXT[],
    manufacturers UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'active',
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
    manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Vehicles Table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manufacturer_id UUID NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
    model VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    type vehicle_type NOT NULL,
    fuel_type fuel_type NOT NULL,
    battery_capacity DECIMAL(8,2),
    range INTEGER,
    price DECIMAL(15,2) NOT NULL,
    features TEXT[],
    specifications JSONB,
    images TEXT[],
    status vehicle_status DEFAULT 'available',
    vin VARCHAR(17) UNIQUE,
    dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address JSONB NOT NULL,
    date_of_birth DATE,
    status customer_status DEFAULT 'active',
    segment customer_segment,
    preferences JSONB,
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(email, dealer_id)
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    sales_rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(15,2) NOT NULL,
    down_payment DECIMAL(15,2) DEFAULT 0,
    finance_amount DECIMAL(15,2) DEFAULT 0,
    status order_status DEFAULT 'draft',
    payment_status payment_status DEFAULT 'pending',
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_delivery_date TIMESTAMP WITH TIME ZONE,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Drives Table
CREATE TABLE test_drives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    sales_rep_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER DEFAULT 30, -- minutes
    status test_drive_status DEFAULT 'scheduled',
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Table
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(dealer_id, vehicle_id)
);

-- Sales Targets Table
CREATE TABLE sales_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    target_amount DECIMAL(15,2) NOT NULL,
    achieved_amount DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(dealer_id, user_id, year, month)
);

-- Promotions Table
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    vehicle_ids UUID[],
    dealer_ids UUID[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_dealer_id ON users(dealer_id);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_vehicles_manufacturer_id ON vehicles(manufacturer_id);
CREATE INDEX idx_vehicles_dealer_id ON vehicles(dealer_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_type ON vehicles(type);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_dealer_id ON customers(dealer_id);
CREATE INDEX idx_customers_status ON customers(status);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_dealer_id ON orders(dealer_id);
CREATE INDEX idx_orders_vehicle_id ON orders(vehicle_id);
CREATE INDEX idx_orders_sales_rep_id ON orders(sales_rep_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);

CREATE INDEX idx_test_drives_customer_id ON test_drives(customer_id);
CREATE INDEX idx_test_drives_vehicle_id ON test_drives(vehicle_id);
CREATE INDEX idx_test_drives_dealer_id ON test_drives(dealer_id);
CREATE INDEX idx_test_drives_scheduled_date ON test_drives(scheduled_date);

CREATE INDEX idx_inventory_dealer_id ON inventory(dealer_id);
CREATE INDEX idx_inventory_vehicle_id ON inventory(vehicle_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_manufacturers_updated_at BEFORE UPDATE ON manufacturers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dealers_updated_at BEFORE UPDATE ON dealers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_drives_updated_at BEFORE UPDATE ON test_drives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_targets_updated_at BEFORE UPDATE ON sales_targets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Foreign Key Constraints (after table creation)
ALTER TABLE dealers ADD CONSTRAINT fk_dealers_manager_id FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;