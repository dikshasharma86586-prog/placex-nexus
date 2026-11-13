package edu.placex.placement.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

public record CompanyRequest(
        @NotBlank @Size(max = 36) String id,
        @NotBlank @Size(max = 140) String name,
        @NotBlank @Size(max = 100) String industry,
        @NotBlank @Size(max = 140) String role,
        @NotNull @DecimalMin("0.0") @DecimalMax("10.0") BigDecimal minCgpa,
        @NotNull @NotEmpty List<@NotBlank @Size(max = 100) String> branches,
        @NotNull @DecimalMin("0.0") BigDecimal packageLpa,
        @Min(1) int positions,
        @Min(0) int maxBacklogs,
        @NotBlank String status) { }
