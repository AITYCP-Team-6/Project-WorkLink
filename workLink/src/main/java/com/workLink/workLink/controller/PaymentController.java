package com.workLink.workLink.controller;

import com.workLink.workLink.dto.PaymentCreateDTO;
import com.workLink.workLink.dto.PaymentResponseDTO;
import com.workLink.workLink.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ✅ POST: Create payment (admin)
    @PostMapping
    public PaymentResponseDTO createPayment(@RequestBody PaymentCreateDTO dto) {
        return paymentService.createPayment(dto);
    }

    // ✅ GET: Staff payment history
    @GetMapping("/staff/{staffId}")
    public List<PaymentResponseDTO> getPaymentsByStaff(@PathVariable Long staffId) {
        return paymentService.getPaymentsByStaffId(staffId);
    }
}
