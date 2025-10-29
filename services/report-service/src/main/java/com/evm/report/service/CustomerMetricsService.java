package com.evm.report.service;

import com.evm.report.model.CustomerMetrics;
import com.evm.report.repository.CustomerMetricsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerMetricsService {
 
    private final CustomerMetricsRepository customerMetricsRepository;
 
    public void updateCustomerMetrics(String dealerId, String customerType) {
        LocalDate today = LocalDate.now();
 
        CustomerMetrics metrics = customerMetricsRepository
            .findByDealerIdAndDate(dealerId, today);
 
        if (metrics == null) {
            metrics = new CustomerMetrics();
            metrics.setDate(today);
            metrics.setDealerId(dealerId);
            metrics.setNewCustomers(0);
            metrics.setReturningCustomers(0);
            metrics.setTestDrives(0);
            metrics.setConversionRate(0.0);
            metrics.setAvgOrderValue(0.0);
        }
 
        // Cập nhật theo loại khách hàng
        if ("new".equals(customerType)) {
            metrics.setNewCustomers(metrics.getNewCustomers() + 1);
        } else if ("returning".equals(customerType)) {
            metrics.setReturningCustomers(metrics.getReturningCustomers() + 1);
        }
 
        // Tính toán conversion rate và avg order value
        calculateMetrics(metrics);
 
        customerMetricsRepository.save(metrics);
        log.info("Customer metrics updated for dealer: {}, type: {}", dealerId, customerType);
    }
 
    public void updateTestDrive(String dealerId) {
        LocalDate today = LocalDate.now();
 
        CustomerMetrics metrics = customerMetricsRepository
            .findByDealerIdAndDate(dealerId, today);
 
        if (metrics == null) {
            metrics = new CustomerMetrics();
            metrics.setDate(today);
            metrics.setDealerId(dealerId);
            metrics.setNewCustomers(0);
            metrics.setReturningCustomers(0);
            metrics.setTestDrives(0);
            metrics.setConversionRate(0.0);
            metrics.setAvgOrderValue(0.0);
        }
 
        metrics.setTestDrives(metrics.getTestDrives() + 1);
        calculateMetrics(metrics);
 
        customerMetricsRepository.save(metrics);
        log.info("Test drive recorded for dealer: {}", dealerId);
    }
 
    private void calculateMetrics(CustomerMetrics metrics) {
        int totalCustomers = metrics.getNewCustomers() + metrics.getReturningCustomers();
        if (totalCustomers > 0 && metrics.getTestDrives() > 0) {
            double conversionRate = (double) totalCustomers / metrics.getTestDrives() * 100;
            metrics.setConversionRate(Math.min(conversionRate, 100.0));
        }
 
        // Placeholder cho avg order value - thực tế cần tích hợp với sales data
        metrics.setAvgOrderValue(55000.0);
    }
}
