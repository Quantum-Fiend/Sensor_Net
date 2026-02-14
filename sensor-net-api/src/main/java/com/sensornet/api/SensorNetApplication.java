package com.sensornet.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.sensornet")
@EnableJpaRepositories(basePackages = "com.sensornet.core.repository")
@EntityScan(basePackages = "com.sensornet.core.entity")
public class SensorNetApplication {
    public static void main(String[] args) {
        SpringApplication.run(SensorNetApplication.class, args);
    }
}
