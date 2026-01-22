package com.workLink.workLink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    private String message;

    private String notificationType;  // SHIFT_ASSIGNED / PAYMENT_DONE / GENERAL

    private LocalDateTime sentTime;

    private String responseStatus;     // SENT / SEEN

    // ✅ Many notifications can belong to one staff
    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    // ✅ Optional: notification can be linked to job posting
    @ManyToOne
    @JoinColumn(name = "job_id")
    private JobPosting jobPosting;

    // ✅ Optional: notification can be linked to shift assignment
    @ManyToOne
    @JoinColumn(name = "shift_id")
    private ShiftAssignment shiftAssignment;

    // ✅ Getters & Setters
    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }

    public LocalDateTime getSentTime() {
        return sentTime;
    }

    public void setSentTime(LocalDateTime sentTime) {
        this.sentTime = sentTime;
    }

    public String getResponseStatus() {
        return responseStatus;
    }

    public void setResponseStatus(String responseStatus) {
        this.responseStatus = responseStatus;
    }

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public JobPosting getJobPosting() {
        return jobPosting;
    }

    public void setJobPosting(JobPosting jobPosting) {
        this.jobPosting = jobPosting;
    }

    public ShiftAssignment getShiftAssignment() {
        return shiftAssignment;
    }

    public void setShiftAssignment(ShiftAssignment shiftAssignment) {
        this.shiftAssignment = shiftAssignment;
    }
}

