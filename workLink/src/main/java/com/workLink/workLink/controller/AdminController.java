package com.workLink.workLink.controller;

import com.workLink.workLink.dto.AdminCreateDTO;
import com.workLink.workLink.dto.AdminResponseDTO;
import com.workLink.workLink.service.AdminService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;
import com.workLink.workLink.dto.AdminLoginDTO;

@RestController
@RequestMapping("/admins")  // ✅ Base URL for admin APIs
public class AdminController {

    private final AdminService adminService;

    // ✅ Constructor injection
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ✅ POST API: Create/Register Admin
    @PostMapping("/login")
    public String loginAdmin(@RequestBody AdminLoginDTO dto) {
        return adminService.loginAdmin(dto);
    }


    // ✅ GET API: Get Admin by ID
    @GetMapping("/{id}")
    public AdminResponseDTO getAdminById(@PathVariable("id") Long adminId) {
        return adminService.getAdminById(adminId);
    }
    
    // ✅ GET API: Fetch all admins
    @GetMapping
    public List<AdminResponseDTO> getAllAdmins() {
        return adminService.getAllAdmins();
    }
}
