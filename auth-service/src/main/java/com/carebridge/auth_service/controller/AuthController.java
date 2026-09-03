package com.carebridge.auth_service.controller;

import com.carebridge.auth_service.entity.User;
import com.carebridge.auth_service.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/")
    public String home() {
        return "CareBridge Auth Service is running";
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(Authentication authentication) {

        String email = authentication.getName();

        Optional<User> user =
                userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }

        return ResponseEntity.ok(user.get());
    }
}