package com.example.demo.service;

import com.example.demo.dto.MemberResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all active members/users with their basic information (name and email)
     */
    public List<MemberResponse> getAllMembers() {
        List<User> users = userRepository.findByActive(true);
        
        return users.stream()
                .map(user -> new MemberResponse(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail()
                ))
                .collect(Collectors.toList());
    }
}
