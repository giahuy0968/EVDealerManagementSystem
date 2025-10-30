package com.evdms.customerservice.security;

import io.jsonwebtoken.Claims;
import lombok.Getter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

@Getter
public class JwtAuthentication implements Authentication {
    private final String email;
    private final UUID userId;
    private final UUID dealerId;
    private final String role;
    private final Collection<? extends GrantedAuthority> authorities;
    private boolean authenticated = true;

    public JwtAuthentication(Claims claims, Collection<? extends GrantedAuthority> authorities) {
        this.email = claims.getSubject();
        this.authorities = authorities;

        // Extract user_id
        Object userIdObj = claims.get("user_id");
        this.userId = userIdObj != null ? UUID.fromString(userIdObj.toString()) : null;

        // Extract dealer_id
        Object dealerIdObj = claims.get("dealer_id");
        this.dealerId = dealerIdObj != null ? UUID.fromString(dealerIdObj.toString()) : null;

        // Extract role
        Object roleObj = claims.get("role");
        if (roleObj == null)
            roleObj = claims.get("roles");
        this.role = roleObj != null ? roleObj.toString() : "";
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getDetails() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return email;
    }

    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        this.authenticated = isAuthenticated;
    }

    @Override
    public String getName() {
        return email;
    }

    public boolean hasRole(String roleName) {
        return authorities.stream().anyMatch(a -> a.getAuthority().equals(roleName));
    }
}
