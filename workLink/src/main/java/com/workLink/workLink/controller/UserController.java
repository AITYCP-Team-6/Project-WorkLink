package com.workLink.workLink.controller;

import com.workLink.workLink.dto.UserCreateDTO;
import com.workLink.workLink.dto.UserResponseDTO;
import com.workLink.workLink.dto.UserUpdateDTO;
import com.workLink.workLink.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.workLink.workLink.dto.UserLoginDTO;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    // ✅ Constructor Injection
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ POST: Create new user (with validation)
    @PostMapping
    public UserResponseDTO createUser(@Valid @RequestBody UserCreateDTO dto) {
        return userService.createUser(dto);
    }

    // ✅ GET: Get user by ID
    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable("id") Long userId) {
        return userService.getUserById(userId);
    }

    // ✅ GET: Get all users
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ PUT: Update user
    @PutMapping("/{id}")
    public UserResponseDTO updateUser(@PathVariable("id") Long userId,
                                      @RequestBody UserUpdateDTO dto) {
        return userService.updateUser(userId, dto);
    }

    // ✅ DELETE: Delete user
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") Long userId) {
        return userService.deleteUser(userId);
    }
 // ✅ POST: User Login
    @PostMapping("/login")
    public String loginUser(@RequestBody UserLoginDTO dto) {
        return userService.loginUser(dto);
    }

}
