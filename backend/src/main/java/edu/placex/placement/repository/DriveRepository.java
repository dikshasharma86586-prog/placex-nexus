package edu.placex.placement.repository;

import edu.placex.placement.dto.DriveRequest;
import edu.placex.placement.model.PlacementDrive;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class DriveRepository {
    private final JdbcTemplate jdbc;
    private static final String SELECT = """
            SELECT d.id, d.company_id, d.job_title, d.description, d.drive_date, d.application_deadline,
                   d.minimum_cgpa, d.graduation_year, d.maximum_backlogs, d.package_lpa, d.number_of_openings,
                   d.stage, COALESCE(GROUP_CONCAT(DISTINCT b.branch ORDER BY b.branch SEPARATOR '\n'), '') AS branches
            FROM placement_drives d LEFT JOIN drive_eligible_branches b ON b.drive_id=d.id
            """;
    private static final RowMapper<PlacementDrive> MAPPER = (rs, row) -> new PlacementDrive(
            rs.getString("id"), rs.getString("company_id"), rs.getString("job_title"), rs.getString("description"),
            rs.getDate("drive_date").toLocalDate(), rs.getDate("application_deadline").toLocalDate(),
            rs.getBigDecimal("minimum_cgpa"), split(rs.getString("branches")),
            (Integer) rs.getObject("graduation_year"), rs.getInt("maximum_backlogs"),
            rs.getBigDecimal("package_lpa"), rs.getInt("number_of_openings"), rs.getString("stage"));

    public DriveRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<PlacementDrive> findAll() {
        return jdbc.query(SELECT + " GROUP BY d.id ORDER BY d.drive_date", MAPPER);
    }

    public Optional<PlacementDrive> findById(String id) {
        return jdbc.query(SELECT + " WHERE d.id = ? GROUP BY d.id", MAPPER, id).stream().findFirst();
    }

    public void save(DriveRequest drive) {
        jdbc.update("""
                INSERT INTO placement_drives (id, company_id, job_title, description, drive_date, application_deadline,
                    minimum_cgpa, graduation_year, maximum_backlogs, package_lpa, number_of_openings, stage)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE company_id=VALUES(company_id), job_title=VALUES(job_title), description=VALUES(description),
                    drive_date=VALUES(drive_date), application_deadline=VALUES(application_deadline), minimum_cgpa=VALUES(minimum_cgpa),
                    graduation_year=VALUES(graduation_year), maximum_backlogs=VALUES(maximum_backlogs), package_lpa=VALUES(package_lpa),
                    number_of_openings=VALUES(number_of_openings), stage=VALUES(stage), updated_at=CURRENT_TIMESTAMP
                """, drive.id(), drive.companyId(), drive.jobTitle().trim(), drive.description() == null ? "" : drive.description().trim(),
                drive.date(), drive.deadline(), drive.minCgpa(), drive.graduationYear(), drive.maxBacklogs(),
                drive.packageLpa(), drive.openings(), drive.stage());
        jdbc.update("DELETE FROM drive_eligible_branches WHERE drive_id = ?", drive.id());
        jdbc.batchUpdate("INSERT INTO drive_eligible_branches (drive_id, branch) VALUES (?, ?)", drive.branches(), drive.branches().size(),
                (statement, branch) -> { statement.setString(1, drive.id()); statement.setString(2, branch); });
    }

    public boolean exists(String id) { return findById(id).isPresent(); }
    public boolean hasApplications(String id) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM applications WHERE drive_id = ?", Long.class, id) > 0;
    }
    public int delete(String id) { return jdbc.update("DELETE FROM placement_drives WHERE id = ?", id); }

    private static List<String> split(String value) {
        return value == null || value.isBlank() ? List.of() : Arrays.stream(value.split("\\n")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }
}
