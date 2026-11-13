package edu.placex.placement.dto;

import jakarta.validation.constraints.NotBlank;

public record EligibilityRequest(@NotBlank String studentId, @NotBlank String driveId) { }
