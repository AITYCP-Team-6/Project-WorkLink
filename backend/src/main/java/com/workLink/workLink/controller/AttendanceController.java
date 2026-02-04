package com.workLink.workLink.controller;


import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workLink.workLink.dto.ApiResponse;
import com.workLink.workLink.entity.Attendance;
import com.workLink.workLink.service.AttendanceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Attendance>>> getAllAttendance(
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) Long staffId
    ) {
        List<Attendance> attendance;
        if (eventId != null) {
            attendance = attendanceService.getAttendanceByEvent(eventId);
        } else {
            attendance = attendanceService.getAllAttendance();
        }
        return ResponseEntity.ok(ApiResponse.success(attendance));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Attendance>> getAttendanceById(@PathVariable Long id) {
        Attendance attendance = attendanceService.getAttendanceById(id);
        return ResponseEntity.ok(ApiResponse.success(attendance));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Attendance>> createAttendance(@RequestBody Attendance attendance) {
        Attendance created = attendanceService.createAttendance(attendance);
        return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully", created));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Attendance>> updateAttendance(
            @PathVariable Long id,
            @RequestBody Attendance attendance
    ) {
        Attendance updated = attendanceService.updateAttendance(id, attendance);
        return ResponseEntity.ok(ApiResponse.success("Attendance updated successfully", updated));
    }
    
    @PutMapping("/{id}/checkout")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Attendance>> checkout(@PathVariable Long id) {
        Attendance updated = attendanceService.checkout(id);
        return ResponseEntity.ok(ApiResponse.success("Checked out successfully", updated));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok(ApiResponse.success("Attendance deleted successfully", null));
    }
    
    @GetMapping("/event/{eventId}/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEventStats(@PathVariable Long eventId) {
        Map<String, Object> stats = attendanceService.getEventStats(eventId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
