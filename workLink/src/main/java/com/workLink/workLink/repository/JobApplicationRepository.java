package com.workLink.workLink.repository;

import com.workLink.workLink.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // ✅ Get all applications for a particular job
    List<JobApplication> findByJobPostingJobId(Long jobId);

    // ✅ Get all applications by a staff
    List<JobApplication> findByStaffStaffId(Long staffId);
}
