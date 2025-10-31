package com.evm.report.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.Map;

@Data
public class SalesSummaryResponse {
    private String dealerId;
    private LocalDate startDate;
    private LocalDate endDate;

    private Double totalRevenue;
    private Integer totalUnitsSold;
    private Double averageOrderValue;
    private Double revenueGrowth;
    private Integer unitsGrowth;

    private Map<String, Double> revenueByModel;
    private Map<String, Double> revenueByRegion;
    private Map<String, Integer> unitsByStaff;
}