package com.workLink.workLink.controller;

import com.workLink.workLink.dto.ShiftAssignDTO;
import com.workLink.workLink.dto.ShiftAssignmentResponseDTO;
import com.workLink.workLink.service.ShiftAssignmentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shift-assignments")
public class ShiftAssignmentController {

    private final ShiftAssignmentService shiftService;

    public ShiftAssignmentController(ShiftAssignmentService shiftService) {
        this.shiftService = shiftService;
    }

    // ✅ POST: Assign shift
    @PostMapping
    public ShiftAssignmentResponseDTO assignShift(@RequestBody ShiftAssignDTO dto) {
        return shiftService.assignShift(dto);
    }
}
