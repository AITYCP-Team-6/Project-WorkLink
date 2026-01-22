package com.workLink.workLink.entity;

import jakarta.persistence.*;   // Import JPA annotations (used for database mapping)

// @Entity means: This class will be mapped to a database table
@Entity

// @Table specifies the name of the table in the database
@Table(name = "users")
public class User {

    // Primary Key (PK) of the table
    @Id

    // Automatically generates ID values (Auto Increment: 1,2,3...)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    // Stores the user's name
    private String name;

    // Stores the organization/college/company name of the user
    private String organizationName;

    // Ensures email must be unique (no duplicate emails allowed)
    @Column(unique = true)
    private String email;

    // Stores the phone number of the user
    private String phone;

    // Getters and Setters (used to read and update values)

    public Long getUserId() {
        return userId;   // Returns primary key value
    }

    public void setUserId(Long userId) {
        this.userId = userId;   // Sets primary key value
    }

    public String getName() {
        return name;    // Returns user's name
    }

    public void setName(String name) {
        this.name = name;   // Sets user's name
    }

    public String getOrganizationName() {
        return organizationName;    // Returns organization name
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;   // Sets organization name
    }

    public String getEmail() {
        return email;   // Returns email
    }

    public void setEmail(String email) {
        this.email = email; // Sets email
    }

    public String getPhone() {
        return phone;   // Returns phone number
    }

    public void setPhone(String phone) {
        this.phone = phone; // Sets phone number
    }
}
