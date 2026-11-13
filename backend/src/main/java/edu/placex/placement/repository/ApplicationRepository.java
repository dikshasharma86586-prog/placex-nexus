package edu.placex.placement.repository;

import edu.placex.placement.model.Selection;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class ApplicationRepository {
    private final JdbcTemplate jdbc;
    private static final String SELECT = """
            SELECT a.id, a.student_id, d.company_id, a.drive_id, a.status, a.assessment_score,
                   DATE_FORMAT(a.updated_at, '%Y-%m-%d') AS updated_at
            FROM applications a JOIN placement_drives d ON d.id=a.drive_id
            """;
    private static final RowMapper<Selection> MAPPER = (rs, row) -> new Selection(
            rs.getString("id"), rs.getString("student_id"), rs.getString("company_id"),
            rs.getString("drive_id"), rs.getString("status"), rs.getString("updated_at"), rs.getBigDecimal("assessment_score"));

    public ApplicationRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<Selection> findAll() { return jdbc.query(SELECT + " ORDER BY a.updated_at DESC", MAPPER); }
    public Optional<Selection> findById(String id) { return jdbc.query(SELECT + " WHERE a.id = ?", MAPPER, id).stream().findFirst(); }
    public List<Selection> findByDriveId(String driveId) { return jdbc.query(SELECT + " WHERE a.drive_id = ? ORDER BY a.updated_at DESC", MAPPER, driveId); }
    public boolean existsForStudentAndDrive(String studentId, String driveId) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM applications WHERE student_id = ? AND drive_id = ?", Long.class, studentId, driveId) > 0;
    }

    public void create(String id, String studentId, String driveId) {
        jdbc.update("INSERT INTO applications (id, student_id, drive_id, status) VALUES (?, ?, ?, 'Applied')", id, studentId, driveId);
    }

    public void updateAssessmentScore(String id, java.math.BigDecimal score) {
        jdbc.update("UPDATE applications SET assessment_score = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", score, id);
    }

    public void updateStatus(Selection application, String status) {
        jdbc.update("UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", status, application.id());
        if (isPlacedStatus(status)) {
            jdbc.update("""
                    INSERT INTO selections (application_id, student_id, company_id, drive_id, status)
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE status=VALUES(status), updated_at=CURRENT_TIMESTAMP
                    """, application.id(), application.studentId(), application.companyId(), application.driveId(), status);
        } else {
            jdbc.update("DELETE FROM selections WHERE application_id = ?", application.id());
        }
        recalculatePlacementStatus(application.studentId());
    }

    public void delete(String id, String studentId) {
        jdbc.update("DELETE FROM selections WHERE application_id = ?", id);
        jdbc.update("DELETE FROM applications WHERE id = ?", id);
        recalculatePlacementStatus(studentId);
    }

    private void recalculatePlacementStatus(String studentId) {
        jdbc.update("""
                UPDATE students SET placement_status = CASE WHEN EXISTS (
                    SELECT 1 FROM selections WHERE student_id = ?
                ) THEN 'Placed' ELSE 'Not placed' END WHERE id = ?
                """, studentId, studentId);
    }

    private static boolean isPlacedStatus(String status) {
        return List.of("Selected", "Offered", "Offer Accepted").contains(status);
    }
}
