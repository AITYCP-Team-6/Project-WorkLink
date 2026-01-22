package com.workLink.workLink.entity;

import jakarta.persistence.*;     // JPA annotations for database mapping
import java.time.LocalDate;       // Used to store date (YYYY-MM-DD)

// @Entity means: This class is mapped to a database table
@Entity

// Table name in the database will be "staff_requirement_applications"
@Table(name = "staff_requirement_applications")

public class StaffRequirementApplication {
	
	    //  Primary Key for this table
	    @Id

	    // Auto-increment ID (1,2,3...)
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long applicationId;

	    // Name of the event for which staff is required
	    private String eventName;

	    // Type of event (exam, fest, seminar, etc.)
	    private String eventType;

	    // Date of the event
	    private LocalDate eventDate;

	    // Number of staff required for the event
	    private Integer requiredStaff;

	    // Location of the event
	    private String location;

	    //Current status of requirement request
	    // Example values: PENDING / APPROVED / REJECTED
	    private String status;

	    //Many staff requirements can be created by one user
	    // Example: One user can create multiple event requests
	    @ManyToOne

	    //Foreign Key column name in this table will be "user_id"
	    @JoinColumn(name = "user_id")
	    private User user;

	    //Getters and Setters (Used to read/update field values)

	    public Long getApplicationId() {
	        return applicationId;  // Returns primary key value
	    }

	    public void setApplicationId(Long applicationId) {
	        this.applicationId = applicationId;  // Sets primary key value
	    }

	    public String getEventName() {
	        return eventName;  // Returns event name
	    }

	    public void setEventName(String eventName) {
	        this.eventName = eventName;  // Sets event name
	    }

	    public String getEventType() {
	        return eventType;  // Returns event type
	    }

	    public void setEventType(String eventType) {
	        this.eventType = eventType;  // Sets event type
	    }

	    public LocalDate getEventDate() {
	        return eventDate;  // Returns event date
	    }

	    public void setEventDate(LocalDate eventDate) {
	        this.eventDate = eventDate;  // Sets event date
	    }

	    public Integer getRequiredStaff() {
	        return requiredStaff;  // Returns required staff count
	    }

	    public void setRequiredStaff(Integer requiredStaff) {
	        this.requiredStaff = requiredStaff;  // Sets required staff count
	    }

	    public String getLocation() {
	        return location;  // Returns event location
	    }

	    public void setLocation(String location) {
	        this.location = location;  // Sets event location
	    }

	    public String getStatus() {
	        return status;  // Returns current status
	    }

	    public void setStatus(String status) {
	        this.status = status;  // Sets current status
	    }

	    public User getUser() {
	        return user;  // Returns the user who created this requirement
	    }

	    public void setUser(User user) {
	        this.user = user;  // Sets the user reference
	    }
	}


