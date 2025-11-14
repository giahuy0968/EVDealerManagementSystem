package com.evdms.customerservice.controller;

import com.evdms.customerservice.entity.Complaint;
import com.evdms.customerservice.service.ComplaintService;
import com.evdms.customerservice.dto.ResolveComplaintRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/complaints")
public class ComplaintController {
    private final ComplaintService service;

    public ComplaintController(ComplaintService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public ResponseEntity<Complaint> create(@Valid @RequestBody Complaint c) {
        Complaint saved = service.create(c);
        return ResponseEntity.created(URI.create("/api/v1/complaints/" + saved.getId())).body(saved);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER')")
    public List<Complaint> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER')")
    public Complaint get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER')")
    public Complaint resolve(@PathVariable UUID id, @RequestBody ResolveComplaintRequest request) {
        return service.resolve(id, request.getResolution());
    }
}
