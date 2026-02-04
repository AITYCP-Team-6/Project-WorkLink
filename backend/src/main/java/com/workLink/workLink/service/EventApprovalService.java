//EventApprovalService.java
package com.workLink.workLink.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workLink.workLink.entity.Event;
import com.workLink.workLink.entity.Notification;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.repository.EventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventApprovalService {
 
 private final EventRepository eventRepository;
 private final NotificationService notificationService;
 
 public List<Event> getPendingApprovals() {
     return eventRepository.findByApprovalStatus(Event.ApprovalStatus.PENDING);
 }
 
 @Transactional
 public Event approveEvent(Long eventId, User admin) {
     Event event = eventRepository.findById(eventId)
             .orElseThrow(() -> new RuntimeException("Event not found"));
     
     if (event.getApprovalStatus() != Event.ApprovalStatus.PENDING) {
         throw new RuntimeException("Event is not pending approval");
     }
     
     event.setApprovalStatus(Event.ApprovalStatus.APPROVED);
     event.setApprovedBy(admin);
     event.setApprovedAt(LocalDateTime.now());
     event.setStatus(Event.EventStatus.POSTED); // Make visible to volunteers
     
     Event savedEvent = eventRepository.save(event);
     
     // Send notification to organization
     notificationService.createNotification(
         event.getCreatedBy(),
         "Event Approved",
         "Your event '" + event.getTitle() + "' has been approved and is now visible to volunteers.",
         Notification.NotificationType.EVENT_APPROVED,
         eventId.toString()
     );
     
     return savedEvent;
 }
 
 @Transactional
 public Event rejectEvent(Long eventId, User admin, String reason) {
     Event event = eventRepository.findById(eventId)
             .orElseThrow(() -> new RuntimeException("Event not found"));
     
     if (event.getApprovalStatus() != Event.ApprovalStatus.PENDING) {
         throw new RuntimeException("Event is not pending approval");
     }
     
     event.setApprovalStatus(Event.ApprovalStatus.REJECTED);
     event.setApprovedBy(admin);
     event.setApprovedAt(LocalDateTime.now());
     event.setRejectionReason(reason);
     event.setStatus(Event.EventStatus.CANCELLED);
     
     Event savedEvent = eventRepository.save(event);
     
     // Send notification to organization
     notificationService.createNotification(
         event.getCreatedBy(),
         "Event Rejected",
         "Your event '" + event.getTitle() + "' was rejected. Reason: " + reason,
         Notification.NotificationType.EVENT_REJECTED,
         eventId.toString()
     );
     
     return savedEvent;
 }
}
