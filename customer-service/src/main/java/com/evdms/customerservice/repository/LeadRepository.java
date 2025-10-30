package com.evdms.customerservice.repository;

import com.evdms.customerservice.domain.entity.Lead;
import com.evdms.customerservice.domain.enums.LeadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface LeadRepository extends JpaRepository<Lead, UUID> {
    Page<Lead> findAllByDealerId(UUID dealerId, Pageable pageable);

    Page<Lead> findAllByStatus(LeadStatus status, Pageable pageable);

    List<Lead> findByStatusAndCreatedAtBefore(LeadStatus status, Instant before);
}