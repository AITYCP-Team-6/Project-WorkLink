package com.workLink.workLink.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.workLink.workLink.dto.AuthResponse;
import com.workLink.workLink.dto.LoginRequest;
import com.workLink.workLink.dto.RegisterRequest;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setSkills(request.getSkills());
        user.setHourlyRate(request.getHourlyRate());
        
        user = userRepository.save(user);
        String token = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtService.generateToken(user);
        
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .build();
    }
    
    public List<User> getAllStaff() {
        return userRepository.findAll();
    }
    
    public User getStaffById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }
    
    public User updateStaff(Long id, User userDetails) {
        User user = getStaffById(id);
        user.setName(userDetails.getName());
        user.setPhone(userDetails.getPhone());
        user.setAddress(userDetails.getAddress());
        user.setSkills(userDetails.getSkills());
        user.setAvailability(userDetails.getAvailability());
        user.setHourlyRate(userDetails.getHourlyRate());
        return userRepository.save(user);
    }
    
    public void deleteStaff(Long id) {
        userRepository.deleteById(id);
    }
}