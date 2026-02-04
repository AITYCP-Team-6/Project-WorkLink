package com.workLink.workLink.dto;

import com.workLink.workLink.entity.Payment.PaymentMethod;
import lombok.Data;

@Data
public class PaymentDTO {

    private Long eventId;
    private Long userId;

    private Double hoursWorked;
    private Double hourlyRate;

    private PaymentMethod paymentMethod;

    private String notes;
}
