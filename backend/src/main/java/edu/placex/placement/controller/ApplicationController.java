package edu.placex.placement.controller;

import edu.placex.placement.dto.AssessmentRequest;
import edu.placex.placement.dto.StatusRequest;
import edu.placex.placement.model.Selection;
import edu.placex.placement.service.ApplicationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApplicationController {
    private final ApplicationService applications;
    public ApplicationController(ApplicationService applications) { this.applications = applications; }

    @GetMapping("/applications")
    public List<Selection> findAll(@RequestParam(required = false) String studentId,
                                   @RequestParam(required = false) String driveId,
                                   @RequestParam(required = false) String status) {
        return applications.findAll().stream()
                .filter(item -> studentId == null || item.studentId().equals(studentId))
                .filter(item -> driveId == null || item.driveId().equals(driveId))
                .filter(item -> status == null || item.status().equalsIgnoreCase(status))
                .toList();
    }

    @GetMapping("/applications/{id}") public Selection findById(@PathVariable String id) { return applications.findById(id); }
    @PatchMapping("/applications/{id}/status") public Selection updateStatus(@PathVariable String id, @Valid @RequestBody StatusRequest request) { return applications.updateStatus(id, request.status()); }
    @PatchMapping("/applications/{id}/assessment") public Selection updateAssessment(@PathVariable String id, @Valid @RequestBody AssessmentRequest request) { return applications.updateAssessmentScore(id, request.score()); }
    @DeleteMapping("/applications/{id}") public ResponseEntity<Void> delete(@PathVariable String id) { applications.delete(id); return ResponseEntity.noContent().build(); }
    @GetMapping("/selections") public List<Selection> selections() { return applications.findAll(); }
}
