package com.evdms.customerservice.domain.entity;

import com.evdms.customerservice.domain.enums.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "customers", uniqueConstraints = {
        @UniqueConstraint(name = "uq_customer_phone_per_dealer", columnNames = { "dealer_id", "phone" })
}, indexes = {
        @Index(name = "idx_customers_dealer", columnList = "dealer_id"),
        @Index(name = "idx_customers_name", columnList = "full_name")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "dealer_id", nullable = false)
    private UUID dealerId;

    @Column(name = "assigned_staff_id")
    private UUID assignedStaffId;

    @NotBlank
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotBlank
    @Pattern(regexp = "0[1-9][0-9]{8}")
    @Column(name = "phone", nullable = false)
    private String phone;

    @Email
    @Column(name = "email")
    private String email;

    @Pattern(regexp = "\\d{12}", message = "CCCD must be 12 digits")
    @Column(name = "identity_number")
    private String identityNumber;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(columnDefinition = "text")
    private String address;

    private String city;
    private String district;
    private String ward;

    @Enumerated(EnumType.STRING)
    @Column(name = "customer_type")
    private CustomerType customerType;

    @Column(name = "tax_code")
    private String taxCode;

    @Enumerated(EnumType.STRING)
    private Source source;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CustomerStatus status = CustomerStatus.NEW;

    @Column(name = "tags")
    private String tags; // comma-separated tags

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted", nullable = false)
    @Builder.Default
    private boolean deleted = false;
}
