package com.evdms.customerservice.controller;

import com.evdms.customerservice.entity.TestDrive;
import com.evdms.customerservice.entity.enums.TestDriveStatus;
import com.evdms.customerservice.service.TestDriveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
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
    public ResponseEntity<TestDrive> create(@Valid @RequestBody TestDrive td) {
        TestDrive saved = service.create(td);
        return ResponseEntity.created(URI.create("/api/v1/test-drives/" + saved.getId())).body(saved);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public List<TestDrive> list(@RequestParam UUID dealerId,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to) {
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
    public List<TestDrive> calendar(@RequestParam LocalDate date) {
        return service.calendar(date);
    }
}
