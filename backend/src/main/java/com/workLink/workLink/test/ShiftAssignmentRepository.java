package com.workLink.workLink.test;

import com.workLink.workLink.entity.ShiftAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, Long> {
}
