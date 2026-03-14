package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loginresponse {
    private String token;
    private String message;
    private boolean success;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
