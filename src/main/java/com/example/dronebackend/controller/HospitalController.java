package com.example.dronebackend.controller;

import com.example.dronebackend.model.Hospital;
import com.example.dronebackend.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/hospitals")
public class HospitalController {

    @Autowired
    private HospitalRepository hospitalRepo;

    @GetMapping
    public List<Hospital> getAllHospitals() {
        return hospitalRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable Long id) {
        Optional<Hospital> hospital = hospitalRepo.findById(id);
        if (hospital.isPresent()) {
            return ResponseEntity.ok(hospital.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Hospital addHospital(@RequestBody Hospital hospital) {
        return hospitalRepo.save(hospital);
    }

    @PutMapping("/{id}")
    public Hospital updateHospital(@PathVariable Long id, @RequestBody Hospital hospitalDetails) {
        Optional<Hospital> optionalHospital = hospitalRepo.findById(id);
        if (optionalHospital.isPresent()) {
            Hospital hospital = optionalHospital.get();
            hospital.setName(hospitalDetails.getName());
            hospital.setAddress(hospitalDetails.getAddress());
            return hospitalRepo.save(hospital);
        } else {
            return null; // Or throw an exception
        }
    }

    @DeleteMapping("/{id}")
    public void deleteHospital(@PathVariable Long id) {
        hospitalRepo.deleteById(id);
    }
}
