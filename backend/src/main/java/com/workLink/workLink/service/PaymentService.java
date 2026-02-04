package com.workLink.workLink.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;

import com.workLink.workLink.dto.PaymentDTO;
import com.workLink.workLink.entity.Event;
import com.workLink.workLink.entity.Payment;
import com.workLink.workLink.entity.Staff;
import com.workLink.workLink.entity.Payment.PaymentStatus;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.repository.EventRepository;
import com.workLink.workLink.repository.PaymentRepository;
import com.workLink.workLink.repository.StaffRepository;
import com.workLink.workLink.repository.UserRepository;

@Service
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final EventRepository eventRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    
    public PaymentService(PaymentRepository paymentRepository,
                         EventRepository eventRepository,
                         StaffRepository staffRepository,
                         UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.eventRepository = eventRepository;
        this.staffRepository = staffRepository;
        this.userRepository = userRepository;
    }
    
    // ================= GET =================
    // ✅ Get all payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    // ✅ Get payment by ID
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));
    }
    
    // ✅ Get payments by staff ID
    public List<Payment> getPaymentsByStaff(Long id) {
        return paymentRepository.findByUser_Id(id);
    }
    
    // ✅ Get payments for organization's events
    public List<Payment> getPaymentsByOrganization(Long organizationId) {
        return paymentRepository.findByEventCreatedById(organizationId);
    }
    
    // ================= CREATE =================
    // ✅ Create payment
//    public Payment createPayment(PaymentDTO paymentDTO, Long organizationId) {
//        
//        Event event = eventRepository.findById(paymentDTO.getEventId())
//            .orElseThrow(() -> new RuntimeException("Event not found"));
//        
//        // Verify organization owns the event
//        if (!event.getCreatedBy().getId().equals(organizationId)) {
//            throw new RuntimeException("You are not authorized to create payment for this event");
//        }
//        
//        User user = userRepository.findById(paymentDTO.getUserId())
//            .orElseThrow(() -> new RuntimeException("Staff not found"));
//        
//        Payment payment = new Payment();
//        payment.setEvent(event);
//        payment.setUser(user);
//        payment.setHoursWorked(paymentDTO.getHoursWorked());
//        payment.setHourlyRate(paymentDTO.getHourlyRate());
//        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
//        payment.setStatus(Payment.PaymentStatus.PENDING);
//        payment.setNotes(paymentDTO.getNotes());
//        
//        return paymentRepository.save(payment);
//    }
    public Payment createPayment(PaymentDTO dto) {

        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        Payment payment = new Payment();
        payment.setEvent(event);
        payment.setUser(user);
        payment.setHoursWorked(dto.getHoursWorked());
        payment.setHourlyRate(dto.getHourlyRate());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setNotes(dto.getNotes());

        return paymentRepository.save(payment);
    }
    
    // ================= UPDATE =================
    public Payment updatePayment(Long id, PaymentDTO dto) {

        Payment payment = getPaymentById(id);

        payment.setHoursWorked(dto.getHoursWorked());
        payment.setHourlyRate(dto.getHourlyRate());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setNotes(dto.getNotes());

        return paymentRepository.save(payment);
    }
    public Payment updateStatus(Long id, Payment.PaymentStatus status) {

        Payment payment = getPaymentById(id);
        payment.setStatus(status);

        if (status == Payment.PaymentStatus.COMPLETED) {
            payment.setPaymentDate(LocalDateTime.now());
        }

        return paymentRepository.save(payment);
    }
    // ✅ Mark payment as PAID (called after Razorpay success)
    public Payment markPaymentAsPaid(Long paymentId, String transactionId, 
                                    String paymentDateStr, Long organizationId) {
        
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));
        
        // Verify organization owns the event
        if (payment.getEvent() == null || 
            payment.getEvent().getCreatedBy() == null ||
            !payment.getEvent().getCreatedBy().getId().equals(organizationId)) {
            throw new RuntimeException("You are not authorized to update this payment");
        }
        
        // Verify event is completed
//        if (!"COMPLETED".equals(payment.getEvent().getStatus())) {
//            throw new RuntimeException("Payment can only be processed for completed events");
//        }
        
        // Update payment status
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setTransactionId(transactionId);
        
        // Parse payment date
        if (paymentDateStr != null) {
            try {
                LocalDateTime paymentDate = LocalDateTime.parse(paymentDateStr, 
                    DateTimeFormatter.ISO_DATE_TIME);
                payment.setPaymentDate(paymentDate);
            } catch (Exception e) {
                payment.setPaymentDate(LocalDateTime.now());
            }
        } else {
            payment.setPaymentDate(LocalDateTime.now());
        }
        
        return paymentRepository.save(payment);
    }
    
    // ================= UPDATE =================
    // ✅ Delete payment
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
    
    
    // ✅ Get pending payments for an organization
    public List<Payment> getPendingPaymentsByOrganization(Long organizationId) {
        return paymentRepository.findByEventCreatedByIdAndStatus(organizationId, PaymentStatus.PENDING);
    }
    
    // ✅ Get paid payments for an organization
    public List<Payment> getPaidPaymentsByOrganization(Long organizationId) {
        return paymentRepository.findByEventCreatedByIdAndStatus(organizationId, PaymentStatus.COMPLETED);
    }
}