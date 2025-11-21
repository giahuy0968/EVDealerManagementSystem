package com.evdms.authservice.config;

import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Simple password encoder that stores passwords in plain text (NO ENCRYPTION)
 * WARNING: Only use this for development/testing. NEVER use in production!
 */
public class NoOpPasswordEncoder implements PasswordEncoder {

    @Override
    public String encode(CharSequence rawPassword) {
        // Return password as-is without any encoding
        return rawPassword.toString();
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        // Simple string comparison
        return rawPassword.toString().equals(encodedPassword);
    }
}
