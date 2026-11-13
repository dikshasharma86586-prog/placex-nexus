package edu.placex.placement.service;

import edu.placex.placement.dto.StudentRequest;
import edu.placex.placement.exception.ApiException;
import edu.placex.placement.model.Student;
import edu.placex.placement.repository.StudentRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {
    private final StudentRepository students;
    public StudentService(StudentRepository students) { this.students = students; }

    public List<Student> findAll() { return students.findAll(); }
    public Student findById(String id) { return students.findById(id).orElseThrow(() -> ApiException.notFound("Student was not found.")); }

    @Transactional
    public Student create(StudentRequest request) {
        if (students.findById(request.id()).isPresent()) throw ApiException.conflict("A student with this ID already exists.");
        students.save(request);
        return findById(request.id());
    }

    @Transactional
    public Student update(String id, StudentRequest request) {
        if (students.findById(id).isEmpty()) throw ApiException.notFound("Student was not found.");
        students.save(new StudentRequest(id, request.rollNo(), request.name(), request.email(), request.phone(), request.branch(),
                request.cgpa(), request.graduationYear(), request.skills(), request.backlogs()));
        return findById(id);
    }

    @Transactional
    public void delete(String id) {
        findById(id);
        if (students.hasApplications(id)) throw ApiException.conflict("This student has applications. Remove their applications before deleting the student.");
        students.delete(id);
    }
}
