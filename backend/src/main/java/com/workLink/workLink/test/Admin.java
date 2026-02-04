package com.workLink.workLink.test;

import jakarta.persistence.*;  // JPA annotations import

// ✅ @Entity means this class represents a database table
@Entity

// ✅ Table name in DB will be "admins"
@Table(name = "admins")
public class Admin {

    // ✅ Primary Key (PK)
    @Id

    // ✅ Auto-generated ID (1,2,3...)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    // ✅ Admin name
    private String name;

    // ✅ Admin email must be unique
    @Column(unique = true)
    private String email;

    // ✅ Admin phone number
    private String phone;

    // ✅ Simple password field (later you can use encryption + JWT)
    private String password;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
