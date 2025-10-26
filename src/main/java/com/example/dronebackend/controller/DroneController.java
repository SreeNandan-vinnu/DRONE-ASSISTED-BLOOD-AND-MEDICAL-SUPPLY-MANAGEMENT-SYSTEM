package com.example.dronebackend.controller;

import com.example.dronebackend.model.Drone;
import com.example.dronebackend.repository.DroneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drones")
@CrossOrigin(origins = "*")
public class DroneController {

    @Autowired
    private DroneRepository droneRepo;

    @GetMapping
    public List<Drone> getAllDrones() {
        return droneRepo.findAll();
    }

    @PostMapping
    public Drone addDrone(@RequestBody Drone drone) {
        return droneRepo.save(drone);
    }

    @PutMapping("/{id}")
    public Drone updateDrone(@PathVariable Long id, @RequestBody Drone droneDetails) {
        Optional<Drone> optionalDrone = droneRepo.findById(id);
        if (optionalDrone.isPresent()) {
            Drone drone = optionalDrone.get();
            drone.setModel(droneDetails.getModel());
            drone.setBatteryCapacity(droneDetails.getBatteryCapacity());
            drone.setStatus(droneDetails.getStatus());
            return droneRepo.save(drone);
        } else {
            return null; // Or throw an exception
        }
    }

    @DeleteMapping("/{id}")
    public void deleteDrone(@PathVariable Long id) {
        droneRepo.deleteById(id);
    }
}
