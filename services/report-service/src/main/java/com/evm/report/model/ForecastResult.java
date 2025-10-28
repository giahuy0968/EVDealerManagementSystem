package com.evm.report.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "forecast_results")
public class ForecastResult {
    @Id
    private String id;
 
    private String modelId;
    private String region;
    private LocalDate forecastDate;
    private Double predictedDemand;
    private ConfidenceInterval confidenceInterval;
    private Double actualDemand;
    private Double accuracy;
    private LocalDateTime generatedAt;
 
    @Data
    public static class ConfidenceInterval {
        private Double lower;
        private Double upper;
    }
 
    public ForecastResult() {
        this.generatedAt = LocalDateTime.now();
    }
}
