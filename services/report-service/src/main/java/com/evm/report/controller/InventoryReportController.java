package com.evm.report.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports/inventory")
@RequiredArgsConstructor
public class InventoryReportController {

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getInventorySummary(
            @RequestParam String dealerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Object> summary = new HashMap<>();
        summary.put("dealerId", dealerId);
        summary.put("period", startDate + " to " + endDate);
        summary.put("totalInventory", 150);
        summary.put("totalValue", 7500000.0);
        summary.put("averageTurnoverRate", 2.5);
        summary.put("lowStockItems", Arrays.asList("model_ev3", "model_ev6"));
        summary.put("excessStockItems", Arrays.asList("model_ev9"));

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/turnover")
    public ResponseEntity<Map<String, Object>> getInventoryTurnover(
            @RequestParam String dealerId,
            @RequestParam String period) {

        Map<String, Object> turnover = new HashMap<>();
        turnover.put("dealerId", dealerId);
        turnover.put("period", period);
        turnover.put("overallTurnoverRate", 2.8);

        Map<String, Double> turnoverByModel = new HashMap<>();
        turnoverByModel.put("model_ev6", 3.5);
        turnoverByModel.put("model_ev9", 2.1);
        turnoverByModel.put("model_ev3", 4.2);
        turnover.put("turnoverByModel", turnoverByModel);

        return ResponseEntity.ok(turnover);
    }

    @GetMapping("/aging")
    public ResponseEntity<Map<String, Object>> getInventoryAging(
            @RequestParam String dealerId) {

        Map<String, Object> aging = new HashMap<>();
        aging.put("dealerId", dealerId);
        aging.put("averageDaysInStock", 18.5);

        Map<String, Integer> agingByModel = new HashMap<>();
        agingByModel.put("model_ev6", 12);
        agingByModel.put("model_ev9", 25);
        agingByModel.put("model_ev3", 8);
        aging.put("agingByModel", agingByModel);

        Map<String, Integer> stockLevels = new HashMap<>();
        stockLevels.put("0-7 days", 15);
        stockLevels.put("8-30 days", 45);
        stockLevels.put("31-90 days", 25);
        stockLevels.put("90+ days", 5);
        aging.put("stockAgingDistribution", stockLevels);

        return ResponseEntity.ok(aging);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<Map<String, Object>> getLowStockAlerts(
            @RequestParam String dealerId) {

        Map<String, Object> alerts = new HashMap<>();
        alerts.put("dealerId", dealerId);
        alerts.put("timestamp", LocalDate.now());

        Object[] lowStockItems = {
            Map.of(
                "modelId", "model_ev3",
                "currentStock", 2,
                "minimumStock", 5,
                "daysUntilStockout", 3,
                "urgency", "HIGH"
            ),
            Map.of(
                "modelId", "model_ev6",
                "currentStock", 4,
                "minimumStock", 6,
                "daysUntilStockout", 7,
                "urgency", "MEDIUM"
            )
        };
        alerts.put("lowStockAlerts", lowStockItems);
        alerts.put("totalAlerts", lowStockItems.length);

        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/valuation")
    public ResponseEntity<Map<String, Object>> getInventoryValuation(
            @RequestParam String dealerId) {

        Map<String, Object> valuation = new HashMap<>();
        valuation.put("dealerId", dealerId);
        valuation.put("totalValuation", 7500000.0);
        valuation.put("valuationDate", LocalDate.now());

        Map<String, Double> valuationByModel = new HashMap<>();
        valuationByModel.put("model_ev9", 4500000.0);
        valuationByModel.put("model_ev6", 2000000.0);
        valuationByModel.put("model_ev3", 1000000.0);
        valuation.put("valuationByModel", valuationByModel);

        return ResponseEntity.ok(valuation);
    }
}