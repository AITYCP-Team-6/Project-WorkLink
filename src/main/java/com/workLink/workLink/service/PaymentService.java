package com.workLink.workLink.service;

import com.workLink.workLink.dto.PaymentCreateDTO;
import com.workLink.workLink.dto.PaymentResponseDTO;
import com.workLink.workLink.entity.JobPosting;
import com.workLink.workLink.entity.Payment;
import com.workLink.workLink.entity.Staff;
import com.workLink.workLink.repository.JobPostingRepository;
import com.workLink.workLink.repository.PaymentRepository;
import com.workLink.workLink.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final StaffRepository staffRepository;
    private final JobPostingRepository jobPostingRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          StaffRepository staffRepository,
                          JobPostingRepository jobPostingRepository) {
        this.paymentRepository = paymentRepository;
        this.staffRepository = staffRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    // ✅ Create payment record (admin)
    public PaymentResponseDTO createPayment(PaymentCreateDTO dto) {

        Staff staff = staffRepository.findById(dto.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + dto.getStaffId()));

        JobPosting jobPosting = jobPostingRepository.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + dto.getJobId()));

        Payment payment = new Payment();
        payment.setStaff(staff);
        payment.setJobPosting(jobPosting);
        payment.setAmount(dto.getAmount());
        payment.setPaymentDate(dto.getPaymentDate());
        payment.setPaymentStatus("PAID"); // default (you can keep PENDING if needed)

        Payment saved = paymentRepository.save(payment);

        return mapToResponseDTO(saved);
    }

    // ✅ Get payments by staffId
    public List<PaymentResponseDTO> getPaymentsByStaffId(Long staffId) {
        return paymentRepository.findByStaffStaffId(staffId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ✅ Helper: Entity → ResponseDTO
    private PaymentResponseDTO mapToResponseDTO(Payment payment) {

        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setPaymentId(payment.getPaymentId());
        response.setAmount(payment.getAmount());
        response.setPaymentDate(payment.getPaymentDate());
        response.setPaymentStatus(payment.getPaymentStatus());

        if (payment.getStaff() != null) {
            response.setStaffId(payment.getStaff().getStaffId());
        }

        if (payment.getJobPosting() != null) {
            response.setJobId(payment.getJobPosting().getJobId());
        }

        return response;
    }
}
