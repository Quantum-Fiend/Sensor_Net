package com.sensornet.core.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "alert_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String telemetryKey; // e.g. temperature

    @Column(nullable = false)
    private String operator; // e.g. >, <, ==

    @Column(nullable = false)
    private Double threshold;

    @Enumerated(EnumType.STRING)
    private Alert.Severity severity;

    private boolean enabled;
}
