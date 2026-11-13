package edu.placex.placement.controller;

import edu.placex.placement.dto.EligibilityRequest;
import edu.placex.placement.dto.EligibilityResult;
import edu.placex.placement.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {
    private final ApplicationService applications;
    public EligibilityController(ApplicationService applications) { this.applications = applications; }

    @PostMapping("/check")
    public EligibilityResult check(@Valid @RequestBody EligibilityRequest request) {
        return applications.checkEligibility(request.studentId(), request.driveId());
    }
}
