package com.workLink.workLink.test;

import java.time.LocalDate;

public class StaffRequirementCreateDTO {

    private String eventName;
    private String eventType;
    private LocalDate eventDate;
    private Integer requiredStaff;
    private String location;

    private Long userId;  // ✅ which user is creating the requirement

    // getters & setters
    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public Integer getRequiredStaff() {
        return requiredStaff;
    }

    public void setRequiredStaff(Integer requiredStaff) {
        this.requiredStaff = requiredStaff;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
