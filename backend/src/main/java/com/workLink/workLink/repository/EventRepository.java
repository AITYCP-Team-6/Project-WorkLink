package com.workLink.workLink.repository;

import com.workLink.workLink.entity.Event;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(Event.EventStatus status);
    List<Event> findByCategory(Event.EventCategory category);
    List<Event> findByStartDateBetween(LocalDateTime start, LocalDateTime end);
    List<Event> findByCreatedById(Long userId);
    
    List<Event> findByCreatedByIdAndStatus(Long id, Event.EventStatus status);
    
    List<Event> findByApprovalStatus(Event.ApprovalStatus approvalStatus);
    List<Event> findByApprovalStatusAndStatus(Event.ApprovalStatus approvalStatus, Event.EventStatus status);
}
