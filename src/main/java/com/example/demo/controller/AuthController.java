package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.Loginresponse;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Login endpoint - accepts email and password, returns JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<Loginresponse> login(@RequestBody LoginRequest loginRequest) {
        Loginresponse response = authService.login(loginRequest);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
