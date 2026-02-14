package com.sensornet.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastTelemetry(Object data) {
        messagingTemplate.convertAndSend("/topic/telemetry", data);
    }

    public void broadcastAlert(Object alert) {
        messagingTemplate.convertAndSend("/topic/alerts", alert);
    }
}
