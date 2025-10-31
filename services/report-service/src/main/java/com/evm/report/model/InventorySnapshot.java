package com.evm.report.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "inventory_snapshots")
public class InventorySnapshot {
    @Id
    private String id;

    private LocalDate date;
    private String dealerId;
    private String modelId;
    private Integer quantity;
    private Double value;
    private Double daysInStockAvg;
    private Double turnoverRate;
    private LocalDateTime createdAt;

    public InventorySnapshot() {
        this.createdAt = LocalDateTime.now();
    }
}