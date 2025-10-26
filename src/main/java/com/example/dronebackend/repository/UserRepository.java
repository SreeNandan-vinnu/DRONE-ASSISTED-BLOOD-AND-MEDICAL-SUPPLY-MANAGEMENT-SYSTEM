package com.example.dronebackend.repository;

import com.example.dronebackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // Additional query methods can be added here if needed
}
