package edu.placex.placement.repository;

import edu.placex.placement.dto.StudentRequest;
import edu.placex.placement.model.Student;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class StudentRepository {
    private final JdbcTemplate jdbc;
    private static final String SELECT = """
            SELECT s.id, s.roll_number, s.full_name, s.email, s.phone, s.branch, s.cgpa,
                   s.graduation_year, s.skills, s.backlog_count,
                   CASE WHEN EXISTS (SELECT 1 FROM selections x WHERE x.student_id = s.id)
                        THEN 'Placed' ELSE 'Not placed' END AS placement_status
            FROM students s
            """;
    private static final RowMapper<Student> MAPPER = (rs, row) -> new Student(
            rs.getString("id"), rs.getString("roll_number"), rs.getString("full_name"),
            rs.getString("email"), rs.getString("phone"), rs.getString("branch"),
            rs.getBigDecimal("cgpa"), rs.getInt("graduation_year"), split(rs.getString("skills")),
            rs.getInt("backlog_count"), rs.getString("placement_status"));

    public StudentRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<Student> findAll() { return jdbc.query(SELECT + " ORDER BY s.full_name", MAPPER); }

    public Optional<Student> findById(String id) {
        return jdbc.query(SELECT + " WHERE s.id = ?", MAPPER, id).stream().findFirst();
    }

    public void save(StudentRequest student) {
        jdbc.update("""
                INSERT INTO students (id, roll_number, full_name, email, phone, branch, cgpa, graduation_year, skills, backlog_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE roll_number=VALUES(roll_number), full_name=VALUES(full_name),
                    email=VALUES(email), phone=VALUES(phone), branch=VALUES(branch), cgpa=VALUES(cgpa),
                    graduation_year=VALUES(graduation_year), skills=VALUES(skills), backlog_count=VALUES(backlog_count),
                    updated_at=CURRENT_TIMESTAMP
                """, student.id(), student.rollNo().trim(), student.name().trim(), student.email().trim().toLowerCase(),
                student.phone().trim(), student.branch().trim(), student.cgpa(), student.graduationYear(),
                String.join("\n", student.skills()), student.backlogs());
    }

    public boolean hasApplications(String id) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM applications WHERE student_id = ?", Long.class, id) > 0;
    }

    public int delete(String id) { return jdbc.update("DELETE FROM students WHERE id = ?", id); }

    private static List<String> split(String value) {
        return value == null || value.isBlank() ? List.of() : Arrays.stream(value.split("\\n")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }
}
