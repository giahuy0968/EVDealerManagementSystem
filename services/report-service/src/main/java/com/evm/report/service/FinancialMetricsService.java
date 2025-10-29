package com.evm.report.service;

import com.evm.report.model.FinancialMetrics;
import com.evm.report.repository.FinancialMetricsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class FinancialMetricsService {
 
    private final FinancialMetricsRepository financialMetricsRepository;
 
    public void updatePaymentReceived(String dealerId, Double amount, String orderId) {
        LocalDate today = LocalDate.now();
 
        FinancialMetrics metrics = financialMetricsRepository
            .findByDealerIdAndDate(dealerId, today);
 
        if (metrics == null) {
            metrics = new FinancialMetrics();
            metrics.setDate(today);
            metrics.setDealerId(dealerId);
            metrics.setTotalRevenue(0.0);
            metrics.setTotalProfit(0.0);
            metrics.setOutstandingDebt(0.0);
            metrics.setPaidOrders(0);
            metrics.setPendingOrders(0);
            metrics.setPaymentCompletionRate(0.0);
        }
 
        // Cập nhật metrics
        metrics.setTotalRevenue(metrics.getTotalRevenue() + amount);
        metrics.setPaidOrders(metrics.getPaidOrders() + 1);
 
        // Tính toán completion rate
        int totalOrders = metrics.getPaidOrders() + metrics.getPendingOrders();
        if (totalOrders > 0) {
            double completionRate = (double) metrics.getPaidOrders() / totalOrders * 100;
            metrics.setPaymentCompletionRate(completionRate);
        }
 
        // Tính profit (20% của revenue - placeholder)
        metrics.setTotalProfit(metrics.getTotalRevenue() * 0.2);
 
        financialMetricsRepository.save(metrics);
        log.info("Financial metrics updated for dealer: {}, amount: {}", dealerId, amount);
    }
 
    public void updateOrderCreated(String dealerId, Double amount) {
        LocalDate today = LocalDate.now();
 
        FinancialMetrics metrics = financialMetricsRepository
            .findByDealerIdAndDate(dealerId, today);
 
        if (metrics == null) {
            metrics = new FinancialMetrics();
            metrics.setDate(today);
            metrics.setDealerId(dealerId);
            metrics.setPendingOrders(0);
            metrics.setOutstandingDebt(0.0);
            metrics.setTotalRevenue(0.0);
            metrics.setTotalProfit(0.0);
            metrics.setPaidOrders(0);
            metrics.setPaymentCompletionRate(0.0);
        }
 
        metrics.setPendingOrders(metrics.getPendingOrders() + 1);
        metrics.setOutstandingDebt(metrics.getOutstandingDebt() + amount);
 
        financialMetricsRepository.save(metrics);
        log.info("Order created metrics updated for dealer: {}, amount: {}", dealerId, amount);
    }
}
