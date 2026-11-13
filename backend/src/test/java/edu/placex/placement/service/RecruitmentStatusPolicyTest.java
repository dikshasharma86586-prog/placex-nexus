package edu.placex.placement.service;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class RecruitmentStatusPolicyTest {
    private final RecruitmentStatusPolicy policy = new RecruitmentStatusPolicy();

    @Test void allowsForwardProgressionAndRejection() {
        assertThat(policy.canTransition("Applied", "Interview Shortlisted")).isTrue();
        assertThat(policy.canTransition("Selected", "Offered")).isTrue();
        assertThat(policy.canTransition("Interview Shortlisted", "Rejected")).isTrue();
    }

    @Test void preventsBacktrackingAndChangesAfterFinalOutcome() {
        assertThat(policy.canTransition("Offered", "Selected")).isFalse();
        assertThat(policy.canTransition("Offer Accepted", "Rejected")).isFalse();
        assertThat(policy.canTransition("Rejected", "Selected")).isFalse();
    }

    @Test void rejectsUnknownStatusValues() {
        assertThat(policy.canTransition("Applied", "Placed")).isFalse();
    }
}
