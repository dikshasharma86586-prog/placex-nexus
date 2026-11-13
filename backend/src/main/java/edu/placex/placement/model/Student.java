package edu.placex.placement.model;

import java.math.BigDecimal;
import java.util.List;

public record Student(String id, String rollNo, String name, String email, String phone,
                      String branch, BigDecimal cgpa, int graduationYear, List<String> skills,
                      int backlogs, String placementStatus) { }
