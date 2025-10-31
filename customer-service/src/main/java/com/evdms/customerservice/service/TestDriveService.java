package com.evdms.customerservice.service;

import com.evdms.customerservice.entity.TestDrive;
import com.evdms.customerservice.entity.enums.TestDriveStatus;
import com.evdms.customerservice.service.EventPublisher;
import com.evdms.customerservice.repository.TestDriveRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class TestDriveService {
    private final TestDriveRepository testDrives;
    private final EventPublisher events;

    public TestDriveService(TestDriveRepository testDrives, EventPublisher events) {
        this.testDrives = testDrives;
        this.events = events;
    }

    public TestDrive create(TestDrive td) {
        TestDrive saved = testDrives.save(td);
        Map<String, Object> payload = new HashMap<>();
        payload.put("test_drive_id", saved.getId().toString());
        payload.put("dealer_id", saved.getDealerId().toString());
        payload.put("customer_id", saved.getCustomerId().toString());
        events.publish("test_drive.scheduled", payload);
        return saved;
    }

    public List<TestDrive> list(UUID dealerId, LocalDate from, LocalDate to) {
        return testDrives.findByDealerIdAndScheduledDateBetween(dealerId, from, to);
    }

    public TestDrive get(UUID id) {
        return testDrives.findById(id).orElseThrow(() -> new EntityNotFoundException("Test drive not found"));
    }

    public TestDrive update(UUID id, TestDrive patch) {
        TestDrive td = get(id);
        if (patch.getScheduledDate() != null)
            td.setScheduledDate(patch.getScheduledDate());
        if (patch.getScheduledTime() != null)
            td.setScheduledTime(patch.getScheduledTime());
        if (patch.getNotes() != null)
            td.setNotes(patch.getNotes());
        if (patch.getStaffId() != null)
            td.setStaffId(patch.getStaffId());
        return testDrives.save(td);
    }

    public TestDrive updateStatus(UUID id, TestDriveStatus status) {
        TestDrive td = get(id);
        td.setStatus(status);
        return testDrives.save(td);
    }

    public TestDrive addFeedback(UUID id, String feedback, Integer rating) {
        TestDrive td = get(id);
        td.setFeedback(feedback);
        td.setRating(rating);
        return testDrives.save(td);
    }

    public List<TestDrive> calendar(LocalDate date) {
        return testDrives.findByScheduledDate(date);
    }
}
