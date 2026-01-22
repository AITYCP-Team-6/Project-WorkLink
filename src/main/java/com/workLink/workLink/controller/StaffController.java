package com.workLink.workLink.controller;

import com.workLink.workLink.dto.StaffCreateDTO;
import com.workLink.workLink.dto.StaffResponseDTO;
import com.workLink.workLink.service.StaffService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    // ✅ POST: Register staff
    @PostMapping
    public StaffResponseDTO registerStaff(@RequestBody StaffCreateDTO dto) {
        return staffService.registerStaff(dto);
    }

    // ✅ GET: Get staff by ID
    @GetMapping("/{id}")
    public StaffResponseDTO getStaffById(@PathVariable("id") Long staffId) {
        return staffService.getStaffById(staffId);
    }
}
