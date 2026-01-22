package com.workLink.workLink.controller;

import com.workLink.workLink.dto.AdminCreateDTO;
import com.workLink.workLink.dto.AdminResponseDTO;
import com.workLink.workLink.service.AdminService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admins")  // ✅ Base URL for admin APIs
public class AdminController {

    private final AdminService adminService;

    // ✅ Constructor injection
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ✅ POST API: Create/Register Admin
    @PostMapping
    public AdminResponseDTO createAdmin(@RequestBody AdminCreateDTO dto) {
        return adminService.createAdmin(dto);
    }

    // ✅ GET API: Get Admin by ID
    @GetMapping("/{id}")
    public AdminResponseDTO getAdminById(@PathVariable("id") Long adminId) {
        return adminService.getAdminById(adminId);
    }
}
