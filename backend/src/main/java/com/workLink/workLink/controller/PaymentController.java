package com.workLink.workLink.controller;


import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workLink.workLink.dto.ApiResponse;
import com.workLink.workLink.dto.PaymentDTO;
import com.workLink.workLink.entity.Payment;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Payment> createPayment(@RequestBody PaymentDTO payment) {
        Payment created = paymentService.createPayment(payment);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Payment> updatePayment(
            @PathVariable Long id,
            @RequestBody PaymentDTO payment
    ) {
        Payment updated = paymentService.updatePayment(id, payment);
        return ResponseEntity.ok(updated);
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Payment> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        Payment.PaymentStatus status = Payment.PaymentStatus.valueOf(request.get("status"));
        Payment updated = paymentService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }
    
    @PutMapping("/{id}/mark-paid")
    public ResponseEntity<Payment> markPaymentAsPaid(
            @PathVariable Long id,
            @RequestBody MarkPaidRequest request,
            @AuthenticationPrincipal User user) {
        
        Payment updated = paymentService.markPaymentAsPaid(
            id, 
            request.getTransactionId(), 
            request.getPaymentDate(),
            user != null ? user.getId() : null
        );
        
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok(ApiResponse.success("Payment deleted successfully", null));
    }
    

    
 // DTO for mark-paid request
    public static class MarkPaidRequest {
        private String transactionId;
        private String paymentDate;
        private String status;
        
        public String getTransactionId() {
            return transactionId;
        }
        
        public void setTransactionId(String transactionId) {
            this.transactionId = transactionId;
        }
        
        public String getPaymentDate() {
            return paymentDate;
        }
        
        public void setPaymentDate(String paymentDate) {
            this.paymentDate = paymentDate;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
}