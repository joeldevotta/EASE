# E.A.S.E. — Easwari Academic Schedule and Events

E.A.S.E. is a centralized campus event-discovery and academic announcement platform for Easwari Engineering College (Autonomous), designed around the intuitive tactile metaphor of a physical collegiate notice board.

---

## 🏛️ Project Architecture & Tech Stack

- **Framework:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS with custom collegiate corkboard design tokens from `DESIGN.md`
- **Routing:** React Router v7 (`/`, `/events`, `/events/:id`, `/calendar`, `/clubs`, `/announcements`, `/about`, `/contact`, `/submit`, `/admin-review`)
- **Animations:** Framer Motion (signature paper lift and zoom transitions)
- **Local Persistence & Repository:** Safe `storageService` abstraction over `localStorage` with JSON validation and corruption recovery
- **Planned Backend:** Architecture cleanly decoupled for upcoming Java Spring Boot REST API integration

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended, verified on v24.21.0)
- npm (v9+ recommended)

### 2. Installation
```bash
npm install
```

### 3. Development Server
```bash
npm run dev
```
Starts Vite local dev server at `http://localhost:3000`.

### 4. Automated Test Suite
```bash
npm test
```
Runs the automated verification suite testing mock data integrity, date utilities, URL and form validation, local demo persistence, and admin approval workflows.

### 5. Production Build
```bash
npm run build
```
Generates optimized code-split production bundle in `/dist`.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```env
# Planned Java Spring Boot Backend Base URL
# Once Spring Boot is running (e.g., http://localhost:8080), requests can be routed here.
VITE_API_BASE_URL=http://localhost:8080/api

# Official Easwari Engineering College On-Duty (OD) Student Portal URL
# If left empty, the application gracefully prompts students with physical OD authorization procedures.
VITE_OD_PORTAL_URL=https://odportal.srmeaswari.ac.in
```

---

## 📋 Features & Functionality Implemented

1. **Tactile Notice Board Home Page (`/`)**
   - Warm corkboard background, oak bevel perimeter frame, directional drop shadows, and pushpins.
   - Pinned notices with slight degree tilts (`-1.2°` to `+1.5°`) and hover lift physics (`scale(1.01)`, rotation reset, z-index elevation).
   - Authentic ephemera: Hero hackathon banner with prize pool, official COE examination circular with bulldog clip & verified stamp, ROS2 workshop card with green accent, Rotaract club recruitment sheet with washi tape, Meta staff engineer alumni talk, and Cresita '25 teaser.
   - Pinned accessories: "This Week on Campus" tear-off calendar sheet, "Lost & Found Cork" sticky notes, and Student Affairs transport/ID protocol advisory.

2. **Signature Paper Zoom Transition**
   - Selecting any notice smoothly lifts and scales the paper into an expanded, readable view.
   - Displays full description, logistics (dates, times, venue), faculty coordinator and Emp ID, eligibility, days remaining until deadline, and ICS calendar file export.
   - Visible close button and keyboard Escape/backdrop support return the user directly to the board while preserving search/filter state.

3. **Complete Event Discovery & Combined Filters (`/events`)**
   - Live instant keyword search matching title, description, category, department, organizing club, venue, and tags.
   - Multi-filtering working together: Category, Department, Registration Status, Date Range, and Sorting (Urgency/Date, Recently Added, Deadline, Title).
   - Empty state with working one-click filter reset.

4. **Interactive Academic Calendar (`/calendar`)**
   - True monthly grid with previous/next navigation and return-to-today action.
   - Synchronized with the centralized event dataset (no duplicate/hardcoded dates).
   - Category-colored dot indicators on dates with scheduled events.
   - Selected-day agenda highlighting rooms and times. Clicking any agenda notice opens full specifications.

5. **Student Clubs & Wings Directory (`/clubs`)**
   - Pinned profiles for Rotaract, IEEE SB, Robotics & Automation Society, C3 Cultural Committee, SAE Collegiate Club, and Coding Club & GDSC.
   - Recruitment status badges (`Open`, `Opening Soon`, `Closed`).
   - Domain filtering (Technical, Cultural, Social, Innovation) and audition search.
   - Safe external application action with fallback notice if external form is not configured.

6. **Official Academic Circulars (`/announcements`)**
   - Priority categorization: `Urgent Dispatch`, `Important Notice`, `General Information`.
   - Category filters (Academic, Event Deadlines, Workshops, Club Recruitment, Transport & Advisory, Lost & Found).
   - Official reference numbers, verified stamps, and deep links to related event notices.

7. **Institutional About & Contact Pages (`/about`, `/contact`)**
   - Explains E.A.S.E. purpose and autonomous college governance.
   - Clarifies integration boundaries (discovery portal vs official COE hall ticket portal & OD workflows).
   - Contact coordinates: Bharathi Salai, Ramapuram; Helpline +91 44 2249 0853 (Ext 204); Main Block Rm 104; with interactive dispatch inquiry form.

8. **Event Submission Desk (`/submit`)**
   - Validation for required fields, start/end dates (end date not earlier than start date), registration deadlines, and URL protocols (`https://`, `http://`).
   - Submissions receive a unique demo ID and are stored locally in the persistent repository with status `Pending`.
   - Transparent notice explaining local demo storage.

9. **Demo Admin Review Desk (`/admin-review`)**
   - Demonstrates the upcoming Dean / COE verification workflow.
   - Displays `Pending`, `Approved`, and `Rejected` queues.
   - Approving a notice immediately promotes it to the public notice board, events page, and calendar.
   - Rejecting a notice requires an optional reason and prevents public visibility.
   - "Reset Demo Data" action to restore the baseline dataset at any time.

10. **On-Duty (OD) Student Application Action**
    - Separate from event registration.
    - Reads `VITE_OD_PORTAL_URL`. If configured, launches the portal; if unconfigured, transparently guides students to Main Block Room 104 with standard OD guidelines.

---

## 🔌 Future Java Spring Boot Backend Integration Roadmap

When developing the Spring Boot backend, the frontend is already decoupled behind the service layer (`src/services/eventService.ts`, `clubService.ts`, `announcementService.ts`).

### Planned REST Endpoints:
- `GET /api/events` — Retrieve published notices with query parameters (`?category=...&dept=...&status=...`).
- `GET /api/events/{id}` — Retrieve detailed notice by ID or slug.
- `POST /api/events` — Submit notice for review (sets status `PENDING`).
- `PATCH /api/events/{id}/status` — Admin approval/rejection endpoint with RBAC.
- `GET /api/clubs` — Retrieve registered student clubs and recruitment statuses.
- `GET /api/announcements` — Retrieve official circulars and urgent dispatches.

To connect the backend, simply set `VITE_API_BASE_URL=http://localhost:8080/api` in your `.env` file and replace the localStorage storage adapter with `fetch`/`axios` calls in `src/services/`.
