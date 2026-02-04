/**
 * JOB APPLICATION CONTROLLER
 * Purpose: Manages the application workflow between Volunteers and Organizations.
 * This controller handles applying for events, listing applications, and the approval/rejection process.
 */

package com.workLink.workLink.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.workLink.workLink.dto.JobApplicationCreateDTO;
import com.workLink.workLink.dto.JobApplicationResponseDTO;
import com.workLink.workLink.entity.JobApplication;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.service.JobApplicationService;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationController {
    
    private final JobApplicationService jobApplicationService;
    
    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    /* ==========================================================
       1. VOLUNTEER ACTIONS (Staff/Volunteer Role)
       ========================================================== */

    /**
     * apply: Volunteer applies for a specific event.
     * @param eventId The ID of the event being applied for.
     * @param user The authenticated user fetched directly from the Security Context.
     */
    @PostMapping("/apply/{eventId}")
    public ResponseEntity<?> apply(
            @PathVariable Long eventId,
            @AuthenticationPrincipal User user) {
        // user.getId() ensures we use the secure session ID, not a user-provided ID.
        return ResponseEntity.ok(
            jobApplicationService.apply(eventId, user.getId())
        );
    }

    /**
     * volunteerApps: Fetches all applications submitted by the current volunteer.
     */
    @GetMapping("/volunteer")
    public List<JobApplication> volunteerApps(
            @AuthenticationPrincipal User user) {
        return jobApplicationService.getVolunteerApplications(user.getId());
    }

    /* ==========================================================
       2. ORGANIZATION ACTIONS (Manager/Organizer Role)
       ========================================================== */

    /**
     * orgApps: Organizations view all incoming applications for their hosted events.
     */
    @GetMapping("/organization")
    public List<JobApplication> orgApps(
            @AuthenticationPrincipal User user) {
        return jobApplicationService.getOrgApplications(user.getId());
    }

    /**
     * approveApplication: Organization accepts a volunteer for an event.
     * @param applicationId ID of the application to approve.
     * @param user Organizer's ID used to verify they own the event (Authorization check).
     */
    @PutMapping("/{applicationId}/approve")
    public ResponseEntity<?> approveApplication(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
            jobApplicationService.approveApplication(applicationId, user.getId())
        );
    }

    /**
     * rejectApplication: Organization declines a volunteer application.
     */
    @PutMapping("/{applicationId}/reject")
    public ResponseEntity<?> rejectApplication(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
            jobApplicationService.rejectApplication(applicationId, user.getId())
        );
    }

    /* ==========================================================
       3. ADMINISTRATIVE & BACKWARD COMPATIBILITY
       ========================================================== */

    /**
     * applyForJob: Legacy endpoint for backward compatibility with older frontend versions.
     */
    @PostMapping
    public JobApplicationResponseDTO applyForJob(@RequestBody JobApplicationCreateDTO dto) {
        return jobApplicationService.applyForJob(dto);
    }

    /**
     * getApplicationsByJobId: Fetch all applicants for a specific event (Admin View).
     */
    @GetMapping("/job/{jobId}")
    public List<JobApplicationResponseDTO> getApplicationsByJobId(@PathVariable Long jobId) {
        return jobApplicationService.getApplicationsByJobId(jobId);
    }
}