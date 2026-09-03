package com.carebridge.auth_service.config;

import com.carebridge.auth_service.security.JwtAuthenticationFilter;
import com.carebridge.auth_service.security.OAuth2SuccessHandler;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final OAuth2SuccessHandler oauth2SuccessHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            OAuth2SuccessHandler oauth2SuccessHandler,
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.oauth2SuccessHandler = oauth2SuccessHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Public endpoints
                .requestMatchers("/", "/error").permitAll()

                // OAuth2 endpoints
                .requestMatchers(
                        "/oauth2/**",
                        "/login/**"
                ).permitAll()

                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            .oauth2Login(oauth -> oauth
                .successHandler(oauth2SuccessHandler)
            )

            // JWT filter
            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}