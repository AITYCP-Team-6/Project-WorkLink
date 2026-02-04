package com.workLink.workLink.test;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/job-postings")
public class JobPostingController {

    private final JobPostingService jobPostingService;

    public JobPostingController(JobPostingService jobPostingService) {
        this.jobPostingService = jobPostingService;
    }

    // ✅ POST: Create a job posting
    @PostMapping
    public JobPostingResponseDTO createJobPosting(@RequestBody JobPostingCreateDTO dto) {
        return jobPostingService.createJobPosting(dto);
    }

    // ✅ GET: List all job postings
    @GetMapping
    public List<JobPostingResponseDTO> getAllJobPostings() {
        return jobPostingService.getAllJobPostings();
    }
}

