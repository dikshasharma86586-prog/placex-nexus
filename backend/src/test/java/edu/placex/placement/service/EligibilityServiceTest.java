package edu.placex.placement.service;

import edu.placex.placement.model.PlacementDrive;
import edu.placex.placement.model.Student;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class EligibilityServiceTest {
    private final EligibilityService service = new EligibilityService();
    private final PlacementDrive drive = new PlacementDrive("d1", "c1", "Engineer", "",
            LocalDate.now().plusDays(10), LocalDate.now().plusDays(5), new BigDecimal("7.00"),
            List.of("Computer Science", "Information Technology"), 2026, 1,
            new BigDecimal("12.00"), 5, "Registration Open");

    @Test void acceptsStudentWhoPassesEveryDriveRequirement() {
        var result = service.check(student("Computer Science", "8.00", 2026, 1), drive);
        assertThat(result.eligible()).isTrue();
        assertThat(result.criteriaFailed()).isEmpty();
        assertThat(result.criteriaPassed()).hasSize(4);
    }

    @Test void returnsReasonsForEachFailedRequirement() {
        var result = service.check(student("Civil Engineering", "6.50", 2025, 2), drive);
        assertThat(result.eligible()).isFalse();
        assertThat(result.criteriaFailed()).extracting("label")
                .containsExactly("Minimum CGPA", "Eligible branch", "Graduation year", "Active backlogs");
        assertThat(result.explanations()).hasSize(4);
    }

    private Student student(String branch, String cgpa, int year, int backlogs) {
        return new Student("s1", "CS-1", "Test Student", "test@example.edu", "1234567890", branch,
                new BigDecimal(cgpa), year, List.of("Java"), backlogs, "Not placed");
    }
}
