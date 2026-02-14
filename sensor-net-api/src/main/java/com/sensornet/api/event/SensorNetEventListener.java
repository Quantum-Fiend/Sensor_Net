package com.sensornet.api.event;

import com.sensornet.api.service.WebSocketService;
import com.sensornet.core.event.AlertTriggeredEvent;
import com.sensornet.core.event.TelemetryReceivedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class SensorNetEventListener {

    private final WebSocketService webSocketService;

    @EventListener
    public void handleTelemetryReceived(TelemetryReceivedEvent event) {
        log.debug("Broadcasting telemetry for device: {}", event.getTelemetryData().getDevice().getDeviceId());
        webSocketService.broadcastTelemetry(event.getTelemetryData());
    }

    @EventListener
    public void handleAlertTriggered(AlertTriggeredEvent event) {
        log.info("Broadcasting alert: {}", event.getAlert().getMessage());
        webSocketService.broadcastAlert(event.getAlert());
    }
}
