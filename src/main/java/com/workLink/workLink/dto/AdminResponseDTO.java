package com.workLink.workLink.dto;

// ✅ This DTO is used while sending admin data in response (GET)
// ⚠️ Password is NOT returned for security reasons
public class AdminResponseDTO {

    private Long adminId;
    private String name;
    private String email;
    private String phone;

    // ✅ Getters & Setters
    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

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
}
