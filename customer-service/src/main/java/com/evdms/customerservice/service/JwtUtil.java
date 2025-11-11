package com.evdms.customerservice.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Optional;

@Component
public class JwtUtil {

    private final SecretKey key;

    public JwtUtil(@Value("${security.jwt.secret}") String secret) {
        // Accept either a base64-encoded secret or a plain-text secret. For plain text,
        // derive a 256-bit key using SHA-256 to satisfy HS256 requirements.
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secret);
        } catch (Exception ignored) {
            keyBytes = null;
        }
        if (keyBytes == null || keyBytes.length == 0) {
            try {
                java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
                keyBytes = md.digest(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            } catch (Exception e) {
                throw new IllegalStateException("Failed to initialize JWT key", e);
            }
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public Optional<Claims> parseToken(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            return Optional.of(claims);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
