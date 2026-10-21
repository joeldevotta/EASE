# E.A.S.E. Java backend

Spring Boot REST API for the React/TypeScript app. It lives in `backend/` and uses the same camelCase event fields as `src/types/event.ts`. Student accounts are stored in MySQL, passwords are BCrypt-hashed, and approved student sessions use short-lived signed bearer tokens.

## Requirements
- JDK 21+
- Maven 3.9+
- MySQL 8+

## 1. Create database and credentials

Run in MySQL (or let the JDBC URL create the database if your DB user has permission):

```sql
CREATE DATABASE ease CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

Configure environment variables before starting the API. Never commit real credentials.

PowerShell:
```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/ease?serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-mysql-password"
$env:EASE_ADMIN_USERNAME="ease-admin"
$env:EASE_ADMIN_PASSWORD="use-a-long-random-password-at-least-16-chars"
$env:EASE_STUDENT_TOKEN_SECRET="replace-with-a-random-secret-at-least-32-characters-long"
$env:CORS_ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
cd backend
mvn spring-boot:run
```

Bash:
```bash
export DB_URL='jdbc:mysql://localhost:3306/ease?serverTimezone=UTC'
export DB_USERNAME='root'
export DB_PASSWORD='your-mysql-password'
export EASE_ADMIN_USERNAME='ease-admin'
export EASE_ADMIN_PASSWORD='use-a-long-random-password-at-least-16-chars'
export EASE_STUDENT_TOKEN_SECRET='replace-with-a-random-secret-at-least-32-characters-long'
export CORS_ALLOWED_ORIGINS='http://localhost:3000,http://localhost:5173'
cd backend && mvn spring-boot:run
```

The service listens on `http://localhost:8080`. Hibernate creates/updates tables for local development. For production, switch to Flyway migrations and `ddl-auto: validate`.

## API

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | Health check |
| GET | `/api/events` | Public | Approved events only |
| GET | `/api/events/{idOrSlug}` | Public | One approved event |
| POST | `/api/events` | Public | Submit an event; server forces `Pending` |
| GET | `/api/admin/events/pending` | Admin HTTP Basic | Pending review queue |
| PATCH | `/api/admin/events/{id}/status` | Admin HTTP Basic | Approve or reject a pending event |
| POST | `/api/auth/student/register` | Public | Create a pending student account |
| POST | `/api/auth/student/login` | Public | Sign in after approval; returns an 8-hour bearer token |
| GET | `/api/auth/student/me` | Student bearer token | Validate current student session |
| GET | `/api/admin/students/pending` | Admin HTTP Basic | List pending student registrations |
| PATCH | `/api/admin/students/{id}/status` | Admin HTTP Basic | Approve or reject a student registration |

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

## Student registration and approval

Students register with a register number and a password of 10–72 characters. Passwords are stored as BCrypt hashes. New accounts start as `PENDING`; an administrator must approve them before they can sign in. A register number alone does not prove identity, so this approval step must be completed only after checking the student's identity against an authoritative college roster.

List pending registrations:
```powershell
curl.exe -u "$env:EASE_ADMIN_USERNAME:$env:EASE_ADMIN_PASSWORD" http://localhost:8080/api/admin/students/pending
```

Approve a student (replace `STUDENT_ID` with the returned numeric id):
```powershell
curl.exe -u "$env:EASE_ADMIN_USERNAME:$env:EASE_ADMIN_PASSWORD" -X PATCH http://localhost:8080/api/admin/students/STUDENT_ID/status -H "Content-Type: application/json" -d "{\"status\":\"APPROVED\"}"
```

Reject using `{"status":"REJECTED"}`. Keep `EASE_STUDENT_TOKEN_SECRET` private and different from the admin password. Use a randomly generated secret of at least 32 characters, configure it in both local and production backend environments, and use HTTPS in production. Frontend tokens are kept in tab-scoped sessionStorage; avoid introducing XSS and consider an HttpOnly-cookie session architecture before handling highly sensitive data.

## Security notes
- Public reads expose only approved events; submissions are always pending regardless of any client-supplied status.
- Review routes require HTTP Basic credentials for the configured ADMIN user. Passwords are BCrypt-hashed in memory; use HTTPS outside local development.
- Admin credentials must be provided via environment variables; startup intentionally fails if the password is shorter than 16 characters.
- Rejections require a reason, and only pending events can be reviewed.
- CORS origins are configurable. Do not use broad wildcard origins in production.
- This first slice secures API endpoints; the existing frontend admin screen still uses localStorage until its service adapter is connected. Do not treat a hidden frontend page as access control.

## Tests
```bash
mvn test
```

## Frontend connection (next step)
The existing `.env.example` already defines `VITE_API_BASE_URL=http://localhost:8080/api`. The next frontend change should replace the localStorage event adapter with fetch calls, and wire the admin review page to the authenticated admin endpoints. This backend does not change the React app or claim to control the college's separate OD portal.
