package com.evm.report.repository;

import com.evm.report.model.SalesDaily;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalesDailyRepository extends MongoRepository<SalesDaily, String> {
 
    List<SalesDaily> findByDealerIdAndDateBetween(String dealerId, LocalDate start, LocalDate end);
 
    List<SalesDaily> findByDateBetween(LocalDate start, LocalDate end);
 
    @Query("{ 'date': { $gte: ?0, $lte: ?1 }, 'dealerId': ?2 }")
    List<SalesDaily> findSalesInPeriodForDealer(LocalDate start, LocalDate end, String dealerId);
 
    @Query(value = "{ 'date': { $gte: ?0, $lte: ?1 } }",
           fields = "{ 'revenue': 1, 'quantity': 1, 'modelId': 1, 'region': 1 }")
    List<SalesDaily> findSalesSummary(LocalDate start, LocalDate end);
}
