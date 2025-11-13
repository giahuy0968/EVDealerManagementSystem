package com.evdms.customerservice.service;

import com.evdms.customerservice.entity.Customer;
import com.evdms.customerservice.entity.Lead;
import com.evdms.customerservice.entity.enums.LeadStatus;
import com.evdms.customerservice.service.EventPublisher;
import com.evdms.customerservice.repository.CustomerRepository;
import com.evdms.customerservice.repository.LeadRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class LeadService {
    private final LeadRepository leads;
    private final CustomerRepository customers;
    private final EventPublisher events;
    private final RoundRobinService roundRobin;

    public LeadService(LeadRepository leads, CustomerRepository customers, EventPublisher events,
            RoundRobinService roundRobin) {
        this.leads = leads;
        this.customers = customers;
        this.events = events;
        this.roundRobin = roundRobin;
    }

    public Lead create(Lead lead) {
        // Auto-assign round-robin if no staff assigned
        if (lead.getAssignedStaffId() == null && lead.getDealerId() != null) {
            UUID nextStaff = roundRobin.getNextStaff(lead.getDealerId());
            if (nextStaff != null) {
                lead.setAssignedStaffId(nextStaff);
            }
        }
        Lead saved = leads.save(lead);
        return saved;
    }

    public Page<Lead> list(UUID dealerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (dealerId == null) {
            // Return all leads (for USER role or admin without dealer filter)
            return leads.findAll(pageable);
        }
        return leads.findAllByDealerId(dealerId, pageable);
    }

    public Lead get(UUID id) {
        return leads.findById(id).orElseThrow(() -> new EntityNotFoundException("Lead not found"));
    }

    public Lead update(UUID id, Lead patch) {
        Lead l = get(id);
        if (patch.getName() != null)
            l.setName(patch.getName());
        if (patch.getPhone() != null)
            l.setPhone(patch.getPhone());
        if (patch.getEmail() != null)
            l.setEmail(patch.getEmail());
        if (patch.getInterestedModels() != null)
            l.setInterestedModels(patch.getInterestedModels());
        if (patch.getSource() != null)
            l.setSource(patch.getSource());
        if (patch.getNotes() != null)
            l.setNotes(patch.getNotes());
        if (patch.getAssignedStaffId() != null)
            l.setAssignedStaffId(patch.getAssignedStaffId());
        return leads.save(l);
    }

    public Lead updateStatus(UUID id, LeadStatus status) {
        Lead l = get(id);
        l.setStatus(status);
        return leads.save(l);
    }

    public Lead assign(UUID id, UUID staffId) {
        Lead l = get(id);
        l.setAssignedStaffId(staffId);
        return leads.save(l);
    }

    public Customer convert(UUID id) {
        Lead l = get(id);
        if (l.getCustomerId() != null) {
            return customers.findById(l.getCustomerId()).orElseThrow();
        }
        Customer c = Customer.builder()
                .dealerId(l.getDealerId())
                .fullName(Optional.ofNullable(l.getName()).orElse("Unknown"))
                .phone(l.getPhone())
                .email(l.getEmail())
                .source(null)
                .build();
        Customer saved = customers.save(c);
        l.setCustomerId(saved.getId());
        l.setStatus(LeadStatus.CONVERTED);
        l.setConvertedAt(Instant.now());
        leads.save(l);
        events.publish("lead.converted", Map.of(
                "lead_id", l.getId().toString(),
                "customer_id", saved.getId().toString(),
                "dealer_id", saved.getDealerId() != null ? saved.getDealerId().toString() : ""));
        return saved;
    }
}
