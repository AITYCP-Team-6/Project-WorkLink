package com.workLink.workLink.repository;

import com.workLink.workLink.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // ✅ Staff ke notifications nikalne ke liye
    List<Notification> findByStaffStaffId(Long staffId);
}
