package com.workLink.workLink.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentCalculationResponse {
    private Double totalHours;
    private Double hourlyRate;
    private Double amount;
    private Integer attendanceCount;
}
