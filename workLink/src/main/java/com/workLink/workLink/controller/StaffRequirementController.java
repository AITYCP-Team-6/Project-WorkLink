package com.workLink.workLink.controller;

import com.workLink.workLink.dto.StaffRequirementCreateDTO;
import com.workLink.workLink.entity.StaffRequirementApplication;
import com.workLink.workLink.service.StaffRequirementService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/requirements")
public class StaffRequirementController {

    private final StaffRequirementService requirementService;

    public StaffRequirementController(StaffRequirementService requirementService) {
        this.requirementService = requirementService;
    }

    // ✅ POST API to create a new requirement
    @PostMapping
    public StaffRequirementApplication createRequirement(@RequestBody StaffRequirementCreateDTO dto) {
        return requirementService.createRequirement(dto);
    }
 // ✅ GET ALL requirements
    @GetMapping
    public List<StaffRequirementApplication> getAllRequirements() {
        return requirementService.getAllRequirements();
    }

    // ✅ GET requirement by ID
    @GetMapping("/{id}")
    public StaffRequirementApplication getRequirementById(@PathVariable Long id) {
        return requirementService.getRequirementById(id);
    }
}
