package com.evm.report.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "sales_daily")
public class SalesDaily {
    @Id
    private String id;

    private LocalDate date;
    private String dealerId;
    private String staffId;
    private String modelId;
    private Integer quantity;
    private Double revenue;
    private Double profit;
    private String region;
    private LocalDateTime createdAt;

    public SalesDaily() {
        this.createdAt = LocalDateTime.now();
    }
}