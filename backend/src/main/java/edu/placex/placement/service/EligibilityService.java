package edu.placex.placement.service;

import edu.placex.placement.dto.EligibilityCheck;
import edu.placex.placement.dto.EligibilityResult;
import edu.placex.placement.model.PlacementDrive;
import edu.placex.placement.model.Student;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EligibilityService {
    public EligibilityResult check(Student student, PlacementDrive drive) {
        var checks = List.of(
                criterion("Minimum CGPA", student.cgpa().compareTo(drive.minCgpa()) >= 0,
                        student.cgpa().toPlainString() + " CGPA", drive.minCgpa().toPlainString() + " CGPA or above",
                        "Student CGPA must meet the drive minimum."),
                criterion("Eligible branch", drive.branches().contains(student.branch()), student.branch(),
                        String.join(", ", drive.branches()), "Student branch must be included in the drive's eligible branches."),
                criterion("Graduation year", drive.graduationYear() == null || student.graduationYear() == drive.graduationYear(),
                        Integer.toString(student.graduationYear()), drive.graduationYear() == null ? "Any graduation year" : drive.graduationYear().toString(),
                        "Student graduation year must match the drive requirement when one is specified."),
                criterion("Active backlogs", student.backlogs() <= drive.maxBacklogs(), Integer.toString(student.backlogs()),
                        Integer.toString(drive.maxBacklogs()) + " or fewer", "Student backlogs must not exceed the drive maximum."));
        List<EligibilityCheck> passed = checks.stream().filter(EligibilityCheck::passed).toList();
        List<EligibilityCheck> failed = checks.stream().filter(check -> !check.passed()).toList();
        return new EligibilityResult(failed.isEmpty(), checks, passed, failed,
                failed.stream().map(EligibilityCheck::explanation).toList());
    }

    private EligibilityCheck criterion(String label, boolean passed, String actual, String required, String explanation) {
        return new EligibilityCheck(label, passed, actual, required, passed ? "Requirement satisfied." : explanation);
    }
}
