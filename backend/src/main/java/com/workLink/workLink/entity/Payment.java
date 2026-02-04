package com.workLink.workLink.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    @NotNull
    private Event event;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;
    
    @NotNull
    @Column(nullable = false)
    private Double amount;
    
    @NotNull
    @Column(nullable = false)
    private Double hoursWorked;
    
    @NotNull
    @Column(nullable = false)
    private Double hourlyRate;
    
    @Column(nullable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod = PaymentMethod.BANK_TRANSFER;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Column(unique = true)
    private String transactionId;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @ManyToOne
    @JoinColumn(name = "processed_by")
    private User processedBy;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum PaymentMethod {
        CASH, BANK_TRANSFER, CHECK, PAYPAL, OTHER
    }
    
    public enum PaymentStatus {
        PENDING, PROCESSING, COMPLETED, FAILED
    }
    
    @PrePersist
    @PreUpdate
    public void calculateAmount() {
        if (hoursWorked != null && hourlyRate != null) {
            this.amount = hoursWorked * hourlyRate;
        }
        if (transactionId == null) {
            this.transactionId = "TXN" + System.currentTimeMillis();
        }
    }
}
