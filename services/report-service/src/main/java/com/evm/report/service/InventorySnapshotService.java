package com.evm.report.service;

import com.evm.report.model.InventorySnapshot;
import com.evm.report.repository.InventorySnapshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class InventorySnapshotService {

    private final InventorySnapshotRepository inventorySnapshotRepository;

    public void updateInventoryMetrics(String dealerId, String modelId,
                                    Integer quantity, Double value) {
        LocalDate today = LocalDate.now();

        Optional<InventorySnapshot> existingSnapshot = inventorySnapshotRepository
            .findByDealerIdAndModelIdAndDate(dealerId, modelId, today);

        InventorySnapshot snapshot;
        if (existingSnapshot.isPresent()) {
            snapshot = existingSnapshot.get();
            snapshot.setQuantity(quantity);
            snapshot.setValue(value);
        } else {
            snapshot = new InventorySnapshot();
            snapshot.setDate(today);
            snapshot.setDealerId(dealerId);
            snapshot.setModelId(modelId);
            snapshot.setQuantity(quantity);
            snapshot.setValue(value);
        }

        // Calculate metrics
        snapshot.setDaysInStockAvg(calculateDaysInStock(dealerId, modelId));
        snapshot.setTurnoverRate(calculateTurnoverRate(dealerId, modelId));

        inventorySnapshotRepository.save(snapshot);
        log.info("Inventory metrics updated for dealer: {}, model: {}", dealerId, modelId);
    }

    private Double calculateDaysInStock(String dealerId, String modelId) {
        // Logic to calculate average days in stock
        // Placeholder - in reality need to query historical data
        return 15.5;
    }

    private Double calculateTurnoverRate(String dealerId, String modelId) {
        // Logic to calculate inventory turnover rate
        // Placeholder - in reality need to calculate from sales data
        return 2.1;
    }
}