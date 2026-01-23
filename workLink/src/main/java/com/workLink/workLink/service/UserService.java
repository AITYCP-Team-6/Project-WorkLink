package com.workLink.workLink.service;

import com.workLink.workLink.dto.UserCreateDTO;
import com.workLink.workLink.dto.UserResponseDTO;
import com.workLink.workLink.dto.UserUpdateDTO;
import com.workLink.workLink.entity.User;
import com.workLink.workLink.repository.UserRepository;
import com.workLink.workLink.dto.UserLoginDTO;

import java.util.List;

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
        user.setPassword(dto.getPassword());

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
 // ✅ Get all users
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }
 // ✅ Update user
    public UserResponseDTO updateUser(Long userId, UserUpdateDTO dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        user.setName(dto.getName());
        user.setOrganizationName(dto.getOrganizationName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        User updatedUser = userRepository.save(user);

        return mapToResponseDTO(updatedUser);
    }

    // ✅ Delete user
    public String deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        userRepository.delete(user);

        return "User deleted successfully with ID: " + userId;
    }
 // ✅ User Login (email + password)
    public String loginUser(UserLoginDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // ✅ Password check
        if (!user.getPassword().equals(dto.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return "Login successful!";
    }


}
