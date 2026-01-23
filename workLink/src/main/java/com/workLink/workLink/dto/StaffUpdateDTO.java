package com.workLink.workLink.dto;

public class StaffUpdateDTO {

    private String name;
    private String email;
    private String phone;
    private String skills;
    private String verificationStatus;  // VERIFIED / NOT_VERIFIED
   // private String availabilityStatus;  // AVAILABLE / NOT_AVAILABLE

    // Getters & Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

//    public String getAvailabilityStatus() {
//        return availabilityStatus;
//    }
//
//    public void setAvailabilityStatus(String availabilityStatus) {
//        this.availabilityStatus = availabilityStatus;
//    }
}
