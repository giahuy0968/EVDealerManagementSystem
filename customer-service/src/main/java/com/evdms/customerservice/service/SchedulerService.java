package com.evdms.customerservice.service;

import com.evdms.customerservice.domain.entity.Lead;
import com.evdms.customerservice.domain.entity.TestDrive;
import com.evdms.customerservice.domain.enums.LeadStatus;
import com.evdms.customerservice.messaging.EventPublisher;
import com.evdms.customerservice.repository.LeadRepository;
import com.evdms.customerservice.repository.TestDriveRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class SchedulerService {
    private static final Logger log = LoggerFactory.getLogger(SchedulerService.class);

    private final LeadRepository leads;
    private final TestDriveRepository testDrives;
    private final EventPublisher events;

    public SchedulerService(LeadRepository leads, TestDriveRepository testDrives, EventPublisher events) {
        this.leads = leads;
        this.testDrives = testDrives;
        this.events = events;
    }

    // Run daily at 09:00 UTC
    @Scheduled(cron = "0 0 9 * * *")
    public void sendTestDriveReminders() {
        LocalDate tomorrow = LocalDate.now(ZoneOffset.UTC).plusDays(1);
        List<TestDrive> list = testDrives.findByScheduledDate(tomorrow);
        for (TestDrive td : list) {
            Map<String, Object> payload = new HashMap<>();
            payload.put("test_drive_id", td.getId().toString());
            payload.put("dealer_id", td.getDealerId().toString());
            payload.put("customer_id", td.getCustomerId().toString());
            events.publish("test_drive.reminder", payload);
        }
        log.info("Sent {} test drive reminders for {}", list.size(), tomorrow);
    }

    // Run daily at 02:00 UTC
    @Scheduled(cron = "0 0 2 * * *")
    public void autoMarkLeadsLostAfter30Days() {
        Instant threshold = Instant.now().minusSeconds(30L * 24 * 3600);
        // This is a simplistic example; in real case we'd track last interaction time
        List<Lead> stale = leads.findByStatusAndCreatedAtBefore(LeadStatus.NEW, threshold);
        for (Lead l : stale) {
            l.setStatus(LeadStatus.LOST);
            leads.save(l);
        }
        log.info("Auto-marked {} leads as LOST", stale.size());
    }
}
