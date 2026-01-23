package com.workLink.workLink.service;

import com.workLink.workLink.dto.AdminCreateDTO;
import com.workLink.workLink.dto.AdminResponseDTO;
import com.workLink.workLink.entity.Admin;
import com.workLink.workLink.repository.AdminRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.workLink.workLink.dto.AdminLoginDTO;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    // ✅ Constructor injection
    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    // ✅ Register a new admin
    public AdminResponseDTO createAdmin(AdminCreateDTO dto) {

        // ✅ Convert DTO → Entity
        Admin admin = new Admin();
        admin.setName(dto.getName());
        admin.setEmail(dto.getEmail());
        admin.setPhone(dto.getPhone());
        admin.setPassword(dto.getPassword()); // ⚠️ later encrypt this

        // ✅ Save to DB
        Admin savedAdmin = adminRepository.save(admin);

        // ✅ Convert Entity → Response DTO
        return mapToResponseDTO(savedAdmin);
    }

    // ✅ Get admin by id
    public AdminResponseDTO getAdminById(Long adminId) {

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found with ID: " + adminId));

        return mapToResponseDTO(admin);
    }

    // ✅ Helper method to map Admin → AdminResponseDTO
    private AdminResponseDTO mapToResponseDTO(Admin admin) {

        AdminResponseDTO response = new AdminResponseDTO();
        response.setAdminId(admin.getAdminId());
        response.setName(admin.getName());
        response.setEmail(admin.getEmail());
        response.setPhone(admin.getPhone());

        return response;
    }
    
 // ✅ Fetch all admins
    public List<AdminResponseDTO> getAllAdmins() {

        return adminRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    public String loginAdmin(AdminLoginDTO dto) {

        Admin admin = adminRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!admin.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return "Admin login successful!";
    }

}
