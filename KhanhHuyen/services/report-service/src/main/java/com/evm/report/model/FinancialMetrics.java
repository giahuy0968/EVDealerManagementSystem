package com.evm.report.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "financial_metrics")
public class FinancialMetrics {
    @Id
    private String id;

    private LocalDate date;
    private String dealerId;
    private Double totalRevenue;
    private Double totalProfit;
    private Double outstandingDebt;
    private Integer paidOrders;
    private Integer pendingOrders;
    private Double paymentCompletionRate;
    private LocalDateTime createdAt;

    public FinancialMetrics() {
        this.createdAt = LocalDateTime.now();
    }
}