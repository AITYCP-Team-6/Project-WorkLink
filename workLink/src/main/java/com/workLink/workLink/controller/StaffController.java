package com.workLink.workLink.controller;

import com.workLink.workLink.dto.StaffCreateDTO;
import com.workLink.workLink.dto.StaffLoginDTO;
import com.workLink.workLink.dto.StaffResponseDTO;
import com.workLink.workLink.dto.StaffUpdateDTO;
import com.workLink.workLink.dto.StaffVerifyDTO;
import com.workLink.workLink.service.StaffService;
import jakarta.validation.Valid;
import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }
    // ✅ GET: Get staff by ID
    @GetMapping("/{id}")
    public StaffResponseDTO getStaffById(@PathVariable("id") Long staffId) {
        return staffService.getStaffById(staffId);
    }
 // ✅ PUT: Update staff
    @PutMapping("/{id}")
    public StaffResponseDTO updateStaff(@PathVariable("id") Long staffId,
                                        @RequestBody StaffUpdateDTO dto) {
        return staffService.updateStaff(staffId, dto);
    }

    // ✅ DELETE: Delete staff
    @DeleteMapping("/{id}")
    public String deleteStaff(@PathVariable("id") Long staffId) {
        return staffService.deleteStaff(staffId);
    }
 // ✅ GET: Get all staff
    @GetMapping
    public List<StaffResponseDTO> getAllStaff() {
        return staffService.getAllStaff();
    }
    // ✅ POST: Register staff
    @PostMapping("/login")
    public String loginStaff(@RequestBody StaffLoginDTO dto) {
        return staffService.loginStaff(dto);
    }
    
}
