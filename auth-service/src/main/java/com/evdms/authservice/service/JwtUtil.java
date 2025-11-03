package com.evdms.authservice.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    private final SecretKey key;
    private static final long EXPIRATION_TIME = 900000; // 15 minutes
    private static final long REFRESH_EXPIRATION_TIME = 604800000; // 7 days

    public JwtUtil(
            @Value("${security.jwt.secret:this-is-a-very-long-secret-key-for-jwt-token-validation-minimum-256-bits-required}") String secret) {
        // Accept either a base64-encoded secret or a plain-text secret. For plain text,
        // derive a 256-bit key using SHA-256 to satisfy HS256 requirements.
        byte[] keyBytes;
        try {
            keyBytes = io.jsonwebtoken.io.Decoders.BASE64.decode(secret);
        } catch (Exception ignored) {
            keyBytes = null;
        }
        if (keyBytes == null || keyBytes.length == 0) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                keyBytes = md.digest(secret.getBytes(StandardCharsets.UTF_8));
            } catch (Exception e) {
                throw new IllegalStateException("Failed to initialize JWT key", e);
            }
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    private SecretKey getSigningKey() {
        return key;
    }

    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, email, EXPIRATION_TIME);
    }

    public String generateRefreshToken(String email) {
        return createToken(new HashMap<>(), email, REFRESH_EXPIRATION_TIME);
    }

    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token, String email) {
        return (email.equals(extractEmail(token)) && !isTokenExpired(token));
    }
}
