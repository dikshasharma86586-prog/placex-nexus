package edu.placex.placement.dto;

import java.util.List;

public record EligibilityResult(boolean eligible, List<EligibilityCheck> checks,
                                List<EligibilityCheck> criteriaPassed,
                                List<EligibilityCheck> criteriaFailed,
                                List<String> explanations) { }
