package com.evdms.authservice.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.evdms.authservice.service.*;
import com.evdms.authservice.entity.User;
import com.evdms.authservice.service.AuthService;
import com.evdms.authservice.service.TokenBlacklistService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "userId", user.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody LogoutRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        authService.logout(request.getRefreshToken());
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // blacklist access token for 15 minutes
            tokenBlacklistService.blacklist(token, 15 * 60);
        }
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

    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader(name = "Authorization", required = false) String authHeader) {
        String token = (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
        boolean isValid = token != null && authService.verifyToken(token);
        return ResponseEntity.ok(Map.of(
                "valid", isValid,
                "message", isValid ? "Token is valid" : "Token is invalid or expired"));
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

    // Password management
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String token = authService.createPasswordResetToken(email);
        // TODO: send email; return token only for dev convenience
        return ResponseEntity.ok(Map.of("message", "Reset email sent", "token", token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        authService.resetPassword(body.get("token"), body.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        authService.changePassword(body.get("currentPassword"), body.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    // Profile
    @GetMapping("/profile")
    public ResponseEntity<?> profile() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "username", user.getUsername(),
                "fullName", user.getFullName(),
                "role", user.getRole() != null ? user.getRole().toString() : "USER",
                "avatarUrl", user.getAvatarUrl()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body) {
        User u = authService.updateCurrentUser(body.get("fullName"), body.get("avatarUrl"));
        return ResponseEntity
                .ok(Map.of("message", "Profile updated", "fullName", u.getFullName(), "avatarUrl", u.getAvatarUrl()));
    }

    // Sessions
    @GetMapping("/sessions")
    public ResponseEntity<?> getSessions() {
        User u = authService.getCurrentUser();
        java.util.List<com.evdms.authservice.entity.Session> sessions = authService.getUserSessions(u.getId());
        return ResponseEntity.ok(sessions);
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<?> revokeSession(@PathVariable("id") String id) {
        User u = authService.getCurrentUser();
        authService.revokeSession(java.util.UUID.fromString(id), u.getId());
        return ResponseEntity.ok(Map.of("message", "Session revoked"));
    }
}
