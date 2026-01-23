package com.workLink.workLink.service;

import com.workLink.workLink.dto.StaffCreateDTO;
import com.workLink.workLink.dto.StaffLoginDTO;
import com.workLink.workLink.dto.StaffResponseDTO;
import com.workLink.workLink.dto.StaffUpdateDTO;
import com.workLink.workLink.dto.StaffVerifyDTO;
import com.workLink.workLink.entity.Staff;
import com.workLink.workLink.repository.StaffRepository;

import java.util.List;

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
        staff.setPassword(dto.getPassword());

        // ✅ Default values
        staff.setVerificationStatus("NOT_VERIFIED");
        //staff.setAvailabilityStatus("AVAILABLE");

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
        //response.setAvailabilityStatus(staff.getAvailabilityStatus());

        return response;
    }
 // ✅ Update Staff
    public StaffResponseDTO updateStaff(Long staffId, StaffUpdateDTO dto) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + staffId));

        staff.setName(dto.getName());
        staff.setEmail(dto.getEmail());
        staff.setPhone(dto.getPhone());
        staff.setSkills(dto.getSkills());
        staff.setVerificationStatus(dto.getVerificationStatus());
        //staff.setAvailabilityStatus(dto.getAvailabilityStatus());

        Staff updatedStaff = staffRepository.save(staff);

        return mapToResponseDTO(updatedStaff);
    }

    // ✅ Delete Staff
    public String deleteStaff(Long staffId) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + staffId));

        staffRepository.delete(staff);

        return "Staff deleted successfully with ID: " + staffId;
    }
 // ✅ Get all staff
    public List<StaffResponseDTO> getAllStaff() {
        return staffRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }
    
    public StaffResponseDTO verifyStaff(Long staffId, StaffVerifyDTO dto) {

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + staffId));

        staff.setVerificationStatus(dto.getVerificationStatus());

        Staff updatedStaff = staffRepository.save(staff);

        return mapToResponseDTO(updatedStaff);
    }
    public String loginStaff(StaffLoginDTO dto) {

        Staff staff = staffRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!staff.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return "Staff login successful!";
    }

}

