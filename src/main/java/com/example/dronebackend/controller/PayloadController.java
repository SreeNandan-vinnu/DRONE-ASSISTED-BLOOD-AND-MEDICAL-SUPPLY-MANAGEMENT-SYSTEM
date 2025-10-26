package com.example.dronebackend.controller;

import com.example.dronebackend.model.Payload;
import com.example.dronebackend.repository.PayloadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payloads")
@CrossOrigin(origins = "*")
public class PayloadController {

    @Autowired
    private PayloadRepository payloadRepo;

    @GetMapping
    public List<Payload> getAllPayloads() {
        return payloadRepo.findAll();
    }

    @PostMapping
    public Payload addPayload(@RequestBody Payload payload) {
        return payloadRepo.save(payload);
    }

    @PutMapping("/{id}")
    public Payload updatePayload(@PathVariable Long id, @RequestBody Payload payloadDetails) {
        Optional<Payload> optionalPayload = payloadRepo.findById(id);
        if (optionalPayload.isPresent()) {
            Payload payload = optionalPayload.get();
            payload.setName(payloadDetails.getName());
            payload.setWeight(payloadDetails.getWeight());
            payload.setMission(payloadDetails.getMission());
            return payloadRepo.save(payload);
        } else {
            return null; // Or throw an exception
        }
    }

    @DeleteMapping("/{id}")
    public void deletePayload(@PathVariable Long id) {
        payloadRepo.deleteById(id);
    }
}
