package com.evdms.authservice.service;

import com.evdms.authservice.dto.AuthResponse;
import com.evdms.authservice.dto.LoginRequest;
import com.evdms.authservice.dto.RegisterRequest;
import com.evdms.authservice.dto.TokenResponse;
import com.evdms.authservice.entity.EmailVerificationToken;
import com.evdms.authservice.entity.Session;
import com.evdms.authservice.entity.User;
import com.evdms.authservice.repository.EmailVerificationTokenRepository;
import com.evdms.authservice.repository.SessionRepository;
import com.evdms.authservice.repository.UserRepository;
import com.evdms.authservice.service.JwtUtil;
import com.evdms.authservice.entity.PasswordResetToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private EmailVerificationTokenRepository emailVerificationTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RateLimiterService rateLimiterService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    public User register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);
        user.setEmailVerified(false);
        
        // Set role from request, default to DEALER_STAFF if not provided
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            try {
                user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                user.setRole(User.Role.DEALER_STAFF);
            }
        } else {
            user.setRole(User.Role.DEALER_STAFF);
        }
        
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        // Generate email verification token (for future implementation)
        // generateEmailVerificationToken(user);

        return user;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Rate limit by IP (5 req / 15 min)
        String key = "login:" + (request.getIpAddress() != null ? request.getIpAddress() : "unknown");
        if (!rateLimiterService.allow(key)) {
            throw new RuntimeException("Too many login attempts. Please try again later.");
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if account is locked
        if (user.getLockedUntil() != null && Instant.now().isBefore(user.getLockedUntil())) {
            throw new RuntimeException("Account is locked. Try again later.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            // Increment failed login attempts
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);

            // Lock account after 5 failed attempts
            if (user.getFailedLoginAttempts() >= 5) {
                user.setLockedUntil(Instant.now().plusSeconds(900)); // Lock for 15 minutes
            }

            userRepository.save(user);
            throw new RuntimeException("Invalid credentials");
        }

        // Check if account is active
        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        // Reset failed login attempts on successful login
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLastLogin(Instant.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(),
                user.getRole() != null ? user.getRole().toString() : "USER");
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        // Save session
        Session session = new Session();
        session.setUserId(user.getId());
        session.setRefreshToken(refreshToken);
        session.setDeviceInfo("{}"); // Will be populated from request headers
        session.setIpAddress(request.getIpAddress() != null ? request.getIpAddress() : "unknown");
        session.setExpiresAt(Instant.now().plusSeconds(7 * 24 * 60 * 60)); // 7 days
        session.setCreatedAt(Instant.now());
        sessionRepository.save(session);

        return new AuthResponse(token, refreshToken, user.getId().toString(), user.getEmail(), user.getFullName(),
                user.getRole() != null ? user.getRole().toString() : "USER");
    }

    @Transactional
    public void logout(String refreshToken) {
        Session session = sessionRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        sessionRepository.delete(session);
    }

    @Transactional
    public void logoutAll(UUID userId) {
        sessionRepository.deleteByUserId(userId);
    }

    public TokenResponse refreshToken(String refreshToken) {
        Session session = sessionRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        // Check if session expired
        if (Instant.now().isAfter(session.getExpiresAt())) {
            sessionRepository.delete(session);
            throw new RuntimeException("Refresh token expired");
        }

        User user = userRepository.findById(session.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtUtil.generateToken(user.getEmail(),
                user.getRole() != null ? user.getRole().toString() : "USER");
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        // Update session with new refresh token
        session.setRefreshToken(newRefreshToken);
        session.setExpiresAt(Instant.now().plusSeconds(7 * 24 * 60 * 60)); // 7 days
        sessionRepository.save(session);

        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    public boolean verifyToken(String token) {
        try {
            String email = jwtUtil.extractUsername(token);
            Optional<User> user = userRepository.findByEmail(email);
            return user.isPresent() && !jwtUtil.isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // Profile endpoints
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new org.springframework.security.authentication.AuthenticationCredentialsNotFoundException(
                    "Unauthorized");
        }
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateCurrentUser(String fullName, String avatarUrl) {
        User user = getCurrentUser();
        if (fullName != null && !fullName.isBlank())
            user.setFullName(fullName);
        if (avatarUrl != null && !avatarUrl.isBlank())
            user.setAvatarUrl(avatarUrl);
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    // Password management
    @Transactional
    public void changePassword(String currentPassword, String newPassword) {
        User user = getCurrentUser();
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password incorrect");
        }
        validatePasswordPolicy(newPassword);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        // revoke all sessions
        sessionRepository.deleteByUserId(user.getId());
    }

    @Autowired
    private com.evdms.authservice.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    public String createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(Instant.now().plusSeconds(60 * 60)); // 1 hour
        token.setCreatedAt(Instant.now());
        passwordResetTokenRepository.save(token);
        return token.getToken();
    }

    public void resetPassword(String tokenStr, String newPassword) {
        PasswordResetToken prt = passwordResetTokenRepository.findByTokenAndUsedFalse(tokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid or used token"));
        if (Instant.now().isAfter(prt.getExpiresAt())) {
            throw new RuntimeException("Token expired");
        }
        User user = prt.getUser();
        validatePasswordPolicy(newPassword);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);
        // revoke all sessions
        sessionRepository.deleteByUserId(user.getId());
    }

    private void validatePasswordPolicy(String password) {
        // min 8, 1 uppercase, 1 number, 1 special
        if (password == null || !password.matches("^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$")) {
            throw new RuntimeException("Password does not meet complexity requirements");
        }
    }

    @Transactional
    public void verifyEmail(String token) {
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (verificationToken.getUsed()) {
            throw new RuntimeException("Token already used");
        }

        if (LocalDateTime.now().isAfter(verificationToken.getExpiresAt())) {
            throw new RuntimeException("Token expired");
        }

        User user = userRepository.findById(UUID.fromString(verificationToken.getUserId().toString()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        emailVerificationTokenRepository.save(verificationToken);
    }

    private void generateEmailVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = new EmailVerificationToken(
                user.getId().getMostSignificantBits(),
                token,
                LocalDateTime.now().plusHours(24));
        emailVerificationTokenRepository.save(verificationToken);

        // TODO: Send email with verification link
        // emailService.sendVerificationEmail(user.getEmail(), token);
    }

    // Sessions management
    public java.util.List<Session> getUserSessions(UUID userId) {
        return sessionRepository.findByUserId(userId);
    }

    public void revokeSession(UUID sessionId, UUID userId) {
        Session s = sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        if (!s.getUserId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }
        sessionRepository.delete(s);
    }

    // Admin promotion (for testing/bootstrap)
    @Transactional
    public User promoteToAdmin(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.ADMIN);
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }
}
