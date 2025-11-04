package com.evdms.customerservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customers")
public class SegmentController {

    // AI Optional: return mock segments
    @GetMapping("/segments")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER')")
    public Map<String, Object> segments() {
        return Map.of(
                "VIP", 12,
                "potential", 104,
                "inactive", 43);
    }

    @GetMapping("/{id}/score")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public ResponseEntity<Map<String, Object>> score(@PathVariable UUID id) {
        // Placeholder scoring logic
        return ResponseEntity.ok(Map.of("customer_id", id, "score", 72));
    }
}
