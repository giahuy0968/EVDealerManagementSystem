package com.evdms.authservice.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String refreshToken;

    @Column(columnDefinition = "jsonb")
    private String deviceInfo;

    private String ipAddress;
    private Instant expiresAt;
    private Instant createdAt;

    // getters and setters
    // ...
}
