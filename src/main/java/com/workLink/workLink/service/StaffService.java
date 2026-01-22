package com.workLink.workLink.service;

import com.workLink.workLink.dto.StaffCreateDTO;
import com.workLink.workLink.dto.StaffResponseDTO;
import com.workLink.workLink.entity.Staff;
import com.workLink.workLink.repository.StaffRepository;
import org.springframework.stereotype.Service;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    // ✅ Register new staff
    public StaffResponseDTO registerStaff(StaffCreateDTO dto) {

        Staff staff = new Staff();
        staff.setName(dto.getName());
        staff.setEmail(dto.getEmail());
        staff.setPhone(dto.getPhone());
        staff.setSkills(dto.getSkills());

        // ✅ Default values
        staff.setVerificationStatus("NOT_VERIFIED");
        staff.setAvailabilityStatus("AVAILABLE");

        Staff savedStaff = staffRepository.save(staff);

        return mapToResponseDTO(savedStaff);
    }

    // ✅ Get staff by ID
    public StaffResponseDTO getStaffById(Long staffId) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + staffId));

        return mapToResponseDTO(staff);
    }

    // ✅ Helper method: Entity → DTO
    private StaffResponseDTO mapToResponseDTO(Staff staff) {

        StaffResponseDTO response = new StaffResponseDTO();
        response.setStaffId(staff.getStaffId());
        response.setName(staff.getName());
        response.setEmail(staff.getEmail());
        response.setPhone(staff.getPhone());
        response.setSkills(staff.getSkills());
        response.setVerificationStatus(staff.getVerificationStatus());
        response.setAvailabilityStatus(staff.getAvailabilityStatus());

        return response;
    }
}

