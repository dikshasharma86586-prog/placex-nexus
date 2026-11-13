package edu.placex.placement.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

public record StudentRequest(
        @NotBlank @Size(max = 36) String id,
        @NotBlank @Size(max = 30) String rollNo,
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Email @Size(max = 180) String email,
        @NotBlank @Size(max = 30) String phone,
        @NotBlank @Size(max = 100) String branch,
        @NotNull @DecimalMin("0.0") @DecimalMax("10.0") BigDecimal cgpa,
        @Min(2000) int graduationYear,
        @NotNull List<@NotBlank @Size(max = 60) String> skills,
        @Min(0) int backlogs) { }
