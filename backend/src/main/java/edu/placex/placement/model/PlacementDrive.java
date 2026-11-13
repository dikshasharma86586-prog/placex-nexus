package edu.placex.placement.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PlacementDrive(String id, String companyId, String jobTitle, String description,
                             LocalDate date, LocalDate deadline, BigDecimal minCgpa,
                             List<String> branches, Integer graduationYear, int maxBacklogs,
                             BigDecimal packageLpa, int openings, String stage) { }
