CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    roll_number VARCHAR(30) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    cgpa DECIMAL(3,2) NOT NULL,
    graduation_year INT NOT NULL,
    skills TEXT NOT NULL,
    backlog_count INT NOT NULL DEFAULT 0,
    placement_status VARCHAR(30) NOT NULL DEFAULT 'Not placed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_students_roll_number UNIQUE (roll_number),
    CONSTRAINT uq_students_email UNIQUE (email),
    CONSTRAINT ck_students_cgpa CHECK (cgpa >= 0 AND cgpa <= 10),
    CONSTRAINT ck_students_backlogs CHECK (backlog_count >= 0),
    INDEX idx_students_branch (branch),
    INDEX idx_students_graduation_year (graduation_year),
    INDEX idx_students_placement_status (placement_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(140) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    job_role VARCHAR(140) NOT NULL,
    minimum_cgpa DECIMAL(3,2) NOT NULL,
    eligible_branches TEXT NOT NULL,
    package_lpa DECIMAL(10,2) NOT NULL,
    available_positions INT NOT NULL,
    maximum_backlogs INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT ck_companies_cgpa CHECK (minimum_cgpa >= 0 AND minimum_cgpa <= 10),
    CONSTRAINT ck_companies_positions CHECK (available_positions > 0),
    CONSTRAINT ck_companies_backlogs CHECK (maximum_backlogs >= 0),
    INDEX idx_companies_name (name),
    INDEX idx_companies_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS placement_drives (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    company_id VARCHAR(36) NOT NULL,
    job_title VARCHAR(140) NOT NULL,
    description VARCHAR(4000) NOT NULL DEFAULT '',
    drive_date DATE NOT NULL,
    application_deadline DATE NOT NULL,
    minimum_cgpa DECIMAL(3,2) NOT NULL,
    graduation_year INT NULL,
    maximum_backlogs INT NOT NULL DEFAULT 0,
    package_lpa DECIMAL(10,2) NOT NULL,
    number_of_openings INT NOT NULL,
    stage VARCHAR(40) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_drives_company FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_drives_dates CHECK (application_deadline <= drive_date),
    CONSTRAINT ck_drives_cgpa CHECK (minimum_cgpa >= 0 AND minimum_cgpa <= 10),
    CONSTRAINT ck_drives_backlogs CHECK (maximum_backlogs >= 0),
    CONSTRAINT ck_drives_openings CHECK (number_of_openings > 0),
    INDEX idx_drives_company (company_id),
    INDEX idx_drives_date (drive_date),
    INDEX idx_drives_deadline (application_deadline),
    INDEX idx_drives_stage (stage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS drive_eligible_branches (
    drive_id VARCHAR(36) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    PRIMARY KEY (drive_id, branch),
    CONSTRAINT fk_drive_branches_drive FOREIGN KEY (drive_id) REFERENCES placement_drives(id) ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX idx_drive_branches_branch (branch)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    drive_id VARCHAR(36) NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'Applied',
    assessment_score DECIMAL(5,2) NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_applications_student_drive UNIQUE (student_id, drive_id),
    CONSTRAINT ck_applications_assessment_score CHECK (assessment_score IS NULL OR (assessment_score >= 0 AND assessment_score <= 100)),
    CONSTRAINT fk_applications_student FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_applications_drive FOREIGN KEY (drive_id) REFERENCES placement_drives(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_applications_drive (drive_id),
    INDEX idx_applications_student (student_id),
    INDEX idx_applications_status (status),
    INDEX idx_applications_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS selections (
    application_id VARCHAR(36) NOT NULL PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(36) NOT NULL,
    drive_id VARCHAR(36) NOT NULL,
    status VARCHAR(40) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_selections_application FOREIGN KEY (application_id) REFERENCES applications(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_selections_student FOREIGN KEY (student_id) REFERENCES students(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_selections_company FOREIGN KEY (company_id) REFERENCES companies(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_selections_drive FOREIGN KEY (drive_id) REFERENCES placement_drives(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_selections_student_status (student_id, status),
    INDEX idx_selections_company (company_id),
    INDEX idx_selections_drive (drive_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
