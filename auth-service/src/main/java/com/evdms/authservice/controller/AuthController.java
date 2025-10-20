package com.evdms.authservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.evdms.authservice.dto.RegisterRequest;
import com.evdms.authservice.model.User;
import com.evdms.authservice.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Simple demo: create user and return
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword()); // TODO: hash password
        user.setFullName(request.getFullName());
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("Auth API is working!");
    }
}
