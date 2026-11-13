# PlaceX

PlaceX is a college placement management app with a React, TypeScript, and Tailwind frontend and a Java 21, Spring Boot, Spring JDBC, and MySQL API. Placement records come from MySQL after an administrator connects. Without a working API connection, the frontend labels its local browser data as a development fallback.

## Prerequisites

- Java 21 (Java 17 or newer can be used by changing `java.version` in `backend/pom.xml`)
- Maven 3.9 or newer
- MySQL 8.0 or newer
- Node.js 20 or newer and npm

## MySQL setup

Create a database and an application account in MySQL:

```sql
CREATE DATABASE placex CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'placex_app'@'localhost' IDENTIFIED BY 'choose-a-local-password';
GRANT ALL PRIVILEGES ON placex.* TO 'placex_app'@'localhost';
```

The Spring Boot application loads `backend/src/main/resources/schema.sql` and `data.sql` on startup. The schema and sample inserts are idempotent; edits to existing database rows are preserved across restarts.

Set the database URL, username, password, and a long random administrator token in the backend shell. The values remain outside source control:

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/placex?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
$env:DB_USERNAME = 'placex_app'
$env:DB_PASSWORD = 'choose-a-local-password'
$env:PLACEX_ADMIN_TOKEN = 'replace-with-a-long-random-secret'
$env:PLACEX_FRONTEND_ORIGINS = 'http://localhost:5173,http://127.0.0.1:5173'
```

Run the API from the `backend` directory:

```powershell
mvn spring-boot:run
```

The API listens on `http://localhost:8080`; `GET /api/health` reports API and database availability. All placement endpoints require the `X-Admin-Token` header. The API uses Spring Security and a single environment-configured administrator role; keep the token private and use HTTPS outside local development. The browser stores the token in session storage for the current tab and does not store a password.

## Frontend setup

From the `frontend` directory:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` if the backend uses a different URL. Open the app, visit **Settings → Backend connection**, paste the `PLACEX_ADMIN_TOKEN` value, then select **Connect and load MySQL records**. The frontend keeps the existing browser demo data available when the API cannot be reached, and labels that state so browser-only changes are not mistaken for database writes.

## API overview

All endpoints except `GET /api/health` require `X-Admin-Token: <PLACEX_ADMIN_TOKEN>`.

| Area | Endpoints |
| --- | --- |
| Students | `GET/POST /api/students`, `GET/PUT/DELETE /api/students/{id}`; query filters `q`, `branch`, `placementStatus`, `graduationYear` |
| Companies | `GET/POST /api/companies`, `GET/PUT/DELETE /api/companies/{id}` |
| Drives | `GET/POST /api/drives`, `GET/PUT/DELETE /api/drives/{id}`, `GET /api/drives/{id}/eligible-students`, `GET/POST /api/drives/{id}/applications` |
| Eligibility | `POST /api/eligibility/check` with `{ "studentId": "student-001", "driveId": "drive-northstar-2026" }` |
| Applications and outcomes | `GET /api/applications`, `GET /api/applications/{id}`, `PATCH /api/applications/{id}/status`, `PATCH /api/applications/{id}/assessment` with `{ "score": 87.5 }`, `DELETE /api/applications/{id}`, `GET /api/selections` |

Example application registration:

```powershell
curl.exe -X POST http://localhost:8080/api/drives/drive-northstar-2026/applications `
  -H "Content-Type: application/json" -H "X-Admin-Token: $env:PLACEX_ADMIN_TOKEN" `
  -d '{"studentId":"student-006"}'
```

The same Java eligibility service backs individual checks, batch eligible-student lists, and application registration. Application statuses move forward through the hiring pipeline; rejected and accepted offers are final. Student placement status is recalculated in the same transaction as a selection outcome.

## Tests and builds

```powershell
cd backend
mvn test
mvn package
cd ..\frontend
npm run build
```

Backend unit tests cover request validation, eligibility pass/fail explanations, duplicate applications, and permitted status transitions. A MySQL instance is required to run the application and exercise repository operations.
