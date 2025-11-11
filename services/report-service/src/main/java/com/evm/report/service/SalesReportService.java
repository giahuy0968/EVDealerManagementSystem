package com.evm.report.service;

import com.evm.report.dto.SalesSummaryResponse;
import com.evm.report.model.SalesDaily;
import com.evm.report.repository.SalesDailyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SalesReportService {

    private final SalesDailyRepository salesDailyRepository;

    @Cacheable(value = "salesSummary", key = "#dealerId + '_' + #startDate + '_' + #endDate")
    public SalesSummaryResponse getSalesSummary(String dealerId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating sales summary on dealer: {} from {} to {}", dealerId, startDate, endDate);

        List<SalesDaily> salesData = salesDailyRepository
            .findByDealerIdAndDateBetween(dealerId, startDate, endDate);

        return buildSalesSummaryResponse(dealerId, startDate, endDate, salesData);
    }

    public SalesSummaryResponse getSalesByModel(String dealerId, LocalDate startDate, LocalDate endDate) {
        List<SalesDaily> salesData = salesDailyRepository
            .findByDealerIdAndDateBetween(dealerId, startDate, endDate);

        SalesSummaryResponse response = buildSalesSummaryResponse(dealerId, startDate, endDate, salesData);

        // Group by model
        Map<String, Double> revenueByModel = salesData.stream()
            .collect(Collectors.groupingBy(
                SalesDaily::getModelId,
                Collectors.summingDouble(SalesDaily::getRevenue)
            ));
        response.setRevenueByModel(revenueByModel);

        return response;
    }

    public SalesSummaryResponse getSalesByRegion(String dealerId, LocalDate startDate, LocalDate endDate) {
        List<SalesDaily> salesData = salesDailyRepository
            .findByDealerIdAndDateBetween(dealerId, startDate, endDate);

        SalesSummaryResponse response = buildSalesSummaryResponse(dealerId, startDate, endDate, salesData);

        // Group by region
        Map<String, Double> revenueByRegion = salesData.stream()
            .collect(Collectors.groupingBy(
                SalesDaily::getRegion,
                Collectors.summingDouble(SalesDaily::getRevenue)
            ));
        response.setRevenueByRegion(revenueByRegion);

        return response;
    }

    public SalesSummaryResponse getSalesByStaff(String dealerId, LocalDate startDate, LocalDate endDate) {
        List<SalesDaily> salesData = salesDailyRepository
            .findByDealerIdAndDateBetween(dealerId, startDate, endDate);

        SalesSummaryResponse response = buildSalesSummaryResponse(dealerId, startDate, endDate, salesData);

        // Group by staff
        Map<String, Integer> unitsByStaff = salesData.stream()
            .filter(sales -> sales.getStaffId() != null)
            .collect(Collectors.groupingBy(
                SalesDaily::getStaffId,
                Collectors.summingInt(SalesDaily::getQuantity)
            ));
        response.setUnitsByStaff(unitsByStaff);

        return response;
    }

    private SalesSummaryResponse buildSalesSummaryResponse(String dealerId, LocalDate startDate,
                                                        LocalDate endDate, List<SalesDaily> salesData) {
        SalesSummaryResponse response = new SalesSummaryResponse();
        response.setDealerId(dealerId);
        response.setStartDate(startDate);
        response.setEndDate(endDate);

        double totalRevenue = salesData.stream().mapToDouble(SalesDaily::getRevenue).sum();
        int totalUnits = salesData.stream().mapToInt(SalesDaily::getQuantity).sum();
        double avgOrderValue = totalUnits > 0 ? totalRevenue / totalUnits : 0;

        response.setTotalRevenue(totalRevenue);
        response.setTotalUnitsSold(totalUnits);
        response.setAverageOrderValue(avgOrderValue);

        log.info("Sales summary generated: {} units, ${} revenue", totalUnits, totalRevenue);
        return response;
    }
}