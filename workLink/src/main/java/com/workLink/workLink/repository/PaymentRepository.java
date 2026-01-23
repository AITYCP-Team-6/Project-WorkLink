package com.workLink.workLink.repository;

import com.workLink.workLink.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // ✅ Staff ka payment history
    List<Payment> findByStaffStaffId(Long staffId);
}
