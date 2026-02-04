package com.workLink.workLink.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.workLink.workLink.entity.Event;
import com.workLink.workLink.entity.Notification;
import com.workLink.workLink.entity.Role;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.repository.EventRepository;
import com.workLink.workLink.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
    
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }
    
    public Event createEvent(Event event, User createdBy) {
        event.setCreatedBy(createdBy);
        
        //.........
        return eventRepository.save(event);
    }
    
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setLocation(eventDetails.getLocation());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setRequiredStaff(eventDetails.getRequiredStaff());
        event.setStatus(eventDetails.getStatus());
        event.setCategory(eventDetails.getCategory());
        event.setBudget(eventDetails.getBudget());
        return eventRepository.save(event);
    }
    
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
    
    public Event allocateStaff(Long eventId, Long staffId) {
        Event event = getEventById(eventId);
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        if (event.getAllocatedStaff().contains(staff)) {
            throw new RuntimeException("Staff already allocated to this event");
        }
        
        event.getAllocatedStaff().add(staff);
        return eventRepository.save(event);
    }
    
    public Event removeStaff(Long eventId, Long staffId) {
        Event event = getEventById(eventId);
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        event.getAllocatedStaff().remove(staff);
        return eventRepository.save(event);
    }
    
    public Event postEvent(Long id) {
        Event event = getEventById(id);
        event.setStatus(Event.EventStatus.POSTED);
        return eventRepository.save(event);
    }
    public List<Event> getMyPostedEvents(Long userId) {
        return eventRepository
                .findByCreatedByIdAndStatus(
                    userId,
                    Event.EventStatus.POSTED
                );
    }
    
    public List<Event> getPostedEvents() {
        return eventRepository.findByStatus(Event.EventStatus.POSTED);
    }


    @Transactional
    public Event requestApproval(Long eventId, User organization) {
        Event event = getEventById(eventId);
        
        // Verify organization owns the event
        if (!event.getCreatedBy().getId().equals(organization.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        // Update status to request approval
        event.setStatus(Event.EventStatus.POSTED);
        event.setApprovalStatus(Event.ApprovalStatus.PENDING);
        
        Event savedEvent = eventRepository.save(event);
        
        // Notify all admins
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        for (User admin : admins) {
            notificationService.createNotification(
                admin,
                "New Event Approval Request",
                organization.getName() + " has requested approval for '" + event.getTitle() + "'",
                Notification.NotificationType.EVENT_POSTED,
                eventId.toString()
            );
        }
        
        return savedEvent;
    }

    public List<Event> getApprovedEvents() {
        return eventRepository.findByApprovalStatusAndStatus(
            Event.ApprovalStatus.APPROVED,
            Event.EventStatus.POSTED
        );
    }

}