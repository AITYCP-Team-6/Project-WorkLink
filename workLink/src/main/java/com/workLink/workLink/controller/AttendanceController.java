package com.workLink.workLink.controller;

import com.workLink.workLink.dto.AttendanceCheckInDTO;
import com.workLink.workLink.dto.AttendanceResponseDTO;
import com.workLink.workLink.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // POST: Staff check-in attendance
    @PostMapping("/checkin")
    public AttendanceResponseDTO checkIn(@RequestBody AttendanceCheckInDTO dto) {
        return attendanceService.checkIn(dto);
    }
}
