package com.evm.report.repository;

import com.evm.report.model.FinancialMetrics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FinancialMetricsRepository extends MongoRepository<FinancialMetrics, String> {
 
    List<FinancialMetrics> findByDealerIdAndDateBetween(String dealerId, LocalDate start, LocalDate end);
 
    FinancialMetrics findByDealerIdAndDate(String dealerId, LocalDate date);
}