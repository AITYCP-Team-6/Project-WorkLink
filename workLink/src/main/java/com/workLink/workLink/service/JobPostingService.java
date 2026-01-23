package com.workLink.workLink.service;

import com.workLink.workLink.dto.JobPostingCreateDTO;
import com.workLink.workLink.dto.JobPostingResponseDTO;
import com.workLink.workLink.entity.JobPosting;
import com.workLink.workLink.entity.StaffRequirementApplication;
import com.workLink.workLink.repository.JobPostingRepository;
import com.workLink.workLink.repository.StaffRequirementApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final StaffRequirementApplicationRepository requirementRepository;

    public JobPostingService(JobPostingRepository jobPostingRepository,
                             StaffRequirementApplicationRepository requirementRepository) {
        this.jobPostingRepository = jobPostingRepository;
        this.requirementRepository = requirementRepository;
    }

    // ✅ Create Job Posting
    public JobPostingResponseDTO createJobPosting(JobPostingCreateDTO dto) {

        StaffRequirementApplication application = requirementRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Requirement Application not found with ID: " + dto.getApplicationId()));

        // ✅ Only approved requirement should be allowed (recommended)
        if (!"APPROVED".equalsIgnoreCase(application.getStatus())) {
            throw new RuntimeException("Job posting can be created only for APPROVED requirements!");
        }

        JobPosting job = new JobPosting();
        job.setJobDescription(dto.getJobDescription());
        job.setPaymentAmount(dto.getPaymentAmount());
        job.setStatus("OPEN");   // default status
        job.setApplication(application);

        JobPosting savedJob = jobPostingRepository.save(job);

        return mapToResponseDTO(savedJob);
    }

    // ✅ Get all job postings
    public List<JobPostingResponseDTO> getAllJobPostings() {
        return jobPostingRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ✅ Helper: Entity → DTO
    private JobPostingResponseDTO mapToResponseDTO(JobPosting job) {
        JobPostingResponseDTO response = new JobPostingResponseDTO();
        response.setJobId(job.getJobId());
        response.setJobDescription(job.getJobDescription());
        response.setPaymentAmount(job.getPaymentAmount());
        response.setStatus(job.getStatus());

        if (job.getApplication() != null) {
            response.setApplicationId(job.getApplication().getApplicationId());
        }

        return response;
    }
}

