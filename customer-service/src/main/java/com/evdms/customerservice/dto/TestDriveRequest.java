package com.evdms.customerservice.dto;

import com.evdms.customerservice.entity.enums.TestDriveStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class TestDriveRequest {
    private UUID customerId;
    private UUID vehicleId; // Map to carModelId
    private String scheduledDate; // ISO date string
    private TestDriveStatus status;
    private String notes;
}
