package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.Loginresponse;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.SignupResponse;
import com.example.demo.model.User;
import com.example.demo.repository.AuthRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthRepository authRepository;

    @Value("${jwt.secret}")
    private String secretString;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final long JWT_EXPIRATION = 86400000; // 24 hours in milliseconds

    /**
     * Login user with email and password.
     * Validates credentials from the database and generates JWT token.
     */
    public Loginresponse login(LoginRequest loginRequest) {
        Loginresponse response = new Loginresponse();

        try {
            // Find user by email in database
            Optional<User> userOptional = authRepository.findByEmail(loginRequest.getEmail());

            if (!userOptional.isPresent()) {
                response.setSuccess(false);
                response.setMessage("User not found");
                return response;
            }

            User user = userOptional.get();

            // Check if user is active
            if (!user.isActive()) {
                response.setSuccess(false);
                response.setMessage("User account is inactive");
                return response;
            }

            // Validate password - compare plain text password with stored hashed password
            // If password is not hashed in database, use direct comparison for now
            if (!validatePassword(loginRequest.getPassword(), user.getPassword())) {
                response.setSuccess(false);
                response.setMessage("Invalid password");
                return response;
            }

            // Generate JWT token
            String token = generateJwtToken(user);

            // Build successful response
            response.setSuccess(true);
            response.setMessage("Login successful");
            response.setToken(token);
            response.setUserId(user.getId());
            response.setEmail(user.getEmail());
            response.setFirstName(user.getFirstName());
            response.setLastName(user.getLastName());
            response.setRole(user.getRole());

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Login failed: " + e.getMessage());
        }

        return response;
    }

    /**
     * Validate password - checks against database stored password.
     * If password is hashed, use BCrypt comparison.
     * If password is plain text, use direct comparison.
     */
    private boolean validatePassword(String plainPassword, String storedPassword) {
        // Check if stored password is hashed (BCrypt hashes start with $2a$, $2b$, or
        // $2y$)
        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")
                || storedPassword.startsWith("$2y$")) {
            return passwordEncoder.matches(plainPassword, storedPassword);
        } else {
            // Direct comparison for plain text passwords
            return plainPassword.equals(storedPassword);
        }
    }

    /**
     * Register a new user with email, password, and full name.
     * Validates that user doesn't exist and creates a new user account.
     */
    public SignupResponse signup(SignupRequest signupRequest) {
        SignupResponse response = new SignupResponse();

        try {
            // Validate input
            if (signupRequest.getEmail() == null || signupRequest.getEmail().isEmpty()) {
                response.setSuccess(false);
                response.setMessage("Email is required");
                return response;
            }

            if (signupRequest.getPassword() == null || signupRequest.getPassword().length() < 6) {
                response.setSuccess(false);
                response.setMessage("Password must be at least 6 characters");
                return response;
            }

            if (signupRequest.getFullName() == null || signupRequest.getFullName().trim().isEmpty()) {
                response.setSuccess(false);
                response.setMessage("Full name is required");
                return response;
            }

            // Check if user already exists
            Optional<User> existingUser = authRepository.findByEmail(signupRequest.getEmail());
            if (existingUser.isPresent()) {
                response.setSuccess(false);
                response.setMessage("User with this email already exists");
                return response;
            }

            // Split full name into first and last name
            String[] nameParts = signupRequest.getFullName().trim().split(" ", 2);
            String firstName = nameParts[0];
            String lastName = nameParts.length > 1 ? nameParts[1] : "";

            // Hash password using BCrypt
            String hashedPassword = passwordEncoder.encode(signupRequest.getPassword());

            // Create new user
            User newUser = new User();
            newUser.setEmail(signupRequest.getEmail());
            newUser.setPassword(hashedPassword);
            newUser.setFirstName(firstName);
            newUser.setLastName(lastName);
            newUser.setRole("USER");
            newUser.setActive(true);

            // Save user to database
            User savedUser = authRepository.save(newUser);

            // Generate JWT token for new user
            String token = generateJwtToken(savedUser);

            // Build successful response
            response.setSuccess(true);
            response.setMessage("User registered successfully");
            response.setToken(token);

            SignupResponse.UserDto userDto = new SignupResponse.UserDto();
            userDto.setId(savedUser.getId());
            userDto.setEmail(savedUser.getEmail());
            userDto.setFullName(savedUser.getFirstName() + " " + savedUser.getLastName());
            userDto.setRole(savedUser.getRole());
            response.setUser(userDto);

        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("Signup failed: " + e.getMessage());
        }

        return response;
    }
    private String generateJwtToken(User user) {
        byte[] keyBytes = Decoders.BASE64.decode(secretString);
        SecretKey secretKey = Keys.hmacShaKeyFor(keyBytes);

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole())
                .claim("firstName", user.getFirstName())
                .claim("lastName", user.getLastName())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(secretKey)
                .compact();
    }
}
