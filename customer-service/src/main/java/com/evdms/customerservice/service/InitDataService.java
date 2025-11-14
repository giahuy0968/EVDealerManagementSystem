package com.evdms.customerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class InitDataService implements ApplicationRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final UUID DEFAULT_DEALER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID DEFAULT_CUSTOMER_ID = UUID.fromString("00000000-0000-0000-0000-000000000002");

    @Override
    public void run(ApplicationArguments args) {
        try {
            // Check if default dealer exists first
            Integer dealerCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM dealers WHERE id = ?",
                    Integer.class,
                    DEFAULT_DEALER_ID);

            if (dealerCount == null || dealerCount == 0) {
                // Both phone AND address are required
                String dealerSql = """
                        INSERT INTO dealers (id, name, code, email, phone, address)
                        VALUES (?, 'Default Test Dealer', 'TEST001', 'test@dealer.com', '0000000000', '{"street":"Test St","city":"Test City"}')
                        """;
                jdbcTemplate.update(dealerSql, DEFAULT_DEALER_ID);
                System.out.println("✓ Default dealer created: " + DEFAULT_DEALER_ID);
            } else {
                System.out.println("✓ Default dealer already exists: " + DEFAULT_DEALER_ID);
            }

            // Check if default customer exists first
            Integer customerCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM customers WHERE id = ?",
                    Integer.class,
                    DEFAULT_CUSTOMER_ID);

            if (customerCount == null || customerCount == 0) {
                String customerSql = """
                        INSERT INTO customers (id, dealer_id, full_name, first_name, last_name, phone, email, address, city, status, created_at, updated_at)
                        VALUES (?, ?, 'Default Test Customer', 'Default', 'Customer', '0000000001', 'test@customer.com', 'Test Address', 'Test City', 'NEW', NOW(), NOW())
                        """;
                jdbcTemplate.update(customerSql, DEFAULT_CUSTOMER_ID, DEFAULT_DEALER_ID);
                System.out.println("✓ Default customer created: " + DEFAULT_CUSTOMER_ID);
            } else {
                System.out.println("✓ Default customer already exists: " + DEFAULT_CUSTOMER_ID);
            }

            // Create default vehicle for test drives
            UUID defaultVehicleId = UUID.fromString("123e4567-e89b-12d3-a456-426614174001");
            Integer vehicleCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM vehicles WHERE id = ?",
                    Integer.class,
                    defaultVehicleId);

            if (vehicleCount == null || vehicleCount == 0) {
                String vehicleSql = """
                        INSERT INTO vehicles (id, dealer_id, make, model, year, vin, status, price)
                        VALUES (?, ?, 'Tesla', 'Model 3', 2024, 'TEST123VIN', 'AVAILABLE', 50000.00)
                        """;
                jdbcTemplate.update(vehicleSql, defaultVehicleId, DEFAULT_DEALER_ID);
                System.out.println("✓ Default vehicle created: " + defaultVehicleId);
            } else {
                System.out.println("✓ Default vehicle already exists: " + defaultVehicleId);
            }

        } catch (Exception e) {
            System.err.println("⚠ Warning: Could not initialize default test data: " + e.getMessage());
            e.printStackTrace();
            // Don't fail app startup if this fails
        }
    }
}
