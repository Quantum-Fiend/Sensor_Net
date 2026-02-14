package com.sensornet.core.service;

import com.sensornet.core.entity.TelemetryData;
import com.sensornet.core.repository.TelemetryDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataLakeService {

    private final TelemetryDataRepository telemetryDataRepository;

    public String exportToCsv(Long deviceId) {
        List<TelemetryData> dataPoints = telemetryDataRepository.findByDeviceId(deviceId);
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        pw.println("Timestamp,Key,Value");
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;

        for (TelemetryData data : dataPoints) {
            pw.printf("%s,%s,%.2f%n",
                    formatter.format(data.getTimestamp()),
                    data.getKey(),
                    data.getValue());
        }

        return sw.toString();
    }
}
