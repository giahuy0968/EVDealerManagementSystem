package com.evdms.customerservice.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;

public class SecurityUtil {
    public static String getUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? String.valueOf(auth.getPrincipal()) : null;
    }

    public static boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(role));
    }

    @SuppressWarnings("unchecked")
    public static String getDealerIdFromClaims(Map<String, Object> claims) {
        Object dealerId = claims.get("dealer_id");
        return dealerId != null ? dealerId.toString() : null;
    }
}
