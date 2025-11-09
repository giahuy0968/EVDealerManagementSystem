package com.evm.report.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "customer_metrics")
public class CustomerMetrics {
    @Id
    private String id;

    private LocalDate date;
    private String dealerId;
    private Integer newCustomers;
    private Integer returningCustomers;
    private Integer testDrives;
    private Double conversionRate;
    private Double avgOrderValue;
    private LocalDateTime createdAt;

    public CustomerMetrics() {
        this.createdAt = LocalDateTime.now();
    }
}