package com.evm.report.controller;

import com.evm.report.dto.SalesSummaryResponse;
import com.evm.report.service.SalesReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/reports/sales")
@RequiredArgsConstructor
public class SalesReportController {

    private final SalesReportService salesReportService;

    @GetMapping("/summary")
    public ResponseEntity<SalesSummaryResponse> getSalesSummary(
            @RequestParam String dealerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        SalesSummaryResponse summary = salesReportService.getSalesSummary(dealerId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/by-model")
    public ResponseEntity<SalesSummaryResponse> getSalesByModel(
            @RequestParam String dealerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        SalesSummaryResponse summary = salesReportService.getSalesByModel(dealerId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/by-region")
    public ResponseEntity<SalesSummaryResponse> getSalesByRegion(
            @RequestParam String dealerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        SalesSummaryResponse summary = salesReportService.getSalesByRegion(dealerId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/by-staff")
    public ResponseEntity<SalesSummaryResponse> getSalesByStaff(
            @RequestParam String dealerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        SalesSummaryResponse summary = salesReportService.getSalesByStaff(dealerId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/by-period")
    public ResponseEntity<SalesSummaryResponse> getSalesByPeriod(
            @RequestParam String dealerId,
            @RequestParam String period) {

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = calculateStartDate(period, endDate);

        SalesSummaryResponse summary = salesReportService.getSalesSummary(dealerId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/comparison")
    public ResponseEntity<SalesSummaryResponse> getSalesComparison(
            @RequestParam String dealerId,
            @RequestParam String comparisonType) {

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = calculateComparisonDate(comparisonType, endDate);

        SalesSummaryResponse summary = salesReportService.getSalesSummary(dealerId, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    private LocalDate calculateStartDate(String period, LocalDate endDate) {
        return switch (period.toLowerCase()) {
            case "daily" -> endDate;
            case "weekly" -> endDate.minusWeeks(1);
            case "monthly" -> endDate.minusMonths(1);
            case "yearly" -> endDate.minusYears(1);
            default -> endDate.minusMonths(1);
        };
    }

    private LocalDate calculateComparisonDate(String comparisonType, LocalDate endDate) {
        return switch (comparisonType.toLowerCase()) {
            case "yoy" -> endDate.minusYears(1); // Year over Year
            case "mom" -> endDate.minusMonths(1); // Month over Month
            case "qoq" -> endDate.minusMonths(3); // Quarter over Quarter
            default -> endDate.minusMonths(1);
        };
    }
}