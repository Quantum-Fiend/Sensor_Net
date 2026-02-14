package com.sensornet.core.service;

import com.sensornet.core.entity.AuditLog;
import com.sensornet.core.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void log(String username, String action, String details, String ipAddress) {
        AuditLog log = AuditLog.builder()
                .username(username)
                .action(action)
                .details(details)
                .timestamp(LocalDateTime.now())
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(log);
    }
}
