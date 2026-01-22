package com.workLink.workLink.repository;
import com.workLink.workLink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

	public interface UserRepository extends JpaRepository<User, Long> {
	}


