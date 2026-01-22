package com.workLink.workLink.service;

import com.workLink.workLink.dto.UserCreateDTO;
import com.workLink.workLink.dto.UserResponseDTO;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    // ✅ Constructor Injection
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Create new user
    public UserResponseDTO createUser(UserCreateDTO dto) {

        // ✅ Convert DTO → Entity
        User user = new User();
        user.setName(dto.getName());
        user.setOrganizationName(dto.getOrganizationName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        // ✅ Save user in DB
        User savedUser = userRepository.save(user);

        // ✅ Convert Entity → ResponseDTO
        return mapToResponseDTO(savedUser);
    }

    // ✅ Get user by ID
    public UserResponseDTO getUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        return mapToResponseDTO(user);
    }

    // ✅ Helper method: Entity → ResponseDTO
    private UserResponseDTO mapToResponseDTO(User user) {

        UserResponseDTO response = new UserResponseDTO();
        response.setUserId(user.getUserId());
        response.setName(user.getName());
        response.setOrganizationName(user.getOrganizationName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());

        return response;
    }
}
