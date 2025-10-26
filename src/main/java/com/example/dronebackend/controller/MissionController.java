package com.example.dronebackend.controller;

import com.example.dronebackend.model.Mission;
import com.example.dronebackend.repository.MissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/missions")
@CrossOrigin(origins = "*")
public class MissionController {

    @Autowired
    private MissionRepository missionRepo;

    @GetMapping
    public List<Mission> getAllMissions() {
        return missionRepo.findAll();
    }

    @PostMapping
    public Mission addMission(@RequestBody Mission mission) {
        return missionRepo.save(mission);
    }

    @PutMapping("/{id}")
    public Mission updateMission(@PathVariable Long id, @RequestBody Mission missionDetails) {
        Optional<Mission> optionalMission = missionRepo.findById(id);
        if (optionalMission.isPresent()) {
            Mission mission = optionalMission.get();
            mission.setName(missionDetails.getName());
            mission.setDescription(missionDetails.getDescription());
            mission.setDrone(missionDetails.getDrone());
            return missionRepo.save(mission);
        } else {
            return null; // Or throw an exception
        }
    }

    @DeleteMapping("/{id}")
    public void deleteMission(@PathVariable Long id) {
        missionRepo.deleteById(id);
    }
}
