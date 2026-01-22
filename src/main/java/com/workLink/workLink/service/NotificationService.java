package com.workLink.workLink.service;

import com.workLink.workLink.dto.NotificationCreateDTO;
import com.workLink.workLink.dto.NotificationResponseDTO;
import com.workLink.workLink.entity.JobPosting;
import com.workLink.workLink.entity.Notification;
import com.workLink.workLink.entity.ShiftAssignment;
import com.workLink.workLink.entity.Staff;
import com.workLink.workLink.repository.JobPostingRepository;
import com.workLink.workLink.repository.NotificationRepository;
import com.workLink.workLink.repository.ShiftAssignmentRepository;
import com.workLink.workLink.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final StaffRepository staffRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               StaffRepository staffRepository,
                               JobPostingRepository jobPostingRepository,
                               ShiftAssignmentRepository shiftAssignmentRepository) {
        this.notificationRepository = notificationRepository;
        this.staffRepository = staffRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.shiftAssignmentRepository = shiftAssignmentRepository;
    }

    // ✅ Create notification (admin/system)
    public NotificationResponseDTO createNotification(NotificationCreateDTO dto) {

        Staff staff = staffRepository.findById(dto.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found with ID: " + dto.getStaffId()));

        Notification notification = new Notification();
        notification.setStaff(staff);
        notification.setMessage(dto.getMessage());
        notification.setNotificationType(dto.getNotificationType());
        notification.setSentTime(LocalDateTime.now());
        notification.setResponseStatus("SENT");

        // ✅ Optional linking to JobPosting
        if (dto.getJobId() != null) {
            JobPosting jobPosting = jobPostingRepository.findById(dto.getJobId())
                    .orElseThrow(() -> new RuntimeException("Job not found with ID: " + dto.getJobId()));
            notification.setJobPosting(jobPosting);
        }

        // ✅ Optional linking to ShiftAssignment
        if (dto.getShiftId() != null) {
            ShiftAssignment shift = shiftAssignmentRepository.findById(dto.getShiftId())
                    .orElseThrow(() -> new RuntimeException("Shift not found with ID: " + dto.getShiftId()));
            notification.setShiftAssignment(shift);
        }

        Notification saved = notificationRepository.save(notification);

        return mapToResponseDTO(saved);
    }

    // ✅ Get notifications for staff
    public List<NotificationResponseDTO> getNotificationsByStaffId(Long staffId) {
        return notificationRepository.findByStaffStaffId(staffId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ✅ Helper: Entity → ResponseDTO
    private NotificationResponseDTO mapToResponseDTO(Notification notification) {

        NotificationResponseDTO response = new NotificationResponseDTO();
        response.setNotificationId(notification.getNotificationId());
        response.setMessage(notification.getMessage());
        response.setNotificationType(notification.getNotificationType());
        response.setSentTime(notification.getSentTime());
        response.setResponseStatus(notification.getResponseStatus());

        if (notification.getStaff() != null) {
            response.setStaffId(notification.getStaff().getStaffId());
        }

        if (notification.getJobPosting() != null) {
            response.setJobId(notification.getJobPosting().getJobId());
        }

        if (notification.getShiftAssignment() != null) {
            response.setShiftId(notification.getShiftAssignment().getShiftId());
        }

        return response;
    }
}

