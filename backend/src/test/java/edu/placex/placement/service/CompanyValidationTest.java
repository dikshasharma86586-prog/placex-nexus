package edu.placex.placement.service;

import edu.placex.placement.dto.CompanyRequest;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class CompanyValidationTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test void validatesCompanyHiringRequirements() {
        var valid = new CompanyRequest("c1", "Northstar Labs", "Technology", "Engineer", new BigDecimal("7.0"),
                List.of("Computer Science"), new BigDecimal("12.0"), 4, 0, "Active");
        assertThat(validator.validate(valid)).isEmpty();

        var invalid = new CompanyRequest("c2", "", "Technology", "Engineer", new BigDecimal("11.0"),
                List.of(), new BigDecimal("8.0"), 0, -1, "Active");
        assertThat(validator.validate(invalid)).isNotEmpty();
    }
}
