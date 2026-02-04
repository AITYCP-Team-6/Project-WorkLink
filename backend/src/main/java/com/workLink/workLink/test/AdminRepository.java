package com.workLink.workLink.test;

import org.springframework.data.jpa.repository.JpaRepository;

// ✅ Repository provides DB operations like save(), findById(), findAll()
public interface AdminRepository extends JpaRepository<Admin, Long> {
}
