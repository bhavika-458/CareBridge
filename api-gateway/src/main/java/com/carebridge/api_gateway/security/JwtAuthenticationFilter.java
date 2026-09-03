package com.carebridge.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    private static final String SECRET_KEY =
            "CareBridgeSecretKeyForJWTAuthentication2026Secure";

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            WebFilterChain chain) {

        String path = exchange.getRequest()
                .getURI()
                .getPath();

        System.out.println(
                ">>> JwtAuthenticationFilter EXECUTED: " + path
        );

        // Public endpoints
        if (path.startsWith("/auth/")
                || path.equals("/auth")
                || path.startsWith("/oauth2/")
                || path.startsWith("/login/")
                || path.equals("/actuator")
                || path.startsWith("/actuator/")) {

            return chain.filter(exchange);
        }

        String authorizationHeader =
                exchange.getRequest()
                        .getHeaders()
                        .getFirst("Authorization");

        // JWT not provided
        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            exchange.getResponse()
                    .setStatusCode(HttpStatus.UNAUTHORIZED);

            return exchange.getResponse().setComplete();
        }

        String token = authorizationHeader.substring(7);

        try {

            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String email = claims.getSubject();

            String role = claims.get("role", String.class);

            if (role == null || role.isBlank()) {
                role = "USER";
            }

            System.out.println(
                    ">>> JWT User: " + email
            );

            System.out.println(
                    ">>> JWT Role: " + role
            );

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.singletonList(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + role
                                    )
                            )
                    );

            exchange.getAttributes()
                    .put("userEmail", email);

            exchange.getAttributes()
                    .put("userRole", role);

            return chain.filter(exchange)
                    .contextWrite(
                            ReactiveSecurityContextHolder
                                    .withAuthentication(authentication)
                    );

        } catch (Exception e) {

            e.printStackTrace();

            exchange.getResponse()
                    .setStatusCode(HttpStatus.UNAUTHORIZED);

            return exchange.getResponse().setComplete();
        }
    }
}