package edu.placex.placement.controller;

import edu.placex.placement.dto.ApplicationRequest;
import edu.placex.placement.dto.DriveRequest;
import edu.placex.placement.model.PlacementDrive;
import edu.placex.placement.model.Selection;
import edu.placex.placement.model.Student;
import edu.placex.placement.service.ApplicationService;
import edu.placex.placement.service.DriveService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/drives")
public class DriveController {
    private final DriveService drives;
    private final ApplicationService applications;
    public DriveController(DriveService drives, ApplicationService applications) { this.drives = drives; this.applications = applications; }

    @GetMapping
    public List<PlacementDrive> findAll(@RequestParam(required = false) String q, @RequestParam(required = false) String stage) {
        return drives.findAll().stream()
                .filter(drive -> q == null || q.isBlank() || (drive.jobTitle() + " " + drive.description()).toLowerCase().contains(q.trim().toLowerCase()))
                .filter(drive -> stage == null || stage.isBlank() || drive.stage().equalsIgnoreCase(stage))
                .toList();
    }

    @GetMapping("/{id}") public PlacementDrive findById(@PathVariable String id) { return drives.findById(id); }
    @PostMapping public ResponseEntity<PlacementDrive> create(@Valid @RequestBody DriveRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(drives.create(request)); }
    @PutMapping("/{id}") public PlacementDrive update(@PathVariable String id, @Valid @RequestBody DriveRequest request) { return drives.update(id, request); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable String id) { drives.delete(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/{id}/eligible-students") public List<Student> eligibleStudents(@PathVariable String id) { return applications.eligibleStudents(id); }
    @GetMapping("/{id}/applications") public List<Selection> applications(@PathVariable String id) { return applications.findByDriveId(id); }
    @PostMapping("/{id}/applications")
    public ResponseEntity<Selection> apply(@PathVariable String id, @Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applications.apply(id, request.studentId()));
    }
}
