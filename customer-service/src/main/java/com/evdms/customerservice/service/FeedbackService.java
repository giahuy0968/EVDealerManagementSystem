package com.evdms.customerservice.service;

import com.evdms.customerservice.entity.Feedback;
import com.evdms.customerservice.service.EventPublisher;
import com.evdms.customerservice.repository.FeedbackRepository;
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
    private final EventPublisher events;

    public FeedbackService(FeedbackRepository feedbacks, EventPublisher events) {
        this.feedbacks = feedbacks;
        this.events = events;
    }

    public Feedback create(Feedback f) {
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
