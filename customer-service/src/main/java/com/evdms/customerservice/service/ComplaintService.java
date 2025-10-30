package com.evdms.customerservice.service;

import com.evdms.customerservice.domain.entity.Complaint;
import com.evdms.customerservice.domain.enums.ComplaintStatus;
import com.evdms.customerservice.messaging.EventPublisher;
import com.evdms.customerservice.repository.ComplaintRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class ComplaintService {
    private final ComplaintRepository complaints;
    private final EventPublisher events;

    public ComplaintService(ComplaintRepository complaints, EventPublisher events) {
        this.complaints = complaints;
        this.events = events;
    }

    public Complaint create(Complaint c) {
        Complaint saved = complaints.save(c);
        events.publish("complaint.created", Map.of(
                "complaint_id", saved.getId().toString(),
                "dealer_id", saved.getDealerId().toString(),
                "customer_id", saved.getCustomerId().toString()));
        return saved;
    }

    public List<Complaint> list() {
        return complaints.findAll();
    }

    public Complaint get(UUID id) {
        return complaints.findById(id).orElseThrow(() -> new EntityNotFoundException("Complaint not found"));
    }

    public Complaint resolve(UUID id, String resolution) {
        Complaint c = get(id);
        c.setStatus(ComplaintStatus.RESOLVED);
        c.setResolution(resolution);
        c.setResolvedAt(Instant.now());
        return complaints.save(c);
    }
}
