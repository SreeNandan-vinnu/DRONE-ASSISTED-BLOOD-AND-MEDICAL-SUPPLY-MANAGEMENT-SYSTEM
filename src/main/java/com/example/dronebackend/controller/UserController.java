package com.example.dronebackend.controller;

import com.example.dronebackend.model.User;
import com.example.dronebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        Optional<User> user = userRepo.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        return userRepo.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        List<User> users = userRepo.findAll();
        for (User user : users) {
            if (user.getUsername().equals(loginUser.getUsername()) &&
                user.getPassword().equals(loginUser.getPassword())) {
                // Return user with role information for frontend
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {
        // Check if username already exists
        List<User> existingUsers = userRepo.findAll();
        for (User user : existingUsers) {
            if (user.getUsername().equals(newUser.getUsername())) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
        }
        // Set default role if not provided
        if (newUser.getRole() == null || newUser.getRole().isEmpty()) {
            newUser.setRole("hospital"); // default role
        }
        User savedUser = userRepo.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User userDetails) {
        Optional<User> optionalUser = userRepo.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUsername(userDetails.getUsername());
            user.setPassword(userDetails.getPassword());
            user.setRole(userDetails.getRole());
            user.setEmail(userDetails.getEmail());
            user.setFullName(userDetails.getFullName());
            return ResponseEntity.ok(userRepo.save(user));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
