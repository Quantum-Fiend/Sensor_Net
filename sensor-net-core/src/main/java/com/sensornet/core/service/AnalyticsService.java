package com.sensornet.core.service;

import com.sensornet.core.entity.TelemetryData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class AnalyticsService {

    /**
     * Basic anomaly detection using moving average/standard deviation (concept).
     * In a production environment, this would use a real ML model or time-series analysis library.
     */
    public boolean detectAnomaly(TelemetryData data, List<TelemetryData> historicalData) {
        if (historicalData.size() < 10) return false;

        double mean = historicalData.stream().mapToDouble(TelemetryData::getValue).average().orElse(0);
        double stdDev = Math.sqrt(historicalData.stream()
                .mapToDouble(d -> Math.pow(d.getValue() - mean, 2))
                .average().orElse(0));

        // Simple Z-score anomaly detection (threshold 3.0)
        if (stdDev > 0) {
            double zScore = Math.abs(data.getValue() - mean) / stdDev;
            if (zScore > 3.0) {
                log.info("Anomaly detected! Z-score: {} for value: {}", zScore, data.getValue());
                return true;
            }
        }
        return false;
    }
}
