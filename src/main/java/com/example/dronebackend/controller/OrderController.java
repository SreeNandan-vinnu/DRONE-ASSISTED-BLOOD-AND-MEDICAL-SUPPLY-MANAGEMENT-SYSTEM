package com.example.dronebackend.controller;

import com.example.dronebackend.model.Order;
import com.example.dronebackend.model.User;
import com.example.dronebackend.repository.OrderRepository;
import com.example.dronebackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private UserRepository userRepo;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<Order> getOrdersByHospital(@PathVariable Long hospitalId) {
        return orderRepo.findAll().stream()
                .filter(order -> order.getHospital() != null && order.getHospital().getId().equals(hospitalId))
                .collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Integer userId) {
        return orderRepo.findAll().stream()
                .filter(order -> order.getUser() != null && order.getUser().getUser_id().equals(userId))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderRepo.findById(id);
        if (order.isPresent()) {
            return ResponseEntity.ok(order.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Order addOrder(@RequestBody Order order) {
        // Generate orderId if not provided
        if (order.getOrderId() == null || order.getOrderId().isEmpty()) {
            order.setOrderId("#ORD-" + (2400 + (int)(Math.random() * 100)));
        }
        // Set default status if not provided
        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("Preparing");
        }
        // Set default ETA if not provided
        if (order.getEta() == null || order.getEta().isEmpty()) {
            order.setEta("15 mins");
        }
        return orderRepo.save(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        Optional<Order> optionalOrder = orderRepo.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setOrderId(orderDetails.getOrderId());
            order.setItem(orderDetails.getItem());
            order.setQuantity(orderDetails.getQuantity());
            order.setStatus(orderDetails.getStatus());
            order.setEta(orderDetails.getEta());
            order.setUrgency(orderDetails.getUrgency());
            order.setTemperature(orderDetails.getTemperature());
            order.setDeliveryAddress(orderDetails.getDeliveryAddress());
            order.setHospital(orderDetails.getHospital());
            order.setUser(orderDetails.getUser());
            return ResponseEntity.ok(orderRepo.save(order));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Order> optionalOrder = orderRepo.findById(id);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setStatus(status);
            if ("Delivered".equals(status)) {
                order.setEta("-");
            }
            return ResponseEntity.ok(orderRepo.save(order));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (orderRepo.existsById(id)) {
            orderRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
