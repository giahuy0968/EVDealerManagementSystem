package com.evdms.customerservice.repository;

import com.evdms.customerservice.domain.entity.Customer;
import com.evdms.customerservice.domain.enums.CustomerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    Optional<Customer> findByDealerIdAndPhone(UUID dealerId, String phone);

    Page<Customer> findAllByDealerIdAndDeletedFalse(UUID dealerId, Pageable pageable);

    Page<Customer> findAllByDeletedFalse(Pageable pageable);

    Page<Customer> findByDealerIdAndFullNameContainingIgnoreCaseAndDeletedFalse(UUID dealerId, String name,
            Pageable pageable);

    Page<Customer> findByFullNameContainingIgnoreCaseAndDeletedFalse(String name, Pageable pageable);

    Page<Customer> findByDealerIdAndStatusAndDeletedFalse(UUID dealerId, CustomerStatus status, Pageable pageable);
    
    Page<Customer> findByStatusAndDeletedFalse(CustomerStatus status, Pageable pageable);
    
    Page<Customer> findByAssignedStaffIdAndDeletedFalse(UUID assignedStaffId, Pageable pageable);
    
    Page<Customer> findByAssignedStaffIdAndFullNameContainingIgnoreCaseAndDeletedFalse(UUID assignedStaffId, String name, Pageable pageable);
    
    // Search by phone, email or name
    @Query("SELECT c FROM Customer c WHERE c.assignedStaffId = :staffId AND c.deleted = false AND " +
           "(LOWER(c.fullName) LIKE :pattern OR LOWER(c.phone) LIKE :pattern OR LOWER(c.email) LIKE :pattern)")
    Page<Customer> findByAssignedStaffIdAndSearchAndDeletedFalse(@Param("staffId") UUID staffId, @Param("pattern") String pattern, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE c.dealerId = :dealerId AND c.deleted = false AND " +
           "(LOWER(c.fullName) LIKE :pattern OR LOWER(c.phone) LIKE :pattern OR LOWER(c.email) LIKE :pattern)")
    Page<Customer> findByDealerIdAndSearchAndDeletedFalse(@Param("dealerId") UUID dealerId, @Param("pattern") String pattern, Pageable pageable);
    
    @Query("SELECT c FROM Customer c WHERE c.deleted = false AND " +
           "(LOWER(c.fullName) LIKE :pattern OR LOWER(c.phone) LIKE :pattern OR LOWER(c.email) LIKE :pattern)")
    Page<Customer> findBySearchAndDeletedFalse(@Param("pattern") String pattern, Pageable pageable);
}
