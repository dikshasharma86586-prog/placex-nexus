package edu.placex.placement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ApplicationRequest(@NotBlank @Size(max = 36) String studentId) { }
