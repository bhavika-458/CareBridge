package com.carebridge.auth_service.security;

import com.carebridge.auth_service.entity.User;
import com.carebridge.auth_service.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(
            UserRepository userRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2AuthenticationToken oauthToken =
                (OAuth2AuthenticationToken) authentication;

        OAuth2User oauthUser = oauthToken.getPrincipal();

        String name = oauthUser.getAttribute("name");
        String email = oauthUser.getAttribute("email");
        String providerId = oauthUser.getAttribute("sub");

        String provider =
                oauthToken.getAuthorizedClientRegistrationId();

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {

                    User newUser = new User(
                            name,
                            email,
                            provider,
                            providerId
                    );

                    return userRepository.save(newUser);
                });

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        response.setContentType("text/plain");

        response.getWriter().write(
                "Google Login Successful!\n\n" +
                "Email: " + user.getEmail() + "\n\n" +
                "Role: " + user.getRole() + "\n\n" +
                "JWT Token:\n" + token
        );
    }
}