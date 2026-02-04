package com.workLink.workLink.test;

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
}
