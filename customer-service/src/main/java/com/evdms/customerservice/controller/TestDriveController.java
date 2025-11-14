package com.evdms.customerservice.controller;

import com.evdms.customerservice.entity.TestDrive;
import com.evdms.customerservice.entity.enums.TestDriveStatus;
import com.evdms.customerservice.service.TestDriveService;
import com.evdms.customerservice.dto.TestDriveRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/test-drives")
public class TestDriveController {
    private final TestDriveService service;

    public TestDriveController(TestDriveService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public ResponseEntity<TestDrive> create(@Valid @RequestBody TestDriveRequest request) {
        // Map DTO to entity
        TestDrive td = new TestDrive();
        td.setCustomerId(request.getCustomerId());
        td.setCarModelId(request.getVehicleId()); // Map vehicleId to carModelId
        td.setVehicleId(request.getVehicleId()); // Also set vehicleId for database constraint
        td.setSalesRepId(UUID.randomUUID()); // Auto-generate salesRepId for testing
        td.setStatus(request.getStatus() != null ? request.getStatus() : TestDriveStatus.SCHEDULED);
        td.setNotes(request.getNotes());

        // Parse date
        if (request.getScheduledDate() != null) {
            td.setScheduledDate(LocalDate.parse(request.getScheduledDate().substring(0, 10)));
        } else {
            td.setScheduledDate(LocalDate.now().plusDays(1));
        }
        td.setScheduledTime(LocalTime.of(10, 0)); // Default time

        TestDrive saved = service.create(td);
        return ResponseEntity.created(URI.create("/api/v1/test-drives/" + saved.getId())).body(saved);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public List<TestDrive> list(
            @RequestParam(required = false) UUID dealerId,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to) {
        // Set defaults if not provided
        if (from == null)
            from = LocalDate.now().minusMonths(1);
        if (to == null)
            to = LocalDate.now().plusMonths(1);
        return service.list(dealerId, from, to);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public TestDrive get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public TestDrive update(@PathVariable UUID id, @RequestBody TestDrive patch) {
        return service.update(id, patch);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public TestDrive updateStatus(@PathVariable UUID id, @RequestParam TestDriveStatus status) {
        return service.updateStatus(id, status);
    }

    @PostMapping("/{id}/feedback")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public TestDrive addFeedback(@PathVariable UUID id, @RequestParam String feedback,
            @RequestParam(required = false) Integer rating) {
        return service.addFeedback(id, feedback, rating);
    }

    @GetMapping("/calendar")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public List<TestDrive> calendar(@RequestParam(required = false) LocalDate date) {
        // Set default to current month if not provided
        if (date == null)
            date = LocalDate.now();
        return service.calendar(date);
    }
}
