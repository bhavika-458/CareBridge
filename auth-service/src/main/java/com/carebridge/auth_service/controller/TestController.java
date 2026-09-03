package com.carebridge.auth_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/protected/test")
    public String protectedTest() {
        return "JWT Authentication Successful";
    }
}