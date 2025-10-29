package com.evm.report.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ForecastRequest {
    private String modelId;
    private String region;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer forecastPeriod; // in days
}
