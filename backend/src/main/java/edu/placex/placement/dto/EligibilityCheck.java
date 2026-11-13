package edu.placex.placement.dto;

public record EligibilityCheck(String label, boolean passed, String actual, String required, String explanation) { }
