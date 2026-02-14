package com.sensornet.core.service;

import com.sensornet.core.entity.Alert;
import com.sensornet.core.entity.AlertRule;
import com.sensornet.core.entity.TelemetryData;
import com.sensornet.core.event.AlertTriggeredEvent;
import com.sensornet.core.repository.AlertRepository;
import com.sensornet.core.repository.AlertRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final AlertRuleRepository alertRuleRepository;
    private final ApplicationEventPublisher eventPublisher;

    public void checkRules(TelemetryData data) {
        List<AlertRule> rules = alertRuleRepository.findByEnabledTrue();
        for (AlertRule rule : rules) {
            if (rule.getTelemetryKey().equals(data.getKey())) {
                if (evaluate(data.getValue(), rule.getOperator(), rule.getThreshold())) {
                    createAlert(data, rule);
                }
            }
        }
    }

    private boolean evaluate(Double value, String operator, Double threshold) {
        return switch (operator) {
            case ">" -> value > threshold;
            case "<" -> value < threshold;
            case "==" -> value.equals(threshold);
            case ">=" -> value >= threshold;
            case "<=" -> value <= threshold;
            default -> false;
        };
    }

    private void createAlert(TelemetryData data, AlertRule rule) {
        String message = String.format("Alert '%s' triggered for device %s: %s %s %s (current: %s)",
                rule.getName(), data.getDevice().getName(), rule.getTelemetryKey(),
                rule.getOperator(), rule.getThreshold(), data.getValue());

        Alert alert = Alert.builder()
                .device(data.getDevice())
                .message(message)
                .severity(rule.getSeverity())
                .timestamp(LocalDateTime.now())
                .resolved(false)
                .build();

        alertRepository.save(alert);
        log.warn("New Alert: {}", message);
        
        eventPublisher.publishEvent(new AlertTriggeredEvent(this, alert));
    }
}
