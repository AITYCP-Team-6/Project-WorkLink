package com.workLink.workLink.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.workLink.workLink.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEventId(Long eventId);
    List<Attendance> findByStaffId(Long staffId);
    List<Attendance> findByStatus(Attendance.AttendanceStatus status);
    
    Optional<Attendance> findByEventIdAndStaffIdAndDate(Long eventId, Long staffId, LocalDateTime date);
    
    @Query("SELECT a FROM Attendance a WHERE a.event.id = :eventId AND a.staff.id = :staffId")
    List<Attendance> findByEventIdAndStaffId(@Param("eventId") Long eventId, @Param("staffId") Long staffId);
    
    @Query("SELECT SUM(a.hoursWorked) FROM Attendance a WHERE a.event.id = :eventId AND a.staff.id = :staffId AND a.status = 'PRESENT'")
    Double sumHoursWorkedByEventAndStaff(@Param("eventId") Long eventId, @Param("staffId") Long staffId);
}
