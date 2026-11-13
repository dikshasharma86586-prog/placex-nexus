package edu.placex.placement.model;

import java.math.BigDecimal;
import java.util.List;

public record Company(String id, String name, String industry, String role, BigDecimal minCgpa,
                      List<String> branches, BigDecimal packageLpa, int positions,
                      int maxBacklogs, String status) { }
