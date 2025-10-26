package com.example.dronebackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payloads")
public class Payload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double weight;

    @OneToOne
    @JoinColumn(name = "mission_id")
    private Mission mission;

    public Payload() {
    }

    public Payload(String name, double weight, Mission mission) {
        this.name = name;
        this.weight = weight;
        this.mission = mission;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public Mission getMission() {
        return mission;
    }

    public void setMission(Mission mission) {
        this.mission = mission;
    }
}
