package com.sensornet.plugins.service;

import com.sensornet.plugins.DevicePlugin;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class PluginManager {

    private final Map<String, DevicePlugin> plugins = new HashMap<>();

    public void registerPlugin(DevicePlugin plugin) {
        log.info("Registering plugin: {} for type: {}", plugin.getPluginId(), plugin.getSupportedType());
        plugins.put(plugin.getSupportedType(), plugin);
    }

    public Optional<DevicePlugin> getPluginForType(String type) {
        return Optional.ofNullable(plugins.get(type));
    }
}
