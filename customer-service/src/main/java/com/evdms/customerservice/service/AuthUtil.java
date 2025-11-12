package com.evdms.customerservice.service;

import com.evdms.customerservice.service.JwtAuthentication;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class AuthUtil {
    
    public static JwtAuthentication getCurrentAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthentication jwtAuth) {
            return jwtAuth;
        }
        return null;
    }
    
    public static String getCurrentUserEmail() {
        JwtAuthentication auth = getCurrentAuth();
        return auth != null ? auth.getEmail() : null;
    }
    
    public static UUID getCurrentUserId() {
        JwtAuthentication auth = getCurrentAuth();
        return auth != null ? auth.getUserId() : null;
    }
    
    public static UUID getCurrentDealerId() {
        JwtAuthentication auth = getCurrentAuth();
        return auth != null ? auth.getDealerId() : null;
    }
    
    public static String getCurrentRole() {
        JwtAuthentication auth = getCurrentAuth();
        return auth != null ? auth.getRole() : null;
    }
    
    public static boolean hasRole(String role) {
        JwtAuthentication auth = getCurrentAuth();
        return auth != null && auth.hasRole(role);
    }
    
    public static boolean isAdmin() {
        return hasRole("ADMIN");
    }
    
    public static boolean isDealerManager() {
        return hasRole("DEALER_MANAGER");
    }
    
    public static boolean isDealerStaff() {
        return hasRole("DEALER_STAFF");
    }
}
