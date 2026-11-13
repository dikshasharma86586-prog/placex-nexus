package edu.placex.placement.service;

import edu.placex.placement.model.PlacementDrive;
import edu.placex.placement.model.Student;
import edu.placex.placement.repository.ApplicationRepository;
import edu.placex.placement.repository.DriveRepository;
import edu.placex.placement.repository.StudentRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ApplicationServiceTest {
    @Test void duplicateApplicationIsRejectedBeforeWriting() {
        var applications = mock(ApplicationRepository.class);
        var students = mock(StudentRepository.class);
        var drives = mock(DriveRepository.class);
        var student = new Student("s1", "CS-1", "Test Student", "test@example.edu", "1234567890", "Computer Science",
                new BigDecimal("8.2"), 2026, List.of("Java"), 0, "Not placed");
        var drive = new PlacementDrive("d1", "c1", "Engineer", "", LocalDate.now().plusDays(10), LocalDate.now().plusDays(5),
                new BigDecimal("7.0"), List.of("Computer Science"), 2026, 0, new BigDecimal("10"), 2, "Registration Open");
        when(students.findById("s1")).thenReturn(Optional.of(student));
        when(drives.findById("d1")).thenReturn(Optional.of(drive));
        when(applications.existsForStudentAndDrive("s1", "d1")).thenReturn(true);
        var service = new ApplicationService(applications, students, drives, new EligibilityService(), new RecruitmentStatusPolicy());

        assertThatThrownBy(() -> service.apply("d1", "s1"))
                .isInstanceOf(edu.placex.placement.exception.ApiException.class)
                .hasMessageContaining("already has an application");
    }
}
