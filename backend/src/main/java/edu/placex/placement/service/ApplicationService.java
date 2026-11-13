package edu.placex.placement.service;

import edu.placex.placement.dto.EligibilityResult;
import edu.placex.placement.exception.ApiException;
import edu.placex.placement.model.Selection;
import edu.placex.placement.repository.ApplicationRepository;
import edu.placex.placement.repository.DriveRepository;
import edu.placex.placement.repository.StudentRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationService {
    private static final Set<String> ASSESSMENT_STAGES = Set.of("Assessment Cleared", "Interview Shortlisted", "Selected", "Offered", "Offer Accepted");
    private final ApplicationRepository applications;
    private final StudentRepository students;
    private final DriveRepository drives;
    private final EligibilityService eligibility;
    private final RecruitmentStatusPolicy statusPolicy;

    public ApplicationService(ApplicationRepository applications, StudentRepository students,
                              DriveRepository drives, EligibilityService eligibility,
                              RecruitmentStatusPolicy statusPolicy) {
        this.applications = applications;
        this.students = students;
        this.drives = drives;
        this.eligibility = eligibility;
        this.statusPolicy = statusPolicy;
    }

    public List<Selection> findAll() { return applications.findAll(); }
    public Selection findById(String id) { return applications.findById(id).orElseThrow(() -> ApiException.notFound("Application was not found.")); }
    public List<Selection> findByDriveId(String driveId) {
        drives.findById(driveId).orElseThrow(() -> ApiException.notFound("Placement drive was not found."));
        return applications.findByDriveId(driveId);
    }

    public EligibilityResult checkEligibility(String studentId, String driveId) {
        var student = students.findById(studentId).orElseThrow(() -> ApiException.notFound("Student was not found."));
        var drive = drives.findById(driveId).orElseThrow(() -> ApiException.notFound("Placement drive was not found."));
        return eligibility.check(student, drive);
    }

    public List<edu.placex.placement.model.Student> eligibleStudents(String driveId) {
        var drive = drives.findById(driveId).orElseThrow(() -> ApiException.notFound("Placement drive was not found."));
        return students.findAll().stream().filter(student -> eligibility.check(student, drive).eligible()).toList();
    }

    @Transactional
    public Selection apply(String driveId, String studentId) {
        var student = students.findById(studentId).orElseThrow(() -> ApiException.notFound("Student was not found."));
        var drive = drives.findById(driveId).orElseThrow(() -> ApiException.notFound("Placement drive was not found."));
        if (!"Registration Open".equals(drive.stage()) || drive.deadline().isBefore(LocalDate.now())) {
            throw ApiException.conflict("Registration for this placement drive is closed.");
        }
        var result = eligibility.check(student, drive);
        if (!result.eligible()) throw ApiException.conflict("Student is not eligible for this placement drive.");
        if (applications.existsForStudentAndDrive(studentId, driveId)) throw ApiException.conflict("This student already has an application for this placement drive.");
        String id = UUID.randomUUID().toString();
        applications.create(id, studentId, driveId);
        return findById(id);
    }

    @Transactional
    public Selection updateStatus(String id, String nextStatus) {
        Selection current = findById(id);
        if (!statusPolicy.isValid(nextStatus)) throw ApiException.badRequest("Recruitment status is not supported.");
        if (!statusPolicy.canTransition(current.status(), nextStatus)) {
            throw ApiException.conflict("Recruitment status cannot move backward or change after a final outcome.");
        }
        if (!current.status().equals(nextStatus)) applications.updateStatus(current, nextStatus);
        return findById(id);
    }

    @Transactional
    public Selection updateAssessmentScore(String id, java.math.BigDecimal score) {
        Selection application = findById(id);
        if (!ASSESSMENT_STAGES.contains(application.status())) {
            throw ApiException.conflict("An assessment score can be recorded after the application enters assessment.");
        }
        applications.updateAssessmentScore(id, score);
        return findById(id);
    }

    @Transactional
    public void delete(String id) {
        Selection application = findById(id);
        applications.delete(id, application.studentId());
    }
}
