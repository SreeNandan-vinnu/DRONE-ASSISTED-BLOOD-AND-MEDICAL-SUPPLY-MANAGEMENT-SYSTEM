package com.example.dronebackend.controller;

import com.example.dronebackend.model.Inventory;
import com.example.dronebackend.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepo;

    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryRepo.findAll();
    }

    @PostMapping
    public Inventory addInventory(@RequestBody Inventory inventory) {
        return inventoryRepo.save(inventory);
    }

    @PutMapping("/{id}")
    public Inventory updateInventory(@PathVariable Long id, @RequestBody Inventory inventoryDetails) {
        Optional<Inventory> optionalInventory = inventoryRepo.findById(id);
        if (optionalInventory.isPresent()) {
            Inventory inventory = optionalInventory.get();
            inventory.setName(inventoryDetails.getName());
            inventory.setQuantity(inventoryDetails.getQuantity());
            inventory.setLocation(inventoryDetails.getLocation());
            return inventoryRepo.save(inventory);
        } else {
            return null; // Or throw an exception
        }
    }

    @DeleteMapping("/{id}")
    public void deleteInventory(@PathVariable Long id) {
        inventoryRepo.deleteById(id);
    }
}
