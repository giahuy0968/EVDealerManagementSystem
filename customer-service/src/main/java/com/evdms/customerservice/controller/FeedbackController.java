package com.evdms.customerservice.controller;

import com.evdms.customerservice.entity.Feedback;
import com.evdms.customerservice.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/feedbacks")
public class FeedbackController {
    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF')")
    public ResponseEntity<Feedback> create(@Valid @RequestBody Feedback f) {
        Feedback saved = service.create(f);
        return ResponseEntity.created(URI.create("/api/v1/feedbacks/" + saved.getId())).body(saved);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF')")
    public List<Feedback> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF')")
    public Feedback get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER')")
    public Feedback resolve(@PathVariable UUID id, @RequestParam UUID resolvedBy, @RequestParam String response) {
        return service.resolve(id, resolvedBy, response);
    }
}
