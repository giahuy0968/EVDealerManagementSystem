package com.evdms.authservice.config;

import com.evdms.authservice.service.CustomUserDetailsService;
import com.evdms.authservice.service.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
public class SecurityConfig {

        private final CustomUserDetailsService userDetailsService;

        public SecurityConfig(CustomUserDetailsService userDetailsService) {
                this.userDetailsService = userDetailsService;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter)
                        throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .headers(headers -> headers
                                                .frameOptions(frame -> frame.sameOrigin()) // Allow H2 console
                                                .referrerPolicy(ref -> ref.policy(
                                                                org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.SAME_ORIGIN)))
                                .authorizeHttpRequests(auth -> auth
                                                // Public auth endpoints
                                                .requestMatchers("/api/v1/auth/register").permitAll()
                                                .requestMatchers("/api/v1/auth/login").permitAll()
                                                .requestMatchers("/api/v1/auth/refresh").permitAll()
                                                .requestMatchers("/api/v1/auth/verify").permitAll()
                                                .requestMatchers("/api/v1/auth/forgot-password").permitAll()
                                                .requestMatchers("/api/v1/auth/reset-password").permitAll()
                                                .requestMatchers("/api/v1/auth/verify-email").permitAll()
                                                .requestMatchers("/api/v1/auth/logout-all").permitAll()
                                                .requestMatchers("/api/v1/auth/promote-to-admin").permitAll()
                                                .requestMatchers("/api/v1/auth/test").permitAll()
                                                // Actuator health/info for monitoring
                                                .requestMatchers("/actuator/**").permitAll()
                                                // H2 Console (dev only)
                                                .requestMatchers("/h2-console/**").permitAll()
                                                // Static or actuator if needed
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration
                                .setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174",
                                                "http://localhost:5175"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(
                                List.of("Authorization", "Content-Type", "X-Requested-With", "X-User-Id"));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }
}
