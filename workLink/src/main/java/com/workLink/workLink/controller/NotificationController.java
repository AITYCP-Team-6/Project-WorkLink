package com.workLink.workLink.controller;

import com.workLink.workLink.dto.NotificationCreateDTO;
import com.workLink.workLink.dto.NotificationResponseDTO;
import com.workLink.workLink.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // POST: Create notification
    @PostMapping
    public NotificationResponseDTO createNotification(@RequestBody NotificationCreateDTO dto) {
        return notificationService.createNotification(dto);
    }

    // GET: Get all notifications of staff
    @GetMapping("/staff/{staffId}")
    public List<NotificationResponseDTO> getNotificationsByStaff(@PathVariable Long staffId) {
        return notificationService.getNotificationsByStaffId(staffId);
    }
}
