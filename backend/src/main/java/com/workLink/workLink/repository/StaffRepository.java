package com.workLink.workLink.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workLink.workLink.entity.Staff;

public interface StaffRepository extends JpaRepository<Staff, Long> {
}
