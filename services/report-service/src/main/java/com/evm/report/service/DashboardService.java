package com.evm.report.service;

import com.evm.report.dto.DashboardResponse;
import com.evm.report.model.*;
import com.evm.report.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SalesDailyRepository salesDailyRepository;
    private final InventorySnapshotRepository inventorySnapshotRepository;
    private final CustomerMetricsRepository customerMetricsRepository;
    private final FinancialMetricsRepository financialMetricsRepository;

    @Cacheable(value = "dealerDashboard", key = "#dealerId + '_' + #days")
    public DashboardResponse getDealerDashboard(String dealerId, int days) {
        log.info("Fetching dashboard data for dealer: {}, period: {} days", dealerId, days);

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);

        // Fetch all data
        List<SalesDaily> salesData = salesDailyRepository
            .findByDealerIdAndDateBetween(dealerId, startDate, endDate);

        List<InventorySnapshot> inventoryData = inventorySnapshotRepository
            .findByDealerIdAndDateBetween(dealerId, startDate, endDate);

        List<CustomerMetrics> customerData = customerMetricsRepository
            .findByDealerIdAndDateBetween(dealerId, startDate, endDate);

        List<FinancialMetrics> financialData = financialMetricsRepository
            .findByDealerIdAndDateBetween(dealerId, startDate, endDate);

        return buildDashboardResponse(dealerId, startDate, endDate,
                                    salesData, inventoryData, customerData, financialData);
    }

    private DashboardResponse buildDashboardResponse(String dealerId, LocalDate startDate,
                                                   LocalDate endDate, List<SalesDaily> salesData,
                                                   List<InventorySnapshot> inventoryData,
                                                   List<CustomerMetrics> customerData,
                                                   List<FinancialMetrics> financialData) {
        DashboardResponse response = new DashboardResponse();
        response.setDealerId(dealerId);
        response.setPeriodStart(startDate);
        response.setPeriodEnd(endDate);

        // Sales Metrics
        double totalRevenue = salesData.stream().mapToDouble(SalesDaily::getRevenue).sum();
        int totalSales = salesData.stream().mapToInt(SalesDaily::getQuantity).sum();
        response.setTotalRevenue(totalRevenue);
        response.setTotalSales(totalSales);

        // Inventory Metrics
        int totalInventory = inventoryData.stream().mapToInt(InventorySnapshot::getQuantity).sum();
        double inventoryValue = inventoryData.stream().mapToDouble(InventorySnapshot::getValue).sum();
        double avgTurnoverRate = inventoryData.stream()
            .mapToDouble(InventorySnapshot::getTurnoverRate)
            .average().orElse(0.0);
        response.setTotalInventory(totalInventory);
        response.setInventoryValue(inventoryValue);
        response.setTurnoverRate(avgTurnoverRate);

        // Customer Metrics
        int newCustomers = customerData.stream().mapToInt(CustomerMetrics::getNewCustomers).sum();
        int returningCustomers = customerData.stream().mapToInt(CustomerMetrics::getReturningCustomers).sum();
        double avgConversionRate = customerData.stream()
            .mapToDouble(CustomerMetrics::getConversionRate)
            .average().orElse(0.0);
        response.setNewCustomers(newCustomers);
        response.setReturningCustomers(returningCustomers);
        response.setConversionRate(avgConversionRate);

        // Financial Metrics
        double outstandingDebt = financialData.stream().mapToDouble(FinancialMetrics::getOutstandingDebt).sum();
        double avgPaymentCompletion = financialData.stream()
            .mapToDouble(FinancialMetrics::getPaymentCompletionRate)
            .average().orElse(0.0);
        response.setOutstandingDebt(outstandingDebt);
        response.setPaymentCompletionRate(avgPaymentCompletion);

        // Build chart data
        buildChartData(response, salesData, inventoryData);

        log.info("Dashboard data prepared for dealer: {}", dealerId);
        return response;
    }

    private void buildChartData(DashboardResponse response, List<SalesDaily> salesData,
                              List<InventorySnapshot> inventoryData) {
        // Sales chart data
        var salesChart = salesData.stream()
            .map(sales -> {
                var chartData = new DashboardResponse.SalesChartData();
                chartData.setDate(sales.getDate());
                chartData.setRevenue(sales.getRevenue());
                chartData.setQuantity(sales.getQuantity());
                return chartData;
            })
            .collect(Collectors.toList());
        response.setSalesChart(salesChart);

        // Inventory chart data
        var inventoryChart = inventoryData.stream()
            .map(inv -> {
                var chartData = new DashboardResponse.InventoryChartData();
                chartData.setModelId(inv.getModelId());
                chartData.setQuantity(inv.getQuantity());
                chartData.setValue(inv.getValue());
                return chartData;
            })
            .collect(Collectors.toList());
        response.setInventoryChart(inventoryChart);

        // Sales by model
        var salesByModel = salesData.stream()
            .collect(Collectors.groupingBy(
                SalesDaily::getModelId,
                Collectors.summingInt(SalesDaily::getQuantity)
            ));
        response.setSalesByModel(salesByModel);
    }
}