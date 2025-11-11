package com.evdms.customerservice.controller;

import com.evdms.customerservice.entity.Customer;
import com.evdms.customerservice.entity.CustomerInteraction;
import com.evdms.customerservice.entity.enums.CustomerStatus;
import com.evdms.customerservice.service.CustomerService;
import com.evdms.customerservice.service.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {
    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public ResponseEntity<Customer> create(@Valid @RequestBody Customer customer) {
        // Set dealerId from JWT context if not provided
        if (customer.getDealerId() == null) {
            customer.setDealerId(AuthUtil.getCurrentDealerId()); // May be null for USER role
        }
        Customer saved = service.create(customer);
        return ResponseEntity.created(URI.create("/api/v1/customers/" + saved.getId())).body(saved);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public Page<Customer> list(@RequestParam(required = false) UUID dealerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam Optional<String> name,
            @RequestParam Optional<CustomerStatus> status) {
        // Extract context from JWT
        UUID contextDealerId = AuthUtil.isAdmin() ? dealerId : AuthUtil.getCurrentDealerId();
        UUID assignedStaffId = AuthUtil.isDealerStaff() ? AuthUtil.getCurrentUserId() : null;

        return service.list(contextDealerId, assignedStaffId, page, size, name, status);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public Customer get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public Customer update(@PathVariable UUID id, @RequestBody Customer patch) {
        return service.update(id, patch);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','USER')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public Page<Customer> search(@RequestParam(required = false) UUID dealerId,
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        // Extract context from JWT
        UUID contextDealerId = AuthUtil.isAdmin() ? dealerId : AuthUtil.getCurrentDealerId();
        UUID assignedStaffId = AuthUtil.isDealerStaff() ? AuthUtil.getCurrentUserId() : null;

        return service.searchMulti(contextDealerId, assignedStaffId, q, page, size);
    }

    @GetMapping("/{id}/history")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public List<CustomerInteraction> history(@PathVariable UUID id) {
        return service.history(id);
    }

    @PostMapping("/{id}/notes")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public CustomerInteraction addNote(@PathVariable UUID id, @RequestBody(required = false) String notes) {
        UUID staffId = AuthUtil.getCurrentUserId();
        // Ensure staffId is not null
        if (staffId == null) {
            throw new IllegalStateException("Unable to get user ID from JWT token");
        }
        return service.addNote(id, staffId, notes != null ? notes : "");
    }

    @GetMapping("/{id}/orders")
    @PreAuthorize("hasAnyAuthority('ADMIN','DEALER_MANAGER','DEALER_STAFF','USER')")
    public ResponseEntity<?> orders(@PathVariable UUID id) {
        return ResponseEntity.status(501).body("Orders API is handled by Order Service");
    }
}
