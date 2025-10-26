package com.example.dronebackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId; // e.g., #ORD-2401

    private String item; // e.g., "Blood (O+)", "Insulin"

    private String quantity; // e.g., "4 Units", "10 Vials"

    private String status; // "Preparing", "In-Flight", "Delivered"

    private String eta; // "12 mins", "5 mins", "-"

    private String urgency; // "high", "medium", "low"

    private Double temperature; // temperature requirement in °C

    private String deliveryAddress;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // who placed the order

    public Order() {
    }

    public Order(String orderId, String item, String quantity, String status, String eta, String urgency, Double temperature, String deliveryAddress, Hospital hospital, User user) {
        this.orderId = orderId;
        this.item = item;
        this.quantity = quantity;
        this.status = status;
        this.eta = eta;
        this.urgency = urgency;
        this.temperature = temperature;
        this.deliveryAddress = deliveryAddress;
        this.hospital = hospital;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEta() {
        return eta;
    }

    public void setEta(String eta) {
        this.eta = eta;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
