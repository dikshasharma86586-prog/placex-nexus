package edu.placex.placement.repository;

import edu.placex.placement.dto.CompanyRequest;
import edu.placex.placement.model.Company;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class CompanyRepository {
    private final JdbcTemplate jdbc;
    private static final String SELECT = "SELECT id, name, industry, job_role, minimum_cgpa, eligible_branches, package_lpa, available_positions, maximum_backlogs, status FROM companies";
    private static final RowMapper<Company> MAPPER = (rs, row) -> new Company(
            rs.getString("id"), rs.getString("name"), rs.getString("industry"), rs.getString("job_role"),
            rs.getBigDecimal("minimum_cgpa"), split(rs.getString("eligible_branches")),
            rs.getBigDecimal("package_lpa"), rs.getInt("available_positions"),
            rs.getInt("maximum_backlogs"), rs.getString("status"));

    public CompanyRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<Company> findAll() { return jdbc.query(SELECT + " ORDER BY name", MAPPER); }
    public Optional<Company> findById(String id) { return jdbc.query(SELECT + " WHERE id = ?", MAPPER, id).stream().findFirst(); }

    public void save(CompanyRequest company) {
        jdbc.update("""
                INSERT INTO companies (id, name, industry, job_role, minimum_cgpa, eligible_branches, package_lpa, available_positions, maximum_backlogs, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE name=VALUES(name), industry=VALUES(industry), job_role=VALUES(job_role),
                    minimum_cgpa=VALUES(minimum_cgpa), eligible_branches=VALUES(eligible_branches), package_lpa=VALUES(package_lpa),
                    available_positions=VALUES(available_positions), maximum_backlogs=VALUES(maximum_backlogs), status=VALUES(status), updated_at=CURRENT_TIMESTAMP
                """, company.id(), company.name().trim(), company.industry().trim(), company.role().trim(), company.minCgpa(),
                String.join("\n", company.branches()), company.packageLpa(), company.positions(), company.maxBacklogs(), company.status());
    }

    public boolean hasDrives(String id) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM placement_drives WHERE company_id = ?", Long.class, id) > 0;
    }
    public int delete(String id) { return jdbc.update("DELETE FROM companies WHERE id = ?", id); }

    private static List<String> split(String value) {
        return value == null || value.isBlank() ? List.of() : Arrays.stream(value.split("\\n")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }
}
