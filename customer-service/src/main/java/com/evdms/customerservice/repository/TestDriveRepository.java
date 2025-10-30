package com.evdms.customerservice.repository;

import com.evdms.customerservice.domain.entity.TestDrive;
import com.evdms.customerservice.domain.enums.TestDriveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TestDriveRepository extends JpaRepository<TestDrive, UUID> {
    List<TestDrive> findByDealerIdAndScheduledDateBetween(UUID dealerId, LocalDate start, LocalDate end);

    List<TestDrive> findByScheduledDate(LocalDate date);

    List<TestDrive> findByDealerIdAndStatus(UUID dealerId, TestDriveStatus status);
}