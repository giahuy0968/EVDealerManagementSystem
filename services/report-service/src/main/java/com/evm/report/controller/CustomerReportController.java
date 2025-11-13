package com.evm.report.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports/customers")
@RequiredArgsConstructor
public class CustomerReportController {

    @GetMapping("/acquisition")
    public ResponseEntity<Map<String, Object>> getCustomerAcquisition(
            @RequestParam String dealerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Object> acquisition = new HashMap<>();
        acquisition.put("dealerId", dealerId);
        acquisition.put("period", startDate + " to " + endDate);
        acquisition.put("newCustomers", 45);
        acquisition.put("returningCustomers", 28);
        acquisition.put("acquisitionCost", 1250.0);
        acquisition.put("acquisitionChannels", Map.of(
            "walkin", 25,
            "referral", 15,
            "online", 18,
            "event", 12
        ));

        return ResponseEntity.ok(acquisition);
    }

    @GetMapping("/retention")
    public ResponseEntity<Map<String, Object>> getCustomerRetention(
            @RequestParam String dealerId,
            @RequestParam String period) {

        Map<String, Object> retention = new HashMap<>();
        retention.put("dealerId", dealerId);
        retention.put("period", period);
        retention.put("retentionRate", 72.5);
        retention.put("churnRate", 27.5);
        retention.put("repeatPurchaseRate", 65.8);

        Map<String, Double> retentionBySegment = new HashMap<>();
        retentionBySegment.put("premium", 85.2);
        retentionBySegment.put("standard", 70.1);
        retentionBySegment.put("new", 45.3);
        retention.put("retentionBySegment", retentionBySegment);

        return ResponseEntity.ok(retention);
    }

    @GetMapping("/lifetime-value")
    public ResponseEntity<Map<String, Object>> getCustomerLifetimeValue(
            @RequestParam String dealerId) {

        Map<String, Object> clv = new HashMap<>();
        clv.put("dealerId", dealerId);
        clv.put("averageCLV", 185000.0);
        clv.put("medianCLV", 152000.0);

        Map<String, Double> clvBySegment = new HashMap<>();
        clvBySegment.put("premium", 285000.0);
        clvBySegment.put("standard", 165000.0);
        clvBySegment.put("new", 85000.0);
        clv.put("clvBySegment", clvBySegment);

        Map<String, Integer> customerLifetime = new HashMap<>();
        customerLifetime.put("0-1 years", 120);
        customerLifetime.put("1-3 years", 85);
        customerLifetime.put("3-5 years", 45);
        customerLifetime.put("5+ years", 25);
        clv.put("customerLifetimeDistribution", customerLifetime);

        return ResponseEntity.ok(clv);
    }

    @GetMapping("/segments")
    public ResponseEntity<Map<String, Object>> getCustomerSegments(
            @RequestParam String dealerId) {

        Map<String, Object> segments = new HashMap<>();
        segments.put("dealerId", dealerId);
        segments.put("totalCustomers", 275);

        // Dùng List<Map<String,Object>> thay vì Map[]
        List<Map<String, Object>> segmentData = List.of(
            Map.of(
                "segment", "Premium",
                "count", 45,
                "percentage", 16.4,
                "avgOrderValue", 185000.0,
                "retentionRate", 85.2
            ),
            Map.of(
                "segment", "Standard",
                "count", 150,
                "percentage", 54.5,
                "avgOrderValue", 95000.0,
                "retentionRate", 70.1
            ),
            Map.of(
                "segment", "New",
                "count", 80,
                "percentage", 29.1,
                "avgOrderValue", 55000.0,
                "retentionRate", 45.3
            )
        );

        segments.put("segments", segmentData);

        return ResponseEntity.ok(segments);
    }

    @GetMapping("/satisfaction")
    public ResponseEntity<Map<String, Object>> getCustomerSatisfaction(
            @RequestParam String dealerId) {

        Map<String, Object> satisfaction = new HashMap<>();
        satisfaction.put("dealerId", dealerId);
        satisfaction.put("overallSatisfactionScore", 4.2);
        satisfaction.put("npsScore", 65);
        satisfaction.put("csatScore", 85.5);

        Map<String, Double> satisfactionByChannel = new HashMap<>();
        satisfactionByChannel.put("sales", 4.5);
        satisfactionByChannel.put("service", 4.1);
        satisfactionByChannel.put("online", 4.3);
        satisfactionByChannel.put("financing", 4.0);
        satisfaction.put("satisfactionByChannel", satisfactionByChannel);

        return ResponseEntity.ok(satisfaction);
    }
}
