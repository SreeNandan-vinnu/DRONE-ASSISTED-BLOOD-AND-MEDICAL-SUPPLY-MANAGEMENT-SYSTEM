package com.example.dronebackend.controller;

import com.example.dronebackend.model.Log;
import com.example.dronebackend.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class LogController {

    @Autowired
    private LogRepository logRepo;

    @GetMapping
    public List<Log> getAllLogs() {
        return logRepo.findAll();
    }

    @PostMapping
    public Log addLog(@RequestBody Log log) {
        return logRepo.save(log);
    }

    @PutMapping("/{id}")
    public Log updateLog(@PathVariable Long id, @RequestBody Log logDetails) {
        Optional<Log> optionalLog = logRepo.findById(id);
        if (optionalLog.isPresent()) {
            Log log = optionalLog.get();
            log.setTimestamp(logDetails.getTimestamp());
            log.setMessage(logDetails.getMessage());
            log.setDrone(logDetails.getDrone());
            return logRepo.save(log);
        } else {
            return null; // Or throw an exception
        }
    }

    @DeleteMapping("/{id}")
    public void deleteLog(@PathVariable Long id) {
        logRepo.deleteById(id);
    }
}
