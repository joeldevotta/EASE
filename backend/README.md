# E.A.S.E. Java backend (events first)

Spring Boot REST API for the React/TypeScript app, in `backend/`. Lost & Found submissions, images, and the admin review queue are connected to this API when `VITE_API_BASE_URL` is configured. Events still use the frontend's local demo storage. The API uses the same camelCase event fields as `src/types/event.ts`; visual-only notice-board fields are accepted and persisted so the UI can retain its design.

## Requirements
- JDK 25+
- Maven 3.9+
- MySQL 8+

### Windows JDK selection

If Maven picks up an older JDK from `JAVA_HOME`, use the project-local launcher to run Maven with JDK 27 without changing global Windows environment variables:

```powershell
.\backend\mvn-jdk.cmd -version
.\backend\mvn-jdk.cmd clean verify
.\backend\mvn-jdk.cmd spring-boot:run
```

The launcher defaults to `C:\Program Files\Java\jdk-27`. Set `EASE_JDK_HOME` in the current terminal first to use another JDK 25+ installation.

## 1. Create database and credentials

Run in MySQL (or let the JDBC URL create the database if your DB user has permission):

```sql
CREATE DATABASE ease CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

For local Windows development, copy the example config and replace both placeholder passwords with your existing MySQL root password and a random EASE admin password. The local file is ignored by Git and is loaded only by this backend. Never commit it or real credentials.

PowerShell:
```powershell
$env:CORS_ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
Copy-Item .\backend\application-local.example.yml .\backend\application-local.yml
# Edit backend\application-local.yml and replace both password placeholders.
.\backend\mvn-jdk.cmd spring-boot:run
```

Bash:
```bash
export CORS_ALLOWED_ORIGINS='http://localhost:3000,http://localhost:5173'
cp backend/application-local.example.yml backend/application-local.yml
# Edit backend/application-local.yml and replace both password placeholders.
backend/mvn-jdk.cmd spring-boot:run
```

Alternatively, supply `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `EASE_ADMIN_USERNAME`, and `EASE_ADMIN_PASSWORD` as environment variables. These override the corresponding local YAML values. The default database URL targets MySQL on `localhost:3306`, database `ease`; its `createDatabaseIfNotExist=true` option can create that schema only if the configured MySQL user has permission.

The service listens on `http://localhost:8080`. Hibernate creates/updates tables for local development (`ddl-auto: update` also adds Lost & Found image metadata columns). For production, switch to Flyway migrations and `ddl-auto: validate`.

### Lost & Found images (local development)

Reports may include an optional JPEG, PNG, or WebP photo (5 MB default). Files are stored on the local filesystem, not in the database and not in a cloud bucket unless you later replace `LostFoundImageStorageService`.

```powershell
$env:EASE_LOST_FOUND_UPLOAD_DIR="C:\ease-data\lost-found-images"
# optional override in bytes (default 5242880 = 5 MB)
$env:EASE_LOST_FOUND_MAX_FILE_SIZE_BYTES="5242880"
```

Default upload directory is `./data/lost-found-images` relative to the backend process working directory. Create it if you want a known location; the API creates it on first upload.

Production still required:
- Persistent disk (or swap the storage service for object storage)
- `EASE_LOST_FOUND_UPLOAD_DIR` pointing at that disk
- HTTPS and locked-down CORS origins
- Flyway (or equivalent) instead of Hibernate `ddl-auto: update`

## API

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Health check |
| GET | `/api/events` | Public | Approved events only |
| GET | `/api/events/{idOrSlug}` | Public | One approved event |
| POST | `/api/events` | Public | Submit an event; server forces `Pending` |
| GET | `/api/admin/events/pending` | Admin HTTP Basic | Pending review queue |
| PATCH | `/api/admin/events/{id}/status` | Admin HTTP Basic | Approve or reject a pending event |
| GET | `/api/lost-found` | Public | Approved Lost & Found reports only |
| GET | `/api/lost-found/{id}/image` | Public | Photo for an approved report (404 if pending, missing, or rejected) |
| POST | `/api/lost-found` | Public | JSON or multipart submit; always stored as `Pending` |
| GET | `/api/admin/lost-found` | Admin HTTP Basic | Review queue, including reporter contact |
| GET | `/api/admin/lost-found/{id}/image` | Admin HTTP Basic | Photo for any report that has one |
| PATCH | `/api/admin/lost-found/{id}/status` | Admin HTTP Basic | Approve or reject a pending report |

Optional public list filters: `?category=Workshop&dept=CSE&status=Open`. `dept` filters department and `status` filters registration status.

Submission body uses the frontend's `EventItem` shape excluding server-owned `id`, `createdAt`, `updatedAt`, and `publicationStatus`. Required fields: `title`, `description`, `category`, `startDate`, `startTime`, `endDate`, `endTime`, `venue`, `department`, `organizingClub`, `facultyCoordinator`, `eligibility`, `registrationDeadline`, `registrationStatus`. Date values accept `YYYY-MM-DD` or an ISO date-time string.

Example submit:
```bash
curl -X POST http://localhost:8080/api/events \
  -H 'Content-Type: application/json' \
  -d '{"title":"CSE Workshop","description":"Intro workshop","category":"Workshop","startDate":"2026-11-05","startTime":"09:00 AM","endDate":"2026-11-05","endTime":"12:00 PM","venue":"Seminar Hall","department":"Computer Science and Engineering (CSE)","organizingClub":"Coding Club","facultyCoordinator":"Faculty Coordinator","eligibility":"All students","registrationDeadline":"2026-11-04","registrationStatus":"Open"}'
```

Example approve (replace event ID):
```bash
curl -u "$EASE_ADMIN_USERNAME:$EASE_ADMIN_PASSWORD" -X PATCH \
  http://localhost:8080/api/admin/events/EVENT_ID/status \
  -H 'Content-Type: application/json' -d '{"status":"Approved"}'
```

Example reject:
```bash
curl -u "$EASE_ADMIN_USERNAME:$EASE_ADMIN_PASSWORD" -X PATCH \
  http://localhost:8080/api/admin/events/EVENT_ID/status \
  -H 'Content-Type: application/json' -d '{"status":"Rejected","rejectionReason":"Please include the faculty approval reference."}'
```

## Security notes
- Public reads expose only approved events; submissions are always pending regardless of any client-supplied status.
- Review routes require HTTP Basic credentials for the configured ADMIN user. Passwords are BCrypt-hashed in memory; use HTTPS outside local development.
- Admin credentials must be provided via environment variables; startup intentionally fails if the password is shorter than 16 characters.
- Rejections require a reason, and only pending events can be reviewed.
- CORS origins are configurable. Do not use broad wildcard origins in production.
- The frontend uses this authenticated admin API when configured; without a backend URL, its local demo review desk uses browser storage. Frontend route protection is not a substitute for the backend's authorization.

## Tests
```bash
mvn test
```

## Frontend integration status
The `.env.example` defines `VITE_API_BASE_URL=http://localhost:8080/api`. Lost & Found uses the API for public reports, multipart image uploads, and authenticated administrative review when this variable is set. Events continue to use the local demo adapter and can be connected in a later change. This backend does not control the college's separate OD portal.
