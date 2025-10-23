package com.evdms.authservice.controller;

import com.evdms.authservice.model.User;
import com.evdms.authservice.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserAdminController {

    private final UserRepository userRepository;

    public UserAdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") UUID id, @RequestBody Map<String, Object> body) {
        User u = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (body.containsKey("fullName")) u.setFullName((String) body.get("fullName"));
        if (body.containsKey("email")) u.setEmail((String) body.get("email"));
        if (body.containsKey("username")) u.setUsername((String) body.get("username"));
        if (body.containsKey("avatarUrl")) u.setAvatarUrl((String) body.get("avatarUrl"));
        u.setUpdatedAt(Instant.now());
        return ResponseEntity.ok(userRepository.save(u));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> softDelete(@PathVariable("id") UUID id) {
        User u = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        u.setActive(false);
        u.setDeletedAt(Instant.now());
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "User deactivated"));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeRole(@PathVariable("id") UUID id, @RequestBody Map<String, String> body) {
        User u = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String role = body.get("role");
        u.setRole(User.Role.valueOf(role));
        u.setUpdatedAt(Instant.now());
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "Role updated", "role", u.getRole().toString()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable("id") UUID id, @RequestBody Map<String, Boolean> body) {
        User u = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        boolean active = body.getOrDefault("isActive", true);
        u.setActive(active);
        u.setUpdatedAt(Instant.now());
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "Status updated", "isActive", u.isActive()));
    }
}
