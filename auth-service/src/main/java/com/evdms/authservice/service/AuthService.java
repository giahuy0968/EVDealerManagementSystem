package com.evdms.authservice.service;

import com.evdms.authservice.dto.AuthResponse;
import com.evdms.authservice.dto.LoginRequest;
import com.evdms.authservice.dto.RegisterRequest;
import com.evdms.authservice.model.User;
import com.evdms.authservice.repository.UserRepository;
import com.evdms.authservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User register(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);
        userRepository.save(user);
        return user;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole() != null ? user.getRole().toString() : "USER");
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return new AuthResponse(token, refreshToken, user.getEmail(), user.getFullName(), 
                user.getRole() != null ? user.getRole().toString() : "USER");
    }
}
