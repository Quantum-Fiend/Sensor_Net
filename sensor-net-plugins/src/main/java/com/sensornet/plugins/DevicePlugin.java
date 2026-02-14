package com.sensornet.plugins;

import com.sensornet.core.entity.Device;
import com.sensornet.core.entity.TelemetryData;

/**
 * Interface for custom device plugins.
 */
public interface DevicePlugin {
    
    /**
     * @return Unique ID for the plugin.
     */
    String getPluginId();

    /**
     * @return Supported device type.
     */
    String getSupportedType();

    /**
     * Processes telemetry data specialized for this device type.
     * @param data The telemetry data.
     */
    void processTelemetry(TelemetryData data);

    /**
     * Performs a custom action on a device (e.g. toggle switch).
     * @param device The target device.
     * @param action The action name.
     * @param params Parameters for the action.
     */
    void executeAction(Device device, String action, String params);
}
