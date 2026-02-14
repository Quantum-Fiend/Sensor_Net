package com.sensornet.api.controller;

import com.sensornet.core.entity.TelemetryData;
import com.sensornet.core.repository.TelemetryDataRepository;
import com.sensornet.core.service.DataLakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/telemetry")
@RequiredArgsConstructor
public class TelemetryController {

    private final TelemetryDataRepository telemetryDataRepository;
    private final DataLakeService dataLakeService;

    @GetMapping("/{deviceId}")
    public List<TelemetryData> getTelemetryByDeviceId(@PathVariable Long deviceId) {
        return telemetryDataRepository.findByDeviceId(deviceId);
    }

    @GetMapping("/{deviceId}/export")
    public ResponseEntity<String> exportTelemetry(@PathVariable Long deviceId) {
        String csv = dataLakeService.exportToCsv(deviceId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=telemetry_" + deviceId + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
