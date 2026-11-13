package edu.placex.placement.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record DriveRequest(
        @NotBlank @Size(max = 36) String id,
        @NotBlank @Size(max = 36) String companyId,
        @NotBlank @Size(max = 140) String jobTitle,
        @Size(max = 4000) String description,
        @NotNull LocalDate date,
        @NotNull LocalDate deadline,
        @NotNull @DecimalMin("0.0") @DecimalMax("10.0") BigDecimal minCgpa,
        @NotNull @NotEmpty List<@NotBlank @Size(max = 100) String> branches,
        @Min(2000) Integer graduationYear,
        @Min(0) int maxBacklogs,
        @NotNull @DecimalMin("0.0") BigDecimal packageLpa,
        @Min(1) int openings,
        @NotBlank String stage) { }
