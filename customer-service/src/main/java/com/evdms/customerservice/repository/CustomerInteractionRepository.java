package com.evdms.customerservice.repository;

import com.evdms.customerservice.entity.CustomerInteraction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CustomerInteractionRepository extends JpaRepository<CustomerInteraction, UUID> {
    List<CustomerInteraction> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
}
