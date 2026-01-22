package com.workLink.workLink.repository;

import com.workLink.workLink.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

// ✅ Repository provides DB operations like save(), findById(), findAll()
public interface AdminRepository extends JpaRepository<Admin, Long> {
}
