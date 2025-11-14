package com.evdms.customerservice.service;

import com.evdms.customerservice.entity.Feedback;
import com.evdms.customerservice.entity.Customer;
import com.evdms.customerservice.service.EventPublisher;
import com.evdms.customerservice.repository.FeedbackRepository;
import com.evdms.customerservice.repository.CustomerRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class FeedbackService {
    private final FeedbackRepository feedbacks;
    private final CustomerRepository customers;
    private final EventPublisher events;

    public FeedbackService(FeedbackRepository feedbacks, CustomerRepository customers, EventPublisher events) {
        this.feedbacks = feedbacks;
        this.customers = customers;
        this.events = events;
    }

    public Feedback create(Feedback f) {
        // Use default IDs if not provided
        if (f.getCustomerId() == null) {
            f.setCustomerId(UUID.fromString("00000000-0000-0000-0000-000000000002"));
        }

        // Get dealerId from customer or context
        if (f.getDealerId() == null) {
            if (f.getCustomerId() != null) {
                // Try to get dealerId from customer
                Customer customer = customers.findById(f.getCustomerId()).orElse(null);
                if (customer != null && customer.getDealerId() != null) {
                    f.setDealerId(customer.getDealerId());
                }
            }
            // If still null, use default test dealer ID
            if (f.getDealerId() == null) {
                f.setDealerId(UUID.fromString("00000000-0000-0000-0000-000000000001"));
            }
        }

        Feedback saved = feedbacks.save(f);
        events.publish("feedback.received", Map.of(
                "feedback_id", saved.getId().toString(),
                "dealer_id", saved.getDealerId().toString(),
                "customer_id", saved.getCustomerId().toString(),
                "rating", saved.getRating()));
        return saved;
    }

    public List<Feedback> list() {
        return feedbacks.findAll();
    }

    public Feedback get(UUID id) {
        return feedbacks.findById(id).orElseThrow(() -> new EntityNotFoundException("Feedback not found"));
    }

    public Feedback resolve(UUID id, UUID resolverId, String response) {
        Feedback f = get(id);
        f.setResolved(true);
        f.setResolvedBy(resolverId);
        f.setResolvedAt(Instant.now());
        f.setResponse(response);
        return feedbacks.save(f);
    }
}
