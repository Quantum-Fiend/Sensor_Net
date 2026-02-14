package com.sensornet.mqtt.service;

import com.sensornet.core.entity.Device;
import com.sensornet.core.entity.TelemetryData;
import com.sensornet.core.event.TelemetryReceivedEvent;
import com.sensornet.core.repository.DeviceRepository;
import com.sensornet.core.repository.TelemetryDataRepository;
import com.sensornet.core.service.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class MqttIngestionService {

    private final MqttClient mqttClient;
    private final DeviceRepository deviceRepository;
    private final TelemetryDataRepository telemetryDataRepository;
    private final AlertService alertService;
    private final ApplicationEventPublisher eventPublisher;

    @PostConstruct
    public void subscribe() throws Exception {
        mqttClient.subscribe("telemetry/#", (topic, message) -> {
            String payload = new String(message.getPayload());
            log.info("Received message on topic {}: {}", topic, payload);
            processMessage(topic, payload);
        });
    }

    private void processMessage(String topic, String payload) {
        // topic format: telemetry/{deviceId}/{key}
        String[] parts = topic.split("/");
        if (parts.length < 3) return;

        String deviceExternalId = parts[1];
        String key = parts[2];
        try {
            Double value = Double.parseDouble(payload);

            Optional<Device> deviceOpt = deviceRepository.findByDeviceId(deviceExternalId);
            if (deviceOpt.isPresent()) {
                Device device = deviceOpt.get();
                TelemetryData data = TelemetryData.builder()
                        .device(device)
                        .key(key)
                        .value(value)
                        .timestamp(LocalDateTime.now())
                        .build();
                telemetryDataRepository.save(data);
                device.setLastSeen(LocalDateTime.now());
                device.setStatus(Device.Status.ONLINE);
                deviceRepository.save(device);
                
                eventPublisher.publishEvent(new TelemetryReceivedEvent(this, data));
                alertService.checkRules(data);
            } else {
                log.warn("Device with ID {} not found", deviceExternalId);
            }
        } catch (NumberFormatException e) {
            log.error("Failed to parse telemetry value: {}", payload);
        }
    }
}
