package com.evdms.authservice.service;

public class AuthResponse {
    private String token;
    private String refreshToken;
    private String email;
    private String fullName;
    private String role;

    public AuthResponse(String token, String refreshToken, String email, String fullName, String role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
