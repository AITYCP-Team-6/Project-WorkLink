package com.workLink.workLink.repository;

import com.workLink.workLink.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    

    List<JobApplication> findByJobPostingJobId(Long jobId);
    
    List<JobApplication> findByStaffStaffId(Long staffId);
    
    List<JobApplication> findByVolunteer_Id(Long volunteerId);
    
    List<JobApplication> findByEventCreatedById(Long organizationId);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.event.id = :eventId AND ja.volunteer.id = :volunteerId")
    List<JobApplication> findByEventIdAndVolunteerId(
        @Param("eventId") Long eventId, 
        @Param("volunteerId") Long volunteerId
    );
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.event.createdBy.id = :organizationId AND ja.approvalStatus = :status")
    List<JobApplication> findByOrganizationIdAndStatus(
        @Param("organizationId") Long organizationId, 
        @Param("status") String status
    );
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.volunteer.id = :volunteerId AND ja.approvalStatus = :status")
    List<JobApplication> findByVolunteerIdAndStatus(
        @Param("volunteerId") Long volunteerId, 
        @Param("status") String status
    );
}