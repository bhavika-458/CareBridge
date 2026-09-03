package com.carebridge.api_gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http) {

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                .authorizeExchange(exchange -> exchange

                        .pathMatchers("/auth/**").permitAll()

                        .pathMatchers("/oauth2/**").permitAll()

                        .pathMatchers("/login/oauth2/**").permitAll()

                        .pathMatchers("/actuator/**").permitAll()

                        .anyExchange().permitAll()
                )

                .build();
    }
}