package com.evm.report.service;

import com.evm.report.model.SalesDaily;
import com.evm.report.repository.SalesDailyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventConsumerService {
 
    private final SalesDailyRepository salesDailyRepository;
    private final InventorySnapshotService inventorySnapshotService;
    private final CustomerMetricsService customerMetricsService;
    private final FinancialMetricsService financialMetricsService;
    private final ObjectMapper objectMapper;
 
    @RabbitListener(queues = "order.completed")
    public void handleOrderCompleted(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
 
            SalesDaily salesRecord = new SalesDaily();
            salesRecord.setDate(LocalDate.now());
            salesRecord.setDealerId(event.get("dealerId").asText());
            salesRecord.setStaffId(event.path("staffId").asText(null));
            salesRecord.setModelId(event.get("modelId").asText());
            salesRecord.setQuantity(event.get("quantity").asInt());
            salesRecord.setRevenue(event.get("totalAmount").asDouble());
            salesRecord.setProfit(event.path("profit").asDouble(0.0));
            salesRecord.setRegion(event.path("region").asText("Unknown"));
 
            salesDailyRepository.save(salesRecord);
 
            // Cập nhật financial metrics
            financialMetricsService.updateOrderCreated(
                event.get("dealerId").asText(),
                event.get("totalAmount").asDouble()
            );
 
            log.info("Sales record created for order: {}", event.get("orderId").asText());
 
        } catch (Exception e) {
            log.error("Error processing order.completed event: {}", e.getMessage(), e);
        }
    }
 
    @RabbitListener(queues = "inventory.changed")
    public void handleInventoryChanged(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
 
            String dealerId = event.get("dealerId").asText();
            String modelId = event.get("modelId").asText();
            Integer quantity = event.get("quantity").asInt();
            Double value = event.path("value").asDouble(0.0);
 
            inventorySnapshotService.updateInventoryMetrics(dealerId, modelId, quantity, value);
 
            log.info("Inventory metrics updated for dealer: {}, model: {}", dealerId, modelId);
 
        } catch (Exception e) {
            log.error("Error processing inventory.changed event: {}", e.getMessage(), e);
        }
    }
 
    @RabbitListener(queues = "customer.created")
    public void handleCustomerCreated(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
 
            String dealerId = event.get("dealerId").asText();
            String customerType = event.path("customerType").asText("new");
 
            customerMetricsService.updateCustomerMetrics(dealerId, customerType);
 
            log.info("Customer metrics updated for dealer: {}, type: {}", dealerId, customerType);
 
        } catch (Exception e) {
            log.error("Error processing customer.created event: {}", e.getMessage(), e);
        }
    }
 
    @RabbitListener(queues = "payment.received")
    public void handlePaymentReceived(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
 
            String dealerId = event.get("dealerId").asText();
            String orderId = event.get("orderId").asText();
            Double amount = event.get("amount").asDouble();
 
            financialMetricsService.updatePaymentReceived(dealerId, amount, orderId);
 
            log.info("Payment processed for dealer: {}, order: {}, amount: {}",
                    dealerId, orderId, amount);
 
        } catch (Exception e) {
            log.error("Error processing payment.received event: {}", e.getMessage(), e);
        }
    }
 
    @RabbitListener(queues = "testdrive.scheduled")
    public void handleTestDriveScheduled(String message) {
        try {
            JsonNode event = objectMapper.readTree(message);
            String dealerId = event.get("dealerId").asText();
 
            customerMetricsService.updateTestDrive(dealerId);
 
            log.info("Test drive recorded for dealer: {}", dealerId);
 
        } catch (Exception e) {
            log.error("Error processing testdrive.scheduled event: {}", e.getMessage(), e);
        }
    }
}
