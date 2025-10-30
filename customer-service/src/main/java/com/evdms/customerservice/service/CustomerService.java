package com.evdms.customerservice.service;

import com.evdms.customerservice.domain.entity.Customer;
import com.evdms.customerservice.domain.entity.CustomerInteraction;
import com.evdms.customerservice.domain.enums.CustomerStatus;
import com.evdms.customerservice.domain.enums.InteractionType;
import com.evdms.customerservice.messaging.EventPublisher;
import com.evdms.customerservice.repository.CustomerInteractionRepository;
import com.evdms.customerservice.repository.CustomerRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class CustomerService {
    private final CustomerRepository customers;
    private final CustomerInteractionRepository interactions;
    private final EventPublisher events;

    public CustomerService(CustomerRepository customers, CustomerInteractionRepository interactions,
            EventPublisher events) {
        this.customers = customers;
        this.interactions = interactions;
        this.events = events;
    }

    public Customer create(@Valid Customer c) {
        customers.findByDealerIdAndPhone(c.getDealerId(), c.getPhone()).ifPresent(existing -> {
            throw new IllegalArgumentException("Phone already exists for this dealer");
        });
        Customer saved = customers.save(c);
        events.publish("customer.created", Map.of(
                "customer_id", saved.getId().toString(),
                "dealer_id", saved.getDealerId().toString(),
                "full_name", saved.getFullName(),
                "phone", saved.getPhone(),
                "email", Optional.ofNullable(saved.getEmail()).orElse("")));
        return saved;
    }

    public Page<Customer> list(UUID dealerId, UUID assignedStaffId, int page, int size, Optional<String> name,
            Optional<CustomerStatus> status) {
        Pageable pageable = PageRequest.of(page, size);
        
        // Filter by assigned staff if provided (for DEALER_STAFF role)
        if (assignedStaffId != null) {
            if (name.isPresent()) {
                return customers.findByAssignedStaffIdAndFullNameContainingIgnoreCaseAndDeletedFalse(assignedStaffId, name.get(), pageable);
            }
            return customers.findByAssignedStaffIdAndDeletedFalse(assignedStaffId, pageable);
        }
        
        // Admin sees all (no dealer filter)
        if (dealerId == null) {
            if (name.isPresent()) {
                return customers.findByFullNameContainingIgnoreCaseAndDeletedFalse(name.get(), pageable);
            }
            if (status.isPresent()) {
                return customers.findByStatusAndDeletedFalse(status.get(), pageable);
            }
            return customers.findAllByDeletedFalse(pageable);
        }
        
        // Dealer Manager sees dealer scope
        if (name.isPresent()) {
            return customers.findByDealerIdAndFullNameContainingIgnoreCaseAndDeletedFalse(dealerId, name.get(), pageable);
        }
        if (status.isPresent()) {
            return customers.findByDealerIdAndStatusAndDeletedFalse(dealerId, status.get(), pageable);
        }
        return customers.findAllByDealerIdAndDeletedFalse(dealerId, pageable);
    }
    
    public Page<Customer> searchMulti(UUID dealerId, UUID assignedStaffId, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String searchPattern = "%" + query.toLowerCase() + "%";
        
        if (assignedStaffId != null) {
            // Staff sees only assigned customers
            return customers.findByAssignedStaffIdAndSearchAndDeletedFalse(assignedStaffId, searchPattern, pageable);
        }
        if (dealerId != null) {
            // Manager sees dealer customers
            return customers.findByDealerIdAndSearchAndDeletedFalse(dealerId, searchPattern, pageable);
        }
        // Admin sees all
        return customers.findBySearchAndDeletedFalse(searchPattern, pageable);
    }

    public Customer get(UUID id) {
        return customers.findById(id).orElseThrow(() -> new EntityNotFoundException("Customer not found"));
    }

    public Customer update(UUID id, Customer patch) {
        Customer c = get(id);
        // Basic patching
        if (patch.getFullName() != null)
            c.setFullName(patch.getFullName());
        if (patch.getPhone() != null)
            c.setPhone(patch.getPhone());
        if (patch.getEmail() != null)
            c.setEmail(patch.getEmail());
        if (patch.getIdentityNumber() != null)
            c.setIdentityNumber(patch.getIdentityNumber());
        if (patch.getDateOfBirth() != null)
            c.setDateOfBirth(patch.getDateOfBirth());
        if (patch.getGender() != null)
            c.setGender(patch.getGender());
        if (patch.getAddress() != null)
            c.setAddress(patch.getAddress());
        if (patch.getCity() != null)
            c.setCity(patch.getCity());
        if (patch.getDistrict() != null)
            c.setDistrict(patch.getDistrict());
        if (patch.getWard() != null)
            c.setWard(patch.getWard());
        if (patch.getCustomerType() != null)
            c.setCustomerType(patch.getCustomerType());
        if (patch.getTaxCode() != null)
            c.setTaxCode(patch.getTaxCode());
        if (patch.getSource() != null)
            c.setSource(patch.getSource());
        if (patch.getStatus() != null)
            c.setStatus(patch.getStatus());
        if (patch.getTags() != null)
            c.setTags(patch.getTags());
        if (patch.getAssignedStaffId() != null)
            c.setAssignedStaffId(patch.getAssignedStaffId());
        return customers.save(c);
    }

    public void softDelete(UUID id) {
        Customer c = get(id);
        c.setDeleted(true);
        c.setStatus(CustomerStatus.INACTIVE);
        customers.save(c);
    }

    public List<CustomerInteraction> history(UUID customerId) {
        return interactions.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public CustomerInteraction addNote(UUID customerId, UUID staffId, String notes) {
        CustomerInteraction ci = CustomerInteraction.builder()
                .customerId(customerId)
                .staffId(staffId)
                .type(InteractionType.NOTE)
                .notes(notes)
                .build();
        return interactions.save(ci);
    }
}
