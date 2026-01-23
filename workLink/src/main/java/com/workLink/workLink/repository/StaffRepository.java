package com.workLink.workLink.repository;

import com.workLink.workLink.entity.Staff;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff, Long> {
	Optional<Staff> findByEmail(String email);
}
