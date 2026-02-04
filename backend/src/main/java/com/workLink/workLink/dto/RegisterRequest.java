package com.workLink.workLink.dto;

import java.util.Set;

import com.workLink.workLink.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;
    
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String password;
    
    private Role role = Role.USER;
    private String phone;
    private String address;
    private Set<String> skills;
    private Double hourlyRate = 15.0;
}