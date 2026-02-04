package com.workLink.workLink.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.workLink.workLink.dto.JobApplicationCreateDTO;
import com.workLink.workLink.dto.JobApplicationResponseDTO;
import com.workLink.workLink.entity.Event;
import com.workLink.workLink.entity.JobApplication;
import com.workLink.workLink.entity.Staff;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.repository.EventRepository;
import com.workLink.workLink.repository.JobApplicationRepository;
import com.workLink.workLink.repository.StaffRepository;
import com.workLink.workLink.repository.UserRepository;
import com.workLink.workLink.test.JobPosting;
import com.workLink.workLink.test.JobPostingRepository;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobPostingRepository jobPostingRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public JobApplicationService(JobApplicationRepository jobApplicationRepository,
                                 JobPostingRepository jobPostingRepository,
                                 StaffRepository staffRepository,
                                 UserRepository userRepository,
                                 EventRepository eventRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.staffRepository = staffRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    // ✅ Staff applies for job (OLD - keep for backward compatibility)
    public JobApplicationResponseDTO applyForJob(JobApplicationCreateDTO dto) {

        JobPosting jobPosting = jobPostingRepository.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("Job Posting not found with ID: " + dto.getJobId()));

        Staff staff = staffRepository.findById(dto.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + dto.getStaffId()));

        JobApplication jobApplication = new JobApplication();
        jobApplication.setJobPosting(jobPosting);
        jobApplication.setStaff(staff);
        jobApplication.setAppliedDate(LocalDateTime.now());
        jobApplication.setApprovalStatus("PENDING");

        JobApplication saved = jobApplicationRepository.save(jobApplication);

        return mapToResponseDTO(saved);
    }

    // ✅ Get applications by Job ID
    public List<JobApplicationResponseDTO> getApplicationsByJobId(Long jobId) {
        return jobApplicationRepository.findByJobPostingJobId(jobId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ✅ Helper method: Entity → DTO
    private JobApplicationResponseDTO mapToResponseDTO(JobApplication jobApplication) {

        JobApplicationResponseDTO response = new JobApplicationResponseDTO();
        response.setJobApplicationId(jobApplication.getJobApplicationId());
        response.setApprovalStatus(jobApplication.getApprovalStatus());

        if (jobApplication.getJobPosting() != null) {
            response.setJobId(jobApplication.getJobPosting().getJobId());
        }

        if (jobApplication.getStaff() != null) {
            response.setStaffId(jobApplication.getStaff().getStaffId());
        }

        return response;
    }
    
    // ✅ NEW: Volunteer applies for event
    public JobApplication apply(Long eventId, Long volunteerId) {
        
        // Check if already applied
        List<JobApplication> existing = jobApplicationRepository
            .findByEventIdAndVolunteerId(eventId, volunteerId);
        
        if (!existing.isEmpty()) {
            throw new RuntimeException("You have already applied for this event");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

        User volunteer = userRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + volunteerId));

        JobApplication app = new JobApplication();
        app.setEvent(event);
        app.setVolunteer(volunteer);
        app.setApprovalStatus("PENDING");
        app.setAppliedDate(LocalDateTime.now());

        return jobApplicationRepository.save(app);
    }
    
    // ✅ NEW: Get volunteer's applications
    public List<JobApplication> getVolunteerApplications(Long volunteerId) {
        return jobApplicationRepository.findByVolunteer_Id(volunteerId);
    }

    // ✅ NEW: Get organization's applications (for their events)
    public List<JobApplication> getOrgApplications(Long organizationId) {
        return jobApplicationRepository.findByEventCreatedById(organizationId);
    }
    
    // ✅ NEW: Approve application
    public JobApplication approveApplication(Long applicationId, Long organizationId) {
        
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));
        
        // Verify that the organization owns this event
        if (application.getEvent() == null || 
            application.getEvent().getCreatedBy() == null ||
            !application.getEvent().getCreatedBy().getId().equals(organizationId)) {
            throw new RuntimeException("You are not authorized to approve this application");
        }
        
        // Update status
        application.setApprovalStatus("APPROVED");
        
        // Optional: Add volunteer to event's allocatedStaff list
        // Event event = application.getEvent();
        // if (event.getAllocatedStaff() == null) {
        //     event.setAllocatedStaff(new ArrayList<>());
        // }
        // event.getAllocatedStaff().add(application.getVolunteer());
        // eventRepository.save(event);
        
        return jobApplicationRepository.save(application);
    }
    
    // ✅ NEW: Reject application
    public JobApplication rejectApplication(Long applicationId, Long organizationId) {
        
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));
        
        // Verify that the organization owns this event
        if (application.getEvent() == null || 
            application.getEvent().getCreatedBy() == null ||
            !application.getEvent().getCreatedBy().getId().equals(organizationId)) {
            throw new RuntimeException("You are not authorized to reject this application");
        }
        
        // Update status
        application.setApprovalStatus("REJECTED");
        
        return jobApplicationRepository.save(application);
    }
}