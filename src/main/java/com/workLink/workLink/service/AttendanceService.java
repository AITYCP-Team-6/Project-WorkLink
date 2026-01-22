package com.workLink.workLink.service;

import com.workLink.workLink.dto.AttendanceCheckInDTO;
import com.workLink.workLink.dto.AttendanceResponseDTO;
import com.workLink.workLink.entity.Attendance;
import com.workLink.workLink.entity.ShiftAssignment;
import com.workLink.workLink.repository.AttendanceRepository;
import com.workLink.workLink.repository.ShiftAssignmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final ShiftAssignmentRepository shiftRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             ShiftAssignmentRepository shiftRepository) {
        this.attendanceRepository = attendanceRepository;
        this.shiftRepository = shiftRepository;
    }

    // ✅ Staff checks in for shift
    public AttendanceResponseDTO checkIn(AttendanceCheckInDTO dto) {

        ShiftAssignment shift = shiftRepository.findById(dto.getShiftId())
                .orElseThrow(() -> new RuntimeException("Shift not found with ID: " + dto.getShiftId()));

        Attendance attendance = new Attendance();
        attendance.setShiftAssignment(shift);
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setAttendanceStatus("PRESENT");

        Attendance saved = attendanceRepository.save(attendance);

        return mapToResponseDTO(saved);
    }

    // ✅ Helper: Entity → Response DTO
    private AttendanceResponseDTO mapToResponseDTO(Attendance attendance) {

        AttendanceResponseDTO response = new AttendanceResponseDTO();
        response.setAttendanceId(attendance.getAttendanceId());
        response.setCheckInTime(attendance.getCheckInTime());
        response.setAttendanceStatus(attendance.getAttendanceStatus());

        if (attendance.getShiftAssignment() != null) {
            response.setShiftId(attendance.getShiftAssignment().getShiftId());
        }

        return response;
    }
}

