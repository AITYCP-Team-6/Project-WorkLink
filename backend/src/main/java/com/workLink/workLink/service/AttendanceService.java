package com.workLink.workLink.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.workLink.workLink.entity.Attendance;
import com.workLink.workLink.repository.AttendanceRepository;
import com.workLink.workLink.repository.EventRepository;
import com.workLink.workLink.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
    
    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
    }
    
    public Attendance createAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }
    
    public Attendance updateAttendance(Long id, Attendance attendanceDetails) {
        Attendance attendance = getAttendanceById(id);
        attendance.setCheckOut(attendanceDetails.getCheckOut());
        attendance.setStatus(attendanceDetails.getStatus());
        attendance.setNotes(attendanceDetails.getNotes());
        return attendanceRepository.save(attendance);
    }
    
    public Attendance checkout(Long id) {
        Attendance attendance = getAttendanceById(id);
        if (attendance.getCheckOut() != null) {
            throw new RuntimeException("Already checked out");
        }
        attendance.setCheckOut(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }
    
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
    
    public List<Attendance> getAttendanceByEvent(Long eventId) {
        return attendanceRepository.findByEventId(eventId);
    }
    
    public Map<String, Object> getEventStats(Long eventId) {
        List<Attendance> attendanceList = attendanceRepository.findByEventId(eventId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", attendanceList.size());
        stats.put("present", attendanceList.stream().filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT).count());
        stats.put("absent", attendanceList.stream().filter(a -> a.getStatus() == Attendance.AttendanceStatus.ABSENT).count());
        stats.put("late", attendanceList.stream().filter(a -> a.getStatus() == Attendance.AttendanceStatus.LATE).count());
        stats.put("totalHours", attendanceList.stream().mapToDouble(Attendance::getHoursWorked).sum());
        
        return stats;
    }
}