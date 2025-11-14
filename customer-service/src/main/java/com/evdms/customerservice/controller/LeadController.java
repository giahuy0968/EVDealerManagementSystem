package com.evdms.customerservice.controller;

import com.evdms.customerservice.dto.LeadCreateRequest;
import com.evdms.customerservice.entity.Customer;
import com.evdms.customerservice.entity.Lead;
import com.evdms.customerservice.entity.enums.LeadStatus;
import com.evdms.customerservice.dto.UpdateStatusRequest;
import com.evdms.customerservice.service.AuthUtil;
import com.evdms.customerservice.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {
    private final LeadService service;

    public LeadController(LeadService service) {
        this.service = service;
    }

    // Public endpoint (website form)
    @PostMapping
    public ResponseEntity<Lead> create(@Valid @RequestBody LeadCreateRequest request) {
        // Map DTO to entity
        Lead lead = Lead.builder()
                .name(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .interestedModels(request.getInterestedVehicleModel())
                .source(request.getSource())
                .notes(request.getNotes())
                .dealerId(AuthUtil.getCurrentDealerId()) // May be null for public/USER
                .build();

        Lead saved = service.create(lead);
        return ResponseEntity.created(URI.create("/api/v1/leads/" + saved.getId())).body(saved);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public Page<Lead> list(@RequestParam(required = false) UUID dealerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        // Use dealerId from JWT if not provided
        UUID contextDealerId = dealerId != null ? dealerId : AuthUtil.getCurrentDealerId();
        return service.list(contextDealerId, page, size);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public Lead get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public Lead update(@PathVariable UUID id, @RequestBody Lead patch) {
        return service.update(id, patch);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public Lead updateStatus(@PathVariable UUID id, @RequestBody UpdateStatusRequest request) {
        LeadStatus status = LeadStatus.valueOf(request.getStatus().toUpperCase());
        return service.updateStatus(id, status);
    }

    @PostMapping("/{id}/convert")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public Customer convert(@PathVariable UUID id) {
        return service.convert(id);
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER')")
    public Lead assign(@PathVariable UUID id, @RequestParam UUID staffId) {
        return service.assign(id, staffId);
    }
}
