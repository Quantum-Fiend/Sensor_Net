package com.sensornet.core.repository;

import com.sensornet.core.entity.TelemetryData;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TelemetryDataRepository extends JpaRepository<TelemetryData, Long> {
    List<TelemetryData> findByDeviceId(Long deviceId);
}
