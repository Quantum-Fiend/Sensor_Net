package com.sensornet.core.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "telemetry_data")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TelemetryData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(nullable = false)
    private String key; // e.g. temperature, humidity, energy_usage

    @Column(nullable = false)
    private Double value;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
