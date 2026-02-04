package com.workLink.workLink.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workLink.workLink.dto.ApiResponse;
import com.workLink.workLink.entity.Event;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.service.EventApprovalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class EventApprovalController {
    
    private final EventApprovalService eventApprovalService;
    
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List>> getPendingApprovals() {
        List events = eventApprovalService.getPendingApprovals();
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approveEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal User admin) {
        Event event = eventApprovalService.approveEvent(id, admin);
        return ResponseEntity.ok(ApiResponse.success("Event approved successfully", event));
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse> rejectEvent(
            @PathVariable Long id,
            @RequestBody Map body,
            @AuthenticationPrincipal User admin) {
        String reason = (String) body.get("reason");
        Event event = eventApprovalService.rejectEvent(id, admin, reason);
        return ResponseEntity.ok(ApiResponse.success("Event rejected", event));
    }
}
