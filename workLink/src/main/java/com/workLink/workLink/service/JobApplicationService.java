package com.workLink.workLink.service;

import com.workLink.workLink.dto.JobApplicationCreateDTO;
import com.workLink.workLink.dto.JobApplicationResponseDTO;
import com.workLink.workLink.entity.JobApplication;
import com.workLink.workLink.entity.JobPosting;
import com.workLink.workLink.entity.Staff;
import com.workLink.workLink.repository.JobApplicationRepository;
import com.workLink.workLink.repository.JobPostingRepository;
import com.workLink.workLink.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobPostingRepository jobPostingRepository;
    private final StaffRepository staffRepository;

    public JobApplicationService(JobApplicationRepository jobApplicationRepository,
                                 JobPostingRepository jobPostingRepository,
                                 StaffRepository staffRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.staffRepository = staffRepository;
    }

    // ✅ Staff applies for job
    public JobApplicationResponseDTO applyForJob(JobApplicationCreateDTO dto) {

        JobPosting jobPosting = jobPostingRepository.findById(dto.getJobId())
                .orElseThrow(() -> new RuntimeException("Job Posting not found with ID: " + dto.getJobId()));

        Staff staff = staffRepository.findById(dto.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + dto.getStaffId()));

        JobApplication jobApplication = new JobApplication();
        jobApplication.setJobPosting(jobPosting);
        jobApplication.setStaff(staff);
        jobApplication.setAppliedDate(LocalDate.now());
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
        response.setAppliedDate(jobApplication.getAppliedDate());
        response.setApprovalStatus(jobApplication.getApprovalStatus());

        if (jobApplication.getJobPosting() != null) {
            response.setJobId(jobApplication.getJobPosting().getJobId());
        }

        if (jobApplication.getStaff() != null) {
            response.setStaffId(jobApplication.getStaff().getStaffId());
        }

        return response;
    }
}

