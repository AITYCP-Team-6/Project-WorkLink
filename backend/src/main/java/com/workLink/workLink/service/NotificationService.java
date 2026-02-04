package com.workLink.workLink.service;

import com.workLink.workLink.entity.Notification;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
 
 private final NotificationRepository notificationRepository;
 
 public Notification createNotification(
         User user, 
         String title, 
         String message,
         Notification.NotificationType type,
         String referenceId) {
     
     Notification notification = new Notification();
     notification.setUser(user);
     notification.setTitle(title);
     notification.setMessage(message);
     notification.setType(type);
     notification.setReferenceId(referenceId);
     notification.setIsRead(false);
     
     return notificationRepository.save(notification);
 }
 
 public List<Notification> getUserNotifications(Long userId) {
     return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
 }
 
 public List<Notification> getUnreadNotifications(Long userId) {
     return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
 }
 
 public void markAsRead(Long notificationId) {
     Notification notification = notificationRepository.findById(notificationId)
             .orElseThrow(() -> new RuntimeException("Notification not found"));
     notification.setIsRead(true);
     notificationRepository.save(notification);
 }
 
 public void markAllAsRead(Long userId) {
     List<Notification> notifications = 
             notificationRepository.findByUserIdAndIsReadFalse(userId);
     notifications.forEach(n -> n.setIsRead(true));
     notificationRepository.saveAll(notifications);
 }
}
