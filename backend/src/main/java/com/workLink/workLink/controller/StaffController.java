package com.workLink.workLink.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workLink.workLink.dto.ApiResponse;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllStaff() {
        List<User> staff = userService.getAllStaff();
        return ResponseEntity.ok(ApiResponse.success(staff));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getStaffById(@PathVariable Long id) {
        User staff = userService.getStaffById(id);
        return ResponseEntity.ok(ApiResponse.success(staff));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateStaff(
            @PathVariable Long id,
            @RequestBody User user
    ) {
        User updated = userService.updateStaff(id, user);
        return ResponseEntity.ok(ApiResponse.success("Staff updated successfully", updated));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable Long id) {
        userService.deleteStaff(id);
        return ResponseEntity.ok(ApiResponse.success("Staff deleted successfully", null));
    }
}
