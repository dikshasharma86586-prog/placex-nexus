package edu.placex.placement.service;

import edu.placex.placement.dto.StudentRequest;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class StudentValidationTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test void acceptsValidStudentAndRejectsInvalidEmailCgpaAndBacklogs() {
        var valid = new StudentRequest("s1", "CS-1", "Test Student", "student@example.edu", "1234567890",
                "Computer Science", new BigDecimal("8.10"), 2026, List.of("Java", "SQL"), 0);
        assertThat(validator.validate(valid)).isEmpty();

        var invalid = new StudentRequest("s2", "CS-2", "Test Student", "bad-email", "1234567890",
                "Computer Science", new BigDecimal("10.10"), 2026, List.of("Java"), -1);
        assertThat(validator.validate(invalid)).hasSize(3);
    }
}
