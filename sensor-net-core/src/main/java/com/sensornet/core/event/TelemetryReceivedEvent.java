package com.sensornet.core.event;

import com.sensornet.core.entity.TelemetryData;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TelemetryReceivedEvent extends ApplicationEvent {
    private final TelemetryData telemetryData;

    public TelemetryReceivedEvent(Object source, TelemetryData telemetryData) {
        super(source);
        this.telemetryData = telemetryData;
    }
}
