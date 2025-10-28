package com.evm.report.repository;

import com.evm.report.model.InventorySnapshot;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventorySnapshotRepository extends MongoRepository<InventorySnapshot, String> {
 
    List<InventorySnapshot> findByDealerIdAndDateBetween(String dealerId, LocalDate start, LocalDate end);
 
    Optional<InventorySnapshot> findByDealerIdAndModelIdAndDate(String dealerId, String modelId, LocalDate date);
 
    List<InventorySnapshot> findByDate(LocalDate date);
}
