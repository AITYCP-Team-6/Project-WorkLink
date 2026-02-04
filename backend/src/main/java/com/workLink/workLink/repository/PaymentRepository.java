package com.workLink.workLink.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.workLink.workLink.entity.Payment;
import com.workLink.workLink.entity.User;


@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // ✅ Find payments by user ID
    List<Payment> findByUser_Id(Long id);
    
    // ✅ Find payments by event ID
    List<Payment> findByEventId(Long eventId);
    
    // ✅ Find payments for events created by organization
    List<Payment> findByEventCreatedById(Long organizationId);
    
    // ✅ Find payments by organization and status
    @Query("SELECT p FROM Payment p WHERE p.event.createdBy.id = :organizationId AND p.status = :status")
    List<Payment> findByEventCreatedByIdAndStatus(
        @Param("organizationId") Long organizationId, 
        @Param("status") Payment.PaymentStatus status
    );
    
    // ✅ Find pending payments for completed events (optional utility)
    @Query("SELECT p FROM Payment p WHERE p.event.createdBy.id = :organizationId " +
           "AND p.status = 'PENDING' AND p.event.status = 'COMPLETED'")
    List<Payment> findPayablePaymentsByOrganization(@Param("organizationId") Long organizationId);
    
    // ✅ Find payments by status
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    // ✅ Find payments by transaction ID (for lookup)
    Payment findByTransactionId(String transactionId);
}