INSERT IGNORE INTO companies (id, name, industry, job_role, minimum_cgpa, eligible_branches, package_lpa, available_positions, maximum_backlogs, status) VALUES
('company-northstar', 'Northstar Labs', 'Technology', 'Software Engineer', 7.00, 'Computer Science\nInformation Technology\nElectronics', 18.00, 12, 0, 'Active'),
('company-meridian', 'Meridian Finance', 'Financial Services', 'Graduate Analyst', 7.50, 'Computer Science\nInformation Technology\nElectronics', 14.00, 8, 0, 'Active'),
('company-vertex', 'Vertex Systems', 'Enterprise Software', 'Associate Developer', 6.50, 'Computer Science\nInformation Technology\nElectronics\nMechanical', 10.50, 18, 1, 'Active');

INSERT IGNORE INTO students (id, roll_number, full_name, email, phone, branch, cgpa, graduation_year, skills, backlog_count, placement_status) VALUES
('student-001', 'CS21-001', 'Aarav Mehta', 'aarav.mehta@campus.edu', '+91 9876500001', 'Computer Science', 9.20, 2026, 'React\nPython\nSQL', 0, 'Not placed'),
('student-002', 'IT21-014', 'Ishaan Kapoor', 'ishaan.kapoor@campus.edu', '+91 9876500002', 'Information Technology', 8.10, 2026, 'TypeScript\nNode.js\nFigma', 0, 'Not placed'),
('student-003', 'EC21-021', 'Diya Sharma', 'diya.sharma@campus.edu', '+91 9876500003', 'Electronics', 7.60, 2026, 'Embedded C\nPython\nIoT', 0, 'Not placed'),
('student-004', 'ME21-009', 'Myra Desai', 'myra.desai@campus.edu', '+91 9876500004', 'Mechanical', 8.30, 2026, 'AutoCAD\nSolidWorks\nPython', 0, 'Not placed'),
('student-005', 'CE21-011', 'Vivaan Shah', 'vivaan.shah@campus.edu', '+91 9876500005', 'Civil Engineering', 7.80, 2026, 'Revit\nAutoCAD\nExcel', 0, 'Not placed'),
('student-006', 'CS21-030', 'Aadhya Menon', 'aadhya.menon@campus.edu', '+91 9876500006', 'Computer Science', 9.50, 2026, 'Python\nMachine Learning\nTensorFlow', 0, 'Not placed');

INSERT IGNORE INTO placement_drives (id, company_id, job_title, description, drive_date, application_deadline, minimum_cgpa, graduation_year, maximum_backlogs, package_lpa, number_of_openings, stage) VALUES
('drive-northstar-2026', 'company-northstar', 'Software Engineer', 'Build dependable products with a small, high-trust engineering team.', '2026-11-04', '2026-11-01', 7.00, 2026, 0, 18.00, 12, 'Registration Open'),
('drive-meridian-2026', 'company-meridian', 'Graduate Analyst', 'Turn complex data into clear decisions for our investment teams.', '2026-11-07', '2026-11-03', 7.50, 2026, 0, 14.00, 8, 'Upcoming'),
('drive-vertex-2026', 'company-vertex', 'Associate Developer', 'Join a product squad delivering modern enterprise software.', '2026-11-12', '2026-11-08', 6.50, 2026, 1, 10.50, 18, 'Registration Open');

INSERT IGNORE INTO drive_eligible_branches (drive_id, branch) VALUES
('drive-northstar-2026', 'Computer Science'), ('drive-northstar-2026', 'Information Technology'), ('drive-northstar-2026', 'Electronics'),
('drive-meridian-2026', 'Computer Science'), ('drive-meridian-2026', 'Information Technology'), ('drive-meridian-2026', 'Electronics'),
('drive-vertex-2026', 'Computer Science'), ('drive-vertex-2026', 'Information Technology'), ('drive-vertex-2026', 'Electronics'), ('drive-vertex-2026', 'Mechanical');

INSERT IGNORE INTO applications (id, student_id, drive_id, status, applied_at, updated_at) VALUES
('application-sample-001', 'student-001', 'drive-northstar-2026', 'Applied', '2026-10-24 10:00:00', '2026-10-24 10:00:00'),
('application-sample-002', 'student-002', 'drive-northstar-2026', 'Interview Shortlisted', '2026-10-22 10:00:00', '2026-10-27 10:00:00'),
('application-sample-003', 'student-003', 'drive-meridian-2026', 'Offer Accepted', '2026-10-18 10:00:00', '2026-10-26 10:00:00');

INSERT IGNORE INTO selections (application_id, student_id, company_id, drive_id, status, updated_at) VALUES
('application-sample-003', 'student-003', 'company-meridian', 'drive-meridian-2026', 'Offer Accepted', '2026-10-26 10:00:00');

UPDATE students SET placement_status = 'Placed' WHERE id = 'student-003';
