package com.sensornet.core.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "devices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String deviceId; // External unique ID e.g. MAC address

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // e.g. TEMPERATURE, PLUG, CAMERA

    private String location; // e.g. Living Room

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime lastSeen;

    public enum Status {
        ONLINE, OFFLINE, MAINTENANCE
    }
}
