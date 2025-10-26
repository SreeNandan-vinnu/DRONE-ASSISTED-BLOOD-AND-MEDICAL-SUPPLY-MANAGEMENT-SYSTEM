package com.example.dronebackend.repository;

import com.example.dronebackend.model.Payload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayloadRepository extends JpaRepository<Payload, Long> {
}
