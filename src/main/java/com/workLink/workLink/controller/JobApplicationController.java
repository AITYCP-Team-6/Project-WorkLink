package com.workLink.workLink.controller;

import com.workLink.workLink.dto.JobApplicationCreateDTO;
import com.workLink.workLink.dto.JobApplicationResponseDTO;
import com.workLink.workLink.service.JobApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/job-applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    // ✅ POST: Staff applies for job
    @PostMapping
    public JobApplicationResponseDTO applyForJob(@RequestBody JobApplicationCreateDTO dto) {
        return jobApplicationService.applyForJob(dto);
    }

    // ✅ GET: All applications for a job
    @GetMapping("/job/{jobId}")
    public List<JobApplicationResponseDTO> getApplicationsByJobId(@PathVariable Long jobId) {
        return jobApplicationService.getApplicationsByJobId(jobId);
    }
}
