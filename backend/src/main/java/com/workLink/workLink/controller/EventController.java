package com.workLink.workLink.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workLink.workLink.dto.ApiResponse;
import com.workLink.workLink.entity.Event;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.repository.EventRepository;
import com.workLink.workLink.service.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    
    private final EventService eventService;
    private final EventRepository eventRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Event>>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success(event));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Event>> createEvent(
            @RequestBody Event event,
            @AuthenticationPrincipal User user
    ) {
        Event created = eventService.createEvent(event, user);
        return ResponseEntity.ok(ApiResponse.success("Event created successfully", created));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Event>> updateEvent(
            @PathVariable Long id,
            @RequestBody Event event
    ) {
        Event updated = eventService.updateEvent(id, event);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", updated));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
    
    @PostMapping("/{eventId}/allocate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Event>> allocateStaff(
            @PathVariable Long eventId,
            @RequestBody Map<String, Long> request
    ) {
        Long staffId = request.get("staffId");
        Event event = eventService.allocateStaff(eventId, staffId);
        return ResponseEntity.ok(ApiResponse.success("Staff allocated successfully", event));
    }
    
    @DeleteMapping("/{eventId}/allocate/{staffId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Event>> removeStaff(
            @PathVariable Long eventId,
            @PathVariable Long staffId
    ) {
        Event event = eventService.removeStaff(eventId, staffId);
        return ResponseEntity.ok(ApiResponse.success("Staff removed successfully", event));
    }
    
    @PutMapping("/{id}/post")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<Event>> postEvent(@PathVariable Long id) {
        Event event = eventService.postEvent(id);
        return ResponseEntity.ok(
            ApiResponse.success("Event posted successfully", event)
        );
    }
    @GetMapping("/my-events/{id}")
    public ResponseEntity<ApiResponse<List<Event>>> getMyPostedEvents(
            @PathVariable Long userId
    ) {
        List<Event> events =
            eventService.getMyPostedEvents(userId);

        return ResponseEntity.ok(ApiResponse.success(events));
    }
    @GetMapping("/my-events")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    public ResponseEntity<ApiResponse<List<Event>>> getMyPostedEvents(
            @AuthenticationPrincipal User user) {

        List<Event> events =
          eventRepository.findByCreatedByIdAndStatus(
              user.getId(),
              Event.EventStatus.POSTED
          );

        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/posted")
    public ResponseEntity<ApiResponse<List<Event>>> getPostedEvents() {
        List<Event> events = eventService.getPostedEvents();
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @PutMapping("/{eventId}/request-approval")
    public ResponseEntity<Event> requestApproval(
            @PathVariable Long eventId,
            @AuthenticationPrincipal User organization
    ) {
        Event event = eventService.requestApproval(eventId, organization);
        return ResponseEntity.ok(event);
    }
}