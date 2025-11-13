package com.evm.report.controller;

import com.evm.report.dto.ForecastRequest;
import com.evm.report.model.ForecastResult;
import com.evm.report.service.ForecastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports/forecast")
@RequiredArgsConstructor
public class ForecastController {

    private final ForecastService forecastService;

    @GetMapping("/sales")
    public ResponseEntity<List<ForecastResult>> getSalesForecast(
            @RequestParam String modelId,
            @RequestParam String region,
            @RequestParam(defaultValue = "30") int days) {

        List<ForecastResult> forecasts = forecastService.generateSalesForecast(modelId, region, days);
        return ResponseEntity.ok(forecasts);
    }

    @GetMapping("/demand")
    public ResponseEntity<List<ForecastResult>> getDemandForecast(
            @RequestParam String region,
            @RequestParam(defaultValue = "30") int days) {

        List<ForecastResult> forecasts = forecastService.generateDemandForecast(region, days);
        return ResponseEntity.ok(forecasts);
    }

    @PostMapping("/train")
    public ResponseEntity<String> trainModel() {
        String result = forecastService.trainMLModel();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/inventory-optimization")
    public ResponseEntity<ForecastResult> getInventoryOptimization(
            @RequestParam String modelId,
            @RequestParam String region) {

        ForecastResult optimization = forecastService.getInventoryOptimization(modelId, region);
        return ResponseEntity.ok(optimization);
    }

    @PostMapping("/custom")
    public ResponseEntity<List<ForecastResult>> getCustomForecast(@RequestBody ForecastRequest request) {
        List<ForecastResult> forecasts = forecastService.generateSalesForecast(
            request.getModelId(), 
            request.getRegion(), 
            request.getForecastPeriod()
        );
        return ResponseEntity.ok(forecasts);
    }
}