package com.workLink.workLink.service;

import com.workLink.workLink.dto.StaffRequirementCreateDTO;
import com.workLink.workLink.entity.StaffRequirementApplication;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.repository.StaffRequirementApplicationRepository;
import com.workLink.workLink.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StaffRequirementService {

    private final StaffRequirementApplicationRepository requirementRepo;
    private final UserRepository userRepo;

    public StaffRequirementService(StaffRequirementApplicationRepository requirementRepo, UserRepository userRepo) {
        this.requirementRepo = requirementRepo;
        this.userRepo = userRepo;
    }

    public StaffRequirementApplication createRequirement(StaffRequirementCreateDTO dto) {

        // ✅ Find user by ID
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));

        // ✅ Create entity object
        StaffRequirementApplication req = new StaffRequirementApplication();
        req.setEventName(dto.getEventName());
        req.setEventType(dto.getEventType());
        req.setEventDate(dto.getEventDate());
        req.setRequiredStaff(dto.getRequiredStaff());
        req.setLocation(dto.getLocation());

        // ✅ Default status when user creates requirement
        req.setStatus("PENDING");

        // ✅ Set which user created this requirement
        req.setUser(user);

        // ✅ Save in DB
        return requirementRepo.save(req);
    }

    public List<StaffRequirementApplication> getAllRequirements() {
        return requirementRepo.findAll();
    }

    public StaffRequirementApplication getRequirementById(Long id) {
        return requirementRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Requirement not found with ID: " + id));
    }

}

