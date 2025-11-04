package com.evdms.customerservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LeadCreateRequest {
    @NotBlank
    private String fullName; // Maps to Lead.name

    @NotBlank
    private String phone;

    @Email
    private String email;

    private String interestedVehicleModel; // Maps to Lead.interestedModels

    private String source;

    private String notes;
}
