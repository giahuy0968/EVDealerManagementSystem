package com.evdms.authservice.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.evdms.authservice.dto.*;
import com.evdms.authservice.model.User;
import com.evdms.authservice.service.AuthService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(Map.of(
            "message", "Registration successful",
            "userId", user.getId()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<?> logoutAll(@RequestHeader("X-User-Id") String userId) {
        authService.logoutAll(UUID.fromString(userId));
        return ResponseEntity.ok(Map.of("message", "Logged out from all devices"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        TokenResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-token")
    public ResponseEntity<?> verifyToken(@Valid @RequestBody VerifyTokenRequest request) {
        boolean isValid = authService.verifyToken(request.getToken());
        return ResponseEntity.ok(Map.of(
            "valid", isValid,
            "message", isValid ? "Token is valid" : "Token is invalid or expired"
        ));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request.getToken());
        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("Auth API is working!");
    }
}
