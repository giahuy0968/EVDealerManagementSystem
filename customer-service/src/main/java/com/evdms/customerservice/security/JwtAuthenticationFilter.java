package com.evdms.customerservice.security;

import com.evdms.customerservice.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Optional<Claims> claimsOpt = jwtUtil.parseToken(token);
                if (claimsOpt.isPresent()) {
                    Claims claims = claimsOpt.get();
                    Collection<? extends GrantedAuthority> authorities = extractAuthorities(claims);
                    JwtAuthentication authentication = new JwtAuthentication(claims, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception ignored) {
            }
        }
        filterChain.doFilter(request, response);
    }

    private Collection<? extends GrantedAuthority> extractAuthorities(Claims claims) {
        Object roleClaim = claims.get("roles");
        if (roleClaim == null)
            roleClaim = claims.get("role");
        if (roleClaim instanceof List<?> list) {
            return list.stream().map(Object::toString).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
        }
        if (roleClaim instanceof String s) {
            return List.of(new SimpleGrantedAuthority(s));
        }
        return List.of();
    }
}
