package com.workLink.workLink.test;

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
