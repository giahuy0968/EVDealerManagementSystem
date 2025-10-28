package com.evm.report.repository;

import com.evm.report.model.CustomerMetrics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface CustomerMetricsRepository extends MongoRepository<CustomerMetrics, String> {
 
    List<CustomerMetrics> findByDealerIdAndDateBetween(String dealerId, LocalDate start, LocalDate end);
 
    CustomerMetrics findByDealerIdAndDate(String dealerId, LocalDate date);
}
