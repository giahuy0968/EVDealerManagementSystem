package com.evdms.customerservice.domain.entity;

import com.evdms.customerservice.domain.enums.TestDriveStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "test_drives")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestDrive {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(name = "dealer_id", nullable = false)
    private UUID dealerId;

    @Column(name = "car_model_id", nullable = false)
    private UUID carModelId;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "scheduled_time", nullable = false)
    private LocalTime scheduledTime;

    @Column(name = "staff_id")
    private UUID staffId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TestDriveStatus status = TestDriveStatus.SCHEDULED;

    @Column(columnDefinition = "text")
    private String notes;

    @Column(columnDefinition = "text")
    private String feedback;

    private Integer rating; // 1-5

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
