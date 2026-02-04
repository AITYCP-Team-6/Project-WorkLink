/**
 * USER ENTITY
 * * Purpose: This class serves as the core Identity Model for the WorkLink system.
 * It integrates directly with Spring Security by implementing the UserDetails interface,
 * allowing the application to treat this database entity as a security Principal.
 * * Design Pattern: Implementation of the "Identity and Access Management" (IAM) pattern.
 */

package com.workLink.workLink.entity;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "password")
@EntityListeners(AuditingEntityListener.class)// Enables automatic timestamping via @CreatedDate
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "skills", "applications", "events"})
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)// Ensures unique identity at the DB level
    private String email;
    
    @NotBlank
    @JsonIgnore // Prevents the hashed password from ever being sent in an API response
    @Column(nullable = false)
    private String password;
    
    /**
     * ROLE-BASED ACCESS CONTROL (RBAC)
     * Maps the user to a specific role (ADMIN, ORGANIZER, USER).
     * EnumType.STRING is used to store the name in the DB instead of an index.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;
    
    private String phone;
    
    private String address;
    
    /**
     * USER SKILLS
     * Since skills are simple Strings, @ElementCollection is used to create 
     * a separate table 'user_skills' without needing a full Skill Entity.
     */
    @ElementCollection
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    @JsonIgnore
    private Set<String> skills = new HashSet<>();
    
    @Column(nullable = false)
    private Boolean availability = true;
    
    @Column(nullable = false)
    private Double hourlyRate = 0.0;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /* ==========================================================
    SPRING SECURITY (USERDETAILS) IMPLEMENTATION
    ========================================================== */

	 /**
	  * Converts the internal 'Role' enum into a Spring Security 'GrantedAuthority'.
	  * The "ROLE_" prefix is standard for hasRole() checks in SecurityConfig.
	  */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    @Override
    public String getUsername() {
        return email;// We use email as the primary login credential
    }
    
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
