package com.evdms.authservice.service;

import com.evdms.authservice.dto.AuthResponse;
import com.evdms.authservice.dto.LoginRequest;
import com.evdms.authservice.dto.RegisterRequest;
import com.evdms.authservice.dto.TokenResponse;
import com.evdms.authservice.model.EmailVerificationToken;
import com.evdms.authservice.model.Session;
import com.evdms.authservice.model.User;
import com.evdms.authservice.repository.EmailVerificationTokenRepository;
import com.evdms.authservice.repository.SessionRepository;
import com.evdms.authservice.repository.UserRepository;
import com.evdms.authservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
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
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        // Generate email verification token (for future implementation)
        // generateEmailVerificationToken(user);

        return user;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
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

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole() != null ? user.getRole().toString() : "USER");
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

        return new AuthResponse(token, refreshToken, user.getEmail(), user.getFullName(), 
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

        String newAccessToken = jwtUtil.generateToken(user.getEmail(), user.getRole() != null ? user.getRole().toString() : "USER");
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
                LocalDateTime.now().plusHours(24)
        );
        emailVerificationTokenRepository.save(verificationToken);

        // TODO: Send email with verification link
        // emailService.sendVerificationEmail(user.getEmail(), token);
    }
}
