package com.evm.report.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class DashboardResponse {
    private String dealerId;
    private LocalDate periodStart;
    private LocalDate periodEnd;

    // Sales Metrics
    private Double totalRevenue;
    private Integer totalSales;
    private Double revenueGrowth;
    private Integer salesGrowth;

    // Inventory Metrics
    private Integer totalInventory;
    private Double inventoryValue;
    private Double turnoverRate;

    // Customer Metrics
    private Integer newCustomers;
    private Integer returningCustomers;
    private Double conversionRate;

    // Financial Metrics
    private Double outstandingDebt;
    private Double paymentCompletionRate;

    // Charts Data
    private List<SalesChartData> salesChart;
    private List<InventoryChartData> inventoryChart;
    private Map<String, Integer> salesByModel;

    @Data
    public static class SalesChartData {
        private LocalDate date;
        private Double revenue;
        private Integer quantity;
    }

    @Data
    public static class InventoryChartData {
        private String modelId;
        private Integer quantity;
        private Double value;
    }
}