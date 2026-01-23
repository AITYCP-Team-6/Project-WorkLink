package com.workLink.workLink.service;

import com.workLink.workLink.dto.ShiftAssignDTO;
import com.workLink.workLink.dto.ShiftAssignmentResponseDTO;
import com.workLink.workLink.entity.JobApplication;
import com.workLink.workLink.entity.ShiftAssignment;
import com.workLink.workLink.repository.JobApplicationRepository;
import com.workLink.workLink.repository.ShiftAssignmentRepository;
import org.springframework.stereotype.Service;

@Service
public class ShiftAssignmentService {

    private final ShiftAssignmentRepository shiftRepo;
    private final JobApplicationRepository jobApplicationRepo;

    public ShiftAssignmentService(ShiftAssignmentRepository shiftRepo,
                                  JobApplicationRepository jobApplicationRepo) {
        this.shiftRepo = shiftRepo;
        this.jobApplicationRepo = jobApplicationRepo;
    }

    // ✅ Assign shift to a job application
    public ShiftAssignmentResponseDTO assignShift(ShiftAssignDTO dto) {

        JobApplication jobApplication = jobApplicationRepo.findById(dto.getJobApplicationId())
                .orElseThrow(() -> new RuntimeException("Job Application not found with ID: " + dto.getJobApplicationId()));

        // ✅ Optional check: shift only for approved applications
        if (!"APPROVED".equalsIgnoreCase(jobApplication.getApprovalStatus())) {
            throw new RuntimeException("Shift can be assigned only for APPROVED job applications!");
        }

        ShiftAssignment shift = new ShiftAssignment();
        shift.setShiftDate(dto.getShiftDate());
        shift.setShiftTime(dto.getShiftTime());
        shift.setAssignmentStatus("ASSIGNED");
        shift.setJobApplication(jobApplication);

        ShiftAssignment saved = shiftRepo.save(shift);

        return mapToResponseDTO(saved);
    }

    // ✅ Helper: Entity → Response DTO
    private ShiftAssignmentResponseDTO mapToResponseDTO(ShiftAssignment shift) {

        ShiftAssignmentResponseDTO response = new ShiftAssignmentResponseDTO();
        response.setShiftId(shift.getShiftId());
        response.setShiftDate(shift.getShiftDate());
        response.setShiftTime(shift.getShiftTime());
        response.setAssignmentStatus(shift.getAssignmentStatus());

        if (shift.getJobApplication() != null) {
            response.setJobApplicationId(shift.getJobApplication().getJobApplicationId());
        }

        return response;
    }
}
