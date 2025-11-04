package com.evdms.customerservice.entity;

import com.evdms.customerservice.entity.enums.LeadStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "leads", indexes = {
        @Index(name = "idx_leads_dealer", columnList = "dealer_id"),
        @Index(name = "idx_leads_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lead {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "dealer_id", nullable = true)
    private UUID dealerId;

    @Column(name = "assigned_staff_id")
    private UUID assignedStaffId;

    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    @Email
    private String email;

    @Column(name = "interested_models")
    private String interestedModels; // comma separated

    private String source;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LeadStatus status = LeadStatus.NEW;

    @Column(columnDefinition = "text")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "converted_at")
    private Instant convertedAt;

    @Column(name = "customer_id")
    private UUID customerId;
}
