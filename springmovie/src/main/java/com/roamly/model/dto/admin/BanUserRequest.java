package com.roamly.model.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BanUserRequest {

    @NotBlank
    private String reason;
}
