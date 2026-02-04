package com.workLink.workLink.test;

import jakarta.persistence.*;

@Entity
@Table(name = "job_postings")
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    private String jobDescription;

    private Double paymentAmount;

    private String status;  // OPEN / CLOSED

    // ✅ One JobPosting is linked to one StaffRequirementApplication
    @OneToOne
    @JoinColumn(name = "application_id")
    private StaffRequirementApplication application;

    // ✅ Getters & Setters
    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public Double getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(Double paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public StaffRequirementApplication getApplication() {
        return application;
    }

    public void setApplication(StaffRequirementApplication application) {
        this.application = application;
    }
}
