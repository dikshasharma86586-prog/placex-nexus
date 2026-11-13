package edu.placex.placement.controller;

import edu.placex.placement.dto.StudentRequest;
import edu.placex.placement.model.Student;
import edu.placex.placement.service.StudentService;
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
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService students;
    public StudentController(StudentService students) { this.students = students; }

    @GetMapping
    public List<Student> findAll(@RequestParam(required = false) String q,
                                 @RequestParam(required = false) String branch,
                                 @RequestParam(required = false) String placementStatus,
                                 @RequestParam(required = false) Integer graduationYear) {
        return students.findAll().stream()
                .filter(student -> contains(q, student.name(), student.rollNo(), student.email()))
                .filter(student -> blank(branch) || student.branch().equalsIgnoreCase(branch))
                .filter(student -> blank(placementStatus) || student.placementStatus().equalsIgnoreCase(placementStatus))
                .filter(student -> graduationYear == null || student.graduationYear() == graduationYear)
                .toList();
    }

    @GetMapping("/{id}")
    public Student findById(@PathVariable String id) { return students.findById(id); }

    @PostMapping
    public ResponseEntity<Student> create(@Valid @RequestBody StudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(students.create(request));
    }

    @PutMapping("/{id}")
    public Student update(@PathVariable String id, @Valid @RequestBody StudentRequest request) { return students.update(id, request); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) { students.delete(id); return ResponseEntity.noContent().build(); }

    private static boolean blank(String value) { return value == null || value.isBlank(); }
    private static boolean contains(String query, String... values) {
        return blank(query) || java.util.Arrays.stream(values).anyMatch(value -> value.toLowerCase().contains(query.trim().toLowerCase()));
    }
}
