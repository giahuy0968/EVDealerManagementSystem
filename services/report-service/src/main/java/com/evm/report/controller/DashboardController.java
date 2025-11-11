package com.evm.report.controller;

import com.evm.report.dto.DashboardResponse;
import com.evm.report.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dealer")
    public ResponseEntity<DashboardResponse> getDealerDashboard(
            @RequestParam String dealerId,
            @RequestParam(defaultValue = "30") int days) {

        DashboardResponse dashboard = dashboardService.getDealerDashboard(dealerId, days);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/manufacturer")
    public ResponseEntity<DashboardResponse> getManufacturerDashboard(
            @RequestParam String manufacturerId,
            @RequestParam(defaultValue = "30") int days) {

        // For demo, using dealer service for manufacturer
        DashboardResponse dashboard = dashboardService.getDealerDashboard(manufacturerId, days);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/admin")
    public ResponseEntity<DashboardResponse> getAdminDashboard(
            @RequestParam(defaultValue = "30") int days) {

        // For demo, using a fixed admin ID
        DashboardResponse dashboard = dashboardService.getDealerDashboard("admin", days);
        return ResponseEntity.ok(dashboard);
    }
}