package com.sensornet.core.event;

import com.sensornet.core.entity.Alert;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class AlertTriggeredEvent extends ApplicationEvent {
    private final Alert alert;

    public AlertTriggeredEvent(Object source, Alert alert) {
        super(source);
        this.alert = alert;
    }
}
