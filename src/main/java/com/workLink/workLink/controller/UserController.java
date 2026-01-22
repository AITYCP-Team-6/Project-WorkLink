package com.workLink.workLink.controller;

import com.workLink.workLink.dto.UserCreateDTO;
import com.workLink.workLink.dto.UserResponseDTO;
import com.workLink.workLink.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    // ✅ Constructor Injection
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ POST API: Create new user
    @PostMapping
    public UserResponseDTO createUser(@RequestBody UserCreateDTO dto) {
        return userService.createUser(dto);
    }

    // ✅ GET API: Get user by ID
    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable("id") Long userId) {
        return userService.getUserById(userId);
    }
}
