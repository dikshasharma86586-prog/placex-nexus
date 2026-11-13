package edu.placex.placement.service;

import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class RecruitmentStatusPolicy {
    private static final Map<String, Integer> ORDER = Map.of(
            "Applied", 0, "Assessment Cleared", 1, "Interview Shortlisted", 2,
            "Selected", 3, "Offered", 4, "Offer Accepted", 5);
    private static final Set<String> STATUSES = Set.of(
            "Applied", "Assessment Cleared", "Interview Shortlisted", "Selected", "Rejected", "Offered", "Offer Accepted");

    public boolean isValid(String status) { return STATUSES.contains(status); }

    public boolean canTransition(String current, String next) {
        if (!isValid(current) || !isValid(next)) return false;
        if (current.equals(next)) return true;
        if (current.equals("Rejected") || current.equals("Offer Accepted")) return false;
        if (next.equals("Rejected")) return true;
        return ORDER.get(next) > ORDER.get(current);
    }
}
