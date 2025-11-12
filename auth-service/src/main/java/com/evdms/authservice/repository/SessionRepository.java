package com.evdms.authservice.repository;

import com.evdms.authservice.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {
    Optional<Session> findByRefreshToken(String refreshToken);

    void deleteByUserId(UUID userId);

    List<Session> findByUserId(UUID userId);
}
