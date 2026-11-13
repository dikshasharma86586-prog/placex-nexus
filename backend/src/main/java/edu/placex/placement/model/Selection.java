package edu.placex.placement.model;

import java.math.BigDecimal;

public record Selection(String id, String studentId, String companyId, String driveId,
                        String status, String updatedAt, BigDecimal assessmentScore) { }
