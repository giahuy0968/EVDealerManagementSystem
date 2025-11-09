package com.evm.report.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports/financial")
@RequiredArgsConstructor
public class FinancialReportController {

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueReport(
            @RequestParam String dealerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Object> revenue = new HashMap<>();
        revenue.put("dealerId", dealerId);
        revenue.put("period", startDate + " to " + endDate);
        revenue.put("totalRevenue", 1850000.0);
        revenue.put("revenueGrowth", 15.2);

        Map<String, Double> revenueBySource = new HashMap<>();
        revenueBySource.put("vehicle_sales", 1500000.0);
        revenueBySource.put("after_sales", 250000.0);
        revenueBySource.put("financing", 80000.0);
        revenueBySource.put("insurance", 20000.0);
        revenue.put("revenueBySource", revenueBySource);

        Map<String, Double> monthlyRevenue = new HashMap<>();
        monthlyRevenue.put("2024-01", 450000.0);
        monthlyRevenue.put("2024-02", 520000.0);
        monthlyRevenue.put("2024-03", 580000.0);
        monthlyRevenue.put("2024-04", 600000.0);
        revenue.put("monthlyRevenue", monthlyRevenue);

        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/profit")
    public ResponseEntity<Map<String, Object>> getProfitReport(
            @RequestParam String dealerId,
            @RequestParam String period) {

        Map<String, Object> profit = new HashMap<>();
        profit.put("dealerId", dealerId);
        profit.put("period", period);
        profit.put("grossProfit", 425000.0);
        profit.put("netProfit", 285000.0);
        profit.put("profitMargin", 23.5);
        profit.put("profitGrowth", 12.8);

        Map<String, Double> profitByModel = new HashMap<>();
        profitByModel.put("model_ev9", 185000.0);
        profitByModel.put("model_ev6", 120000.0);
        profitByModel.put("model_ev3", 80000.0);
        profitByModel.put("after_sales", 40000.0);
        profit.put("profitByModel", profitByModel);

        return ResponseEntity.ok(profit);
    }

    @GetMapping("/debt")
    public ResponseEntity<Map<String, Object>> getDebtReport(
            @RequestParam String dealerId) {

        Map<String, Object> debt = new HashMap<>();
        debt.put("dealerId", dealerId);
        debt.put("totalOutstandingDebt", 450000.0);
        debt.put("debtToRevenueRatio", 24.3);
        debt.put("averageCollectionPeriod", 45.2);

        @SuppressWarnings("unchecked")
        Map<String, Object>[] debtAging = new Map[]{
            Map.of(
                "period", "0-30 days",
                "amount", 250000.0,
                "percentage", 55.6,
                "customers", 12
            ),
            Map.of(
                "period", "31-60 days",
                "amount", 120000.0,
                "percentage", 26.7,
                "customers", 8
            ),
            Map.of(
                "period", "61-90 days",
                "amount", 60000.0,
                "percentage", 13.3,
                "customers", 4
            ),
            Map.of(
                "period", "90+ days",
                "amount", 20000.0,
                "percentage", 4.4,
                "customers", 2
            )
        };
        debt.put("debtAging", debtAging);

        return ResponseEntity.ok(debt);
    }

    @GetMapping("/payment-status")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(
            @RequestParam String dealerId) {

        Map<String, Object> paymentStatus = new HashMap<>();
        paymentStatus.put("dealerId", dealerId);
        paymentStatus.put("totalInvoices", 85);
        paymentStatus.put("paidInvoices", 65);
        paymentStatus.put("pendingInvoices", 15);
        paymentStatus.put("overdueInvoices", 5);
        paymentStatus.put("paymentCompletionRate", 76.5);

        Map<String, Integer> paymentMethods = new HashMap<>();
        paymentMethods.put("cash", 25);
        paymentMethods.put("bank_transfer", 35);
        paymentMethods.put("credit_card", 20);
        paymentMethods.put("financing", 5);
        paymentStatus.put("paymentMethods", paymentMethods);

        return ResponseEntity.ok(paymentStatus);
    }

    @GetMapping("/cashflow")
    public ResponseEntity<Map<String, Object>> getCashFlowReport(
            @RequestParam String dealerId,
            @RequestParam String period) {

        Map<String, Object> cashflow = new HashMap<>();
        cashflow.put("dealerId", dealerId);
        cashflow.put("period", period);
        cashflow.put("cashInflow", 1850000.0);
        cashflow.put("cashOutflow", 1565000.0);
        cashflow.put("netCashflow", 285000.0);
        cashflow.put("cashBalance", 750000.0);

        Map<String, Double> inflowSources = new HashMap<>();
        inflowSources.put("vehicle_sales", 1500000.0);
        inflowSources.put("service", 250000.0);
        inflowSources.put("financing", 80000.0);
        inflowSources.put("other", 20000.0);
        cashflow.put("inflowSources", inflowSources);

        Map<String, Double> outflowCategories = new HashMap<>();
        outflowCategories.put("inventory", 850000.0);
        outflowCategories.put("operating_expenses", 450000.0);
        outflowCategories.put("salaries", 250000.0);
        outflowCategories.put("loan_payments", 15000.0);
        cashflow.put("outflowCategories", outflowCategories);

        return ResponseEntity.ok(cashflow);
    }

    @GetMapping("/expenses")
    public ResponseEntity<Map<String, Object>> getExpensesReport(
            @RequestParam String dealerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Object> expenses = new HashMap<>();
        expenses.put("dealerId", dealerId);
        expenses.put("period", startDate + " to " + endDate);
        expenses.put("totalExpenses", 850000.0);
        expenses.put("expenseBreakdown", Map.of(
            "inventory_costs", 450000.0,
            "staff_salaries", 250000.0,
            "rent_utilities", 80000.0,
            "marketing", 40000.0,
            "maintenance", 30000.0
        ));

        return ResponseEntity.ok(expenses);
    }
}