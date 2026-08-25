# TodoFlow — Project Planning Document

**Project:** TodoFlow  
**Type:** Academic Git & DevOps team assignment (Option B — Todo List Application)  
**Team size:** 3 students  
**Stack:** React + Vite | Node.js + Express | MongoDB + Mongoose | Vercel + Render + MongoDB Atlas  

---

## 1. Project Overview

TodoFlow is a production-quality full-stack Todo List application designed as a ready-to-use academic project for a three-student Git & DevOps assignment. It demonstrates end-to-end software delivery: collaborative branching, pull requests, CI/CD, REST API design, frontend/backend integration, automated testing, and live deployment.

The product itself is intentionally focused. Users can create, edit, complete, delete, filter, and search tasks, with priorities, due dates, and descriptions. Persistence is handled by a MongoDB-backed Express API. The UI is responsive and polished, with clear loading, empty, and error states.

**Why this scope fits the assignment:** Option B requires add/delete/complete/filter, persistence, responsive UI, and a task counter. TodoFlow satisfies those requirements and adds a small set of professional extras (search, priority, due date, edit, clear completed) without authentication, real-time sync, or other complexity that would dilute the DevOps learning goals.

---

## 2. Project Goals

| Goal | Rationale |
|------|-----------|
| Deliver a working Todo app that exceeds a basic CRUD demo | Shows polish suitable for academic evaluation |
| Keep features appropriately scoped | Avoids scope creep that blocks CI/CD and deployment milestones |
| Practice industry-style Git workflow | `main` / `develop` / `feature/*`, PRs, and code review |
| Demonstrate CI and CD with GitHub Actions | Validates every PR and deploys from protected branches |
| Split ownership by role | Clear accountability for DevOps, Backend, and Frontend |
| Ship a live demo | Frontend on Vercel, backend on Render, data on MongoDB Atlas |
| Document thoroughly | README becomes the primary handoff artifact for markers and teammates |

**Success criteria:** A deployed app where a user can manage tasks end-to-end; green CI on PRs; documented API and setup; each student has visible commits and PRs in their role area.

---

## 3. Functional Requirements

### Must-have (assignment Option B)

1. **Add tasks** — Create a task with at least a title.
2. **Delete tasks** — Remove a task permanently (with confirmation).
3. **Mark complete / incomplete** — Toggle task completion status.
4. **Filter tasks** — Views for All, Active, and Completed.
5. **Persistent storage** — Tasks survive refresh via MongoDB (not only browser memory).
6. **Responsive UI** — Usable on mobile, tablet, and desktop.
7. **Task counter** — Show counts (e.g., total, active, completed).

### Extended product requirements (still in scope)

8. **Edit tasks** — Update title, description, priority, and due date.
9. **Search tasks** — Client-side filter by title/description text.
10. **Task priority** — Low / Medium / High.
11. **Due date** — Optional date field.
12. **Task description** — Optional longer text.
13. **Clear completed** — Bulk-delete all completed tasks.
14. **UX states** — Loading, empty, and error feedback for all primary flows.

### Explicitly out of scope

- Authentication / user accounts  
- Multi-user ownership or sharing  
- Notifications / reminders  
- Real-time (WebSockets)  
- Payments, analytics dashboards, mobile native apps  

**Why:** Authentication alone would dominate backend, testing, and deployment effort. The assignment grades Git/DevOps practices more than product breadth.

---

## 4. Non-Functional Requirements

| Area | Requirement | Why |
|------|-------------|-----|
| **Performance** | API list/create/update under ~1s on typical Atlas free tier; UI remains responsive during fetches | Academic demo should feel snappy |
| **Reliability** | Backend returns consistent JSON errors; frontend recovers gracefully | Markers will break happy paths |
| **Maintainability** | Clear folder structure, small modules, shared conventions | Three people must work in parallel |
| **Testability** | Backend API covered by Jest + Supertest; key frontend logic by Vitest | CI must have something meaningful to run |
| **Security (lightweight)** | Input validation, CORS restricted to frontend origin(s), no secrets in repo | Enough for a public demo without auth |
| **Accessibility (basic)** | Semantic buttons/labels, keyboard-usable controls, readable contrast | Professional baseline without WCAG audit overhead |
| **Documentation** | README covers setup, env vars, scripts, API, branches, deploy | Required deliverable for the assignment |
| **Deployability** | Separate frontend/backend deploys; env-based config | Matches Vercel + Render choice |

---

## 5. Core Features vs Additional Features

### Core features (ship first — assignment baseline)

| Feature | Notes |
|---------|--------|
| Create task | Title required |
| View task list | From API |
| Toggle complete | PATCH or PUT |
| Delete task | With confirm dialog |
| Filter All / Active / Completed | Client or query-param based |
| Task counters | Derived from list or dedicated stats |
| Responsive layout | Mobile-first CSS |
| Persist via backend + MongoDB | Primary persistence strategy |

### Additional features (ship second — polish layer)

| Feature | Notes |
|---------|--------|
| Edit task | Inline or modal form |
| Search | Local filter on loaded tasks |
| Priority | Enum field |
| Due date | ISO date string |
| Description | Optional string |
| Clear completed | Dedicated endpoint or bulk client deletes |
| Loading / empty / error states | Shared UI patterns |
| Delete confirmation | Modal or confirm dialog |

### Deferred (Future Scope only)

- Categories/tags, drag-and-drop reorder, dark mode, PWA offline, i18n, auth  

**Why this split:** Core unlocks Option B grading early. Additional features create meaningful frontend/backend PRs without blocking DevOps pipelines.

---

## 6. User Stories

### Core

1. **As a user**, I want to add a task with a title so that I can track something I need to do.  
2. **As a user**, I want to see all my tasks so that I know what is pending.  
3. **As a user**, I want to mark a task complete so that I can reflect progress.  
4. **As a user**, I want to mark a completed task active again so that I can reopen work.  
5. **As a user**, I want to delete a task so that I can remove items I no longer need.  
6. **As a user**, I want to filter All / Active / Completed so that I can focus on a subset.  
7. **As a user**, I want to see how many tasks are active/completed so that I understand my workload at a glance.  
8. **As a user**, I want my tasks to persist after refresh so that I do not lose work.

### Additional

9. **As a user**, I want to edit a task’s details so that I can correct mistakes without deleting.  
10. **As a user**, I want to search tasks so that I can find one quickly in a longer list.  
11. **As a user**, I want to set priority so that urgent work stands out.  
12. **As a user**, I want to set an optional due date so that I can plan deadlines.  
13. **As a user**, I want to add a description so that I can capture context.  
14. **As a user**, I want to clear all completed tasks so that I can tidy the list in one action.  
15. **As a user**, I want confirmation before delete so that I avoid accidental removals.  
16. **As a user**, I want clear loading and error messages so that I know when the app is working or failing.

### DevOps / process stories (team)

17. **As a teammate**, I want feature branches and PRs into `develop` so that integration stays controlled.  
18. **As a release manager**, I want CI on every PR so that broken builds never merge blindly.  
19. **As a team**, I want production deploys from `main` so that the live demo stays stable.

---

## 7. Frontend Architecture

### Stack

- **React 18+** with **Vite** — Fast DX, standard for modern SPA teaching projects.  
- **React Router** (optional, light) — Prefer a single-page app with filter state in URL query (`?filter=active`) for shareable views; avoid multi-page complexity.  
- **CSS approach:** Plain CSS modules or a small global stylesheet with CSS variables — Avoid heavy UI kits; keep styling ownership clear for the Frontend Developer.  
- **HTTP client:** Native `fetch` wrapper — Fewer dependencies; easy to mock in Vitest.  
- **Testing:** Vitest + React Testing Library for components/hooks; keep E2E optional/out of scope.

### Architectural style

**SPA talking to a REST API**, with:

- `api/` — HTTP functions (`getTasks`, `createTask`, …)  
- `components/` — Presentational UI  
- `hooks/` — e.g. `useTasks` for fetch/mutate/state  
- `utils/` — Filters, counters, date formatting  

**State model:** Local React state (and/or a thin custom hook). **No Redux/Zustand** unless the team already knows them — unnecessary for one resource type.

**Why:** Matches assignment scale, minimizes learning curve for integration, and keeps frontend PRs reviewable.

### Key UI concerns

- Mobile-first layout (stacked form + list on small screens)  
- Optimistic UI is optional; prefer **request → loading → refresh list** for clearer error handling in an academic context  
- Accessibility: labeled inputs, button roles, focus on dialogs  

---

## 8. Backend Architecture

### Stack

- **Node.js + Express** — Ubiquitous, easy to deploy on Render.  
- **Mongoose** — Schema validation + Atlas-friendly ODM.  
- **dotenv** — Local config; production uses host env vars.  
- **cors** — Allow Vercel frontend origin.  
- **express-validator** or Mongoose validators — Lightweight input checks.  
- **Jest + Supertest** — HTTP-level API tests without a browser.

### Architectural style

Simple layered structure:

```
routes → controllers → models
         ↘ middleware (error, validate)
```

Avoid microservices, GraphQL, or clean-architecture overkill.

### Responsibilities

| Layer | Role |
|-------|------|
| Routes | Map HTTP methods/paths |
| Controllers | Parse request, call model, shape response |
| Models | Schema, defaults, indexes if needed |
| Middleware | CORS, JSON parsing, central error handler |
| Config | DB URI, port, allowed origins |

**Why Express + Mongoose:** Directly matches the stated technology direction, has abundant teaching material, and pairs cleanly with Supertest for CI.

### Environment

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | Atlas connection string |
| `PORT` | Server port (Render sets this) |
| `CORS_ORIGIN` | Frontend URL(s) |
| `NODE_ENV` | `development` / `test` / `production` |

Use a separate test database or in-memory MongoDB (`mongodb-memory-server`) for CI — **recommended** so tests do not touch production Atlas data.

---

## 9. Database Architecture

### Database

- **MongoDB Atlas** (free tier) — Managed hosting, no local DB required for demos.  
- **Database name:** e.g. `todoflow`  
- **Collection:** `tasks`

### Task document schema (logical)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | auto | MongoDB primary key |
| `title` | String | yes | Trimmed; max length ~200 |
| `description` | String | no | Default `""`; max ~2000 |
| `completed` | Boolean | yes | Default `false` |
| `priority` | String enum | yes | `low` \| `medium` \| `high`; default `medium` |
| `dueDate` | Date \| null | no | Optional |
| `createdAt` | Date | auto | `timestamps: true` |
| `updatedAt` | Date | auto | `timestamps: true` |

### Indexes (optional but useful)

- `{ completed: 1 }` — Faster filtered queries if filtering is done server-side  
- `{ createdAt: -1 }` — Default sort newest first  

**Why one collection:** One aggregate root (Task) matches the product. No users collection without auth. Keeps migrations nonexistent and Atlas setup trivial.

### Soft delete?

**No.** Hard delete is simpler and matches “delete task” expectations. Clear-completed also hard-deletes.

---

## 10. REST API Overview

Base URL (local): `http://localhost:5000/api`  
Base URL (prod): `https://<render-service>.onrender.com/api`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check for Render / CI smoke |
| `GET` | `/api/tasks` | List tasks; optional `?completed=true\|false` |
| `GET` | `/api/tasks/stats` | Counts: total, active, completed *(optional convenience)* |
| `GET` | `/api/tasks/:id` | Get one task |
| `POST` | `/api/tasks` | Create task |
| `PUT` / `PATCH` | `/api/tasks/:id` | Update task (edit / toggle complete) |
| `DELETE` | `/api/tasks/:id` | Delete one task |
| `DELETE` | `/api/tasks?completed=true` or `DELETE /api/tasks/completed` | Clear completed |

**Recommendation:** Prefer `PATCH /api/tasks/:id` for partial updates and a dedicated `DELETE /api/tasks/completed` for clear-completed — clearer than overloaded query deletes.

### Example create body

```json
{
  "title": "Finish README",
  "description": "Document setup and deploy steps",
  "priority": "high",
  "dueDate": "2026-09-01"
}
```

### Example response shape

```json
{
  "success": true,
  "data": { /* task or array */ },
  "error": null
}
```

Or simpler `{ data }` / `{ message, error }` — **pick one convention early** and use it everywhere.

### Status codes

| Code | When |
|------|------|
| 200 | Successful read/update/delete |
| 201 | Created |
| 400 | Validation error |
| 404 | Task not found |
| 500 | Unexpected server/DB error |

**Why REST:** Assignment-friendly, easy to test with Supertest, natural fit for React `fetch`, and deployable without gateway complexity.

**Search:** Implement **client-side** on the loaded list for academic simplicity. Server-side search can be Future Scope.

---

## 11. Component Architecture

### Suggested component tree

```
App
├── Header (brand + short tagline)
├── TaskStats (counters)
├── TaskToolbar
│   ├── SearchInput
│   ├── FilterTabs (All | Active | Completed)
│   └── ClearCompletedButton
├── TaskForm (create / edit)
├── TaskList
│   └── TaskItem
│       ├── TaskCheckbox
│       ├── TaskDetails (title, description, priority, due date)
│       └── TaskActions (edit, delete)
├── ConfirmDialog (delete)
├── LoadingState
├── EmptyState
└── ErrorBanner / ErrorState
```

### Ownership guidelines

| Component group | Owner |
|-----------------|--------|
| Layout, form, list, filters, dialogs, styles | Frontend Developer |
| API client contract consumed by hooks | Frontend + Backend agree via OpenAPI-ish README table |
| Shared types/constants (priority enums) | Document in README; optional `shared/` only if needed |

**Why this granularity:** Enough components for meaningful PRs and Vitest unit tests, not so many that the UI becomes a design-system project.

---

## 12. Data Flow

### Read (initial load)

```
App mount
  → useTasks() calls GET /api/tasks
  → set loading=true
  → on success: store tasks in state, loading=false
  → on failure: set error message, loading=false
  → TaskList / TaskStats derive view from state + filter + search
```

### Create

```
TaskForm submit
  → POST /api/tasks
  → on success: append task to state (or refetch)
  → on failure: show form/API error
```

### Update (edit / toggle)

```
TaskItem action
  → PATCH /api/tasks/:id
  → on success: replace task in state
  → on failure: show error; optionally revert optimistic change if used
```

### Delete / clear completed

```
ConfirmDialog accept
  → DELETE endpoint
  → on success: remove from state / refetch
```

### Filter & search (client)

```
tasks (from API)
  → filter by completed status
  → filter by search query (title/description)
  → render TaskList
  → counters from full list (or stats endpoint)
```

**Why client-side filter/search:** Reduces API surface and backend test matrix; still demonstrates rich UI behavior. Server filter via `?completed=` remains available for efficiency and API completeness.

---

## 13. Error Handling Strategy

### Backend

1. **Validation errors (400)** — Missing title, invalid priority, bad ObjectId.  
2. **Not found (404)** — Unknown task id.  
3. **Central error middleware** — Catch unexpected errors; log server-side; return safe JSON message.  
4. **DB connection failures** — Fail fast on startup in production; health check reflects readiness if feasible.  
5. **Never leak** stack traces or Atlas URIs to clients in production.

### Frontend

1. **Network / 5xx** — Global or section `ErrorBanner` with retry.  
2. **4xx validation** — Inline form messages from API `message`.  
3. **Empty vs error** — Empty state only when request succeeded and list length is 0.  
4. **Delete confirm** — Prevent accidents; cancel is a no-op.  
5. **Loading disable** — Disable submit buttons while requests in flight to prevent double posts.

### Operational

- Render free tier cold starts: frontend should tolerate slow first request (loading spinner, not a hard timeout panic).  
- Document this cold-start behavior in README so markers are not surprised.

**Why:** Explicit error/empty/loading separation is a common rubric item and makes the app feel production-aware without heavy observability tooling.

---

## 14. Testing Strategy

### Backend (Jest + Supertest) — Backend Developer owns

| Area | Examples |
|------|----------|
| Health | `GET /api/health` → 200 |
| Create | Valid body → 201; missing title → 400 |
| List | Returns array; filter by completed |
| Get by id | 200 / 404 |
| Update | Toggle completed; edit fields |
| Delete | 200 then 404 on second delete |
| Clear completed | Only completed removed |
| Stats | Counts match seeded data |

Use **mongodb-memory-server** or a dedicated Atlas/dev test DB. Prefer memory server for CI isolation.

### Frontend (Vitest + RTL) — Frontend Developer owns

| Area | Examples |
|------|----------|
| FilterTabs | Changes visible filter |
| Search | Narrows rendered items given props/state |
| TaskStats | Renders correct counts from props |
| TaskForm | Validation: empty title blocked |
| TaskItem | Calls handlers on toggle/delete |
| api client | Mock `fetch`; maps responses |

**Avoid** brittle full-app E2E in CI unless time allows (Playwright optional Future Scope).

### CI expectation

- Backend tests must pass on every PR touching `backend/` or shared config.  
- Frontend unit tests must pass on every PR touching `frontend/`.  
- Monorepo workflow can always run both for simplicity (recommended for academic clarity).

**Why this depth:** Enough to prove CI value and API correctness without turning the course into a QA engineering project.

---

## 15. Deployment Architecture

```
┌─────────────┐     HTTPS      ┌──────────────────┐
│   Browser   │ ─────────────► │ Vercel (Frontend)│
│  React SPA  │                │  Static / Vite   │
└─────────────┘                └────────┬─────────┘
                                        │ REST
                                        ▼
                               ┌──────────────────┐
                               │ Render (Backend) │
                               │ Node / Express   │
                               └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │  MongoDB Atlas   │
                               └──────────────────┘
```

| Piece | Platform | Why |
|-------|----------|-----|
| Frontend | **Vercel** | Excellent Vite/React support; preview deploys on PRs possible |
| Backend | **Render** | Simple Node web service; free/student-friendly |
| Database | **MongoDB Atlas** | Managed Mongo; matches Mongoose stack |
| CI/CD orchestration | **GitHub Actions** | Required by assignment; triggers checks and deploy hooks |

### Config

- Frontend env: `VITE_API_BASE_URL` pointing at Render URL.  
- Backend env: `MONGODB_URI`, `CORS_ORIGIN` (Vercel URL).  
- Secrets only in GitHub / Vercel / Render dashboards — never committed.

### Environments

| Environment | Git ref | Purpose |
|-------------|---------|---------|
| Production | `main` | Live demo for markers |
| Staging / integration | `develop` (optional auto-deploy) | Pre-prod verification |
| Local | developer machines | Day-to-day work |

**Why split hosts:** Matches stated direction; forces real CORS and env-config practice (valuable DevOps learning).

---

## 16. Git Branch Strategy

### Long-lived branches

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready code only | PR required; CI green; no direct pushes |
| `develop` | Integration branch | PR required from `feature/*`; CI green |

### Short-lived branches

```
feature/<area>-<short-description>
fix/<short-description>
chore/<short-description>
docs/<short-description>
```

Examples: `feature/backend-task-crud`, `feature/frontend-task-list`, `chore/ci-github-actions`.

### Merge strategy (mandatory)

| Path | Method | Merge style |
|------|--------|-------------|
| Feature / chore / docs / fix → `develop` | Pull Request | **Merge commit** (`Create a merge commit` / no-fast-forward) |
| `develop` → `main` | Pull Request | **Merge commit** (no-fast-forward) |

**Rules:**

1. Branch from `develop`.  
2. Implement + commit in small logical chunks using each student’s own GitHub identity.  
3. Open a PR targeting `develop`.  
4. At least one other role performs a code review (Approve + written comments).  
5. Merge with a **normal merge commit** — **do not use squash-only merging**.  
6. When release-ready, open PR `develop` → `main` and merge with a merge commit.  
7. Production deploy runs from `main` after merge.

**Why this strategy:**

- The assignment evaluates collaboration history (branches, PRs, reviews, merge commits).  
- Merge commits preserve the branch topology and make “at least 3 merged branches” and merge evidence easy to show.  
- Squash-only merging collapses PR history into a single commit on the target branch and weakens visible collaboration evidence — **forbidden as the default team policy**.  
- Fast-forward-only merges are avoided for integration/release PRs so a distinct merge commit remains in history.

**Why GitFlow-lite:** Matches the required `main` / `develop` / `feature/*` model without release-branch ceremony.

---

## 17. CI/CD Strategy

### CI workflow file

Path: `.github/workflows/ci.yml`

### CI triggers (required)

CI **must** run on:

| Event | Branches |
|-------|----------|
| `push` | `main` |
| `push` | `develop` |
| `push` | `feature/**` |
| `pull_request` | targeting `main` |
| `pull_request` | targeting `develop` |

### CI pipeline steps (required, in order)

For every CI run, the workflow must:

1. **Checkout** the repository  
2. **Set up Node.js** (pinned LTS version, e.g. 20.x)  
3. **Install dependencies** for `frontend/` and `backend/`  
4. **Lint** frontend and backend (required — not optional; ESLint)  
5. **Run frontend tests** (Vitest)  
6. **Run backend tests** (Jest + Supertest)  
7. **Build** the frontend (`npm run build` in `frontend/`)  
8. Report **final success or failure** — the workflow **fails** if any required step fails  

Jobs may run frontend and backend in parallel, but the overall workflow status must be red if any required check fails. Branch protection on `main` and `develop` must require the CI workflow to pass before merge.

### CD workflow

Path: `.github/workflows/deploy.yml`

| Trigger | Action |
|---------|--------|
| Push / merge to `main` | Deploy frontend (Vercel) + backend (Render) |

Implementation: GitHub Actions deploy steps and/or deploy hooks, with platform Git integration allowed as a supplement. A visible Actions deployment workflow remains required for assignment evidence.

### Quality gates

- No direct pushes to `main` or `develop` (branch protection).  
- Required status checks: CI workflow.  
- PR template: summary, test plan, screenshots for UI changes.  
- README displays CI build status badges.

---

## 18. Three-Student Role Allocation

Ownership below is **mandatory** for grading clarity. Collaboration is expected; ownership means who leads and is accountable.

### 1. DevOps / Release Manager

**Owns:**

| Area | Details |
|------|---------|
| GitHub repository | Create/configure public repo, collaborators, defaults |
| Branch protection | Protect `main` and `develop`; require PR + CI |
| GitHub Actions | `ci.yml`, `deploy.yml`, workflow maintenance |
| Deployment | Vercel + Render wiring, production env placement guidance |
| Release | Coordinate `develop` → `main` release PR and cut |
| Merge conflict coordination | Schedule and supervise the intentional conflict exercise |
| CI/CD documentation | README sections: CI/CD, deployment process, badges, branch protection notes |

**Does not own:** Task business logic or primary UI styling.

### 2. Backend Developer

**Owns:**

| Area | Details |
|------|---------|
| Express API | App structure, routes, controllers, middleware |
| MongoDB | Atlas connection configuration (with DevOps for secrets placement) |
| Mongoose model | Task schema, defaults, validation rules |
| Validation | Request/body validation and error responses |
| Backend tests | Jest + Supertest suite |
| API documentation | README API section (endpoints, examples, status codes) |

Also: CORS, central error handler, optional seed script for demo data.

### 3. Frontend Developer

**Owns:**

| Area | Details |
|------|---------|
| React UI | Components, hooks, app shell |
| Responsive styling | Mobile-first CSS; desktop and mobile layouts |
| Frontend features | CRUD UI, filters, search, counters, polish states |
| API integration | `tasksApi` / `useTasks`, env base URL |
| Frontend tests | Vitest + React Testing Library |
| README coordination | Overall README structure, maintenance, and completeness |
| User documentation | How to use the live app (filters, add/edit/complete/delete) |

### README contribution model

- **Frontend Developer** coordinates and maintains `README.md` end-to-end.  
- **DevOps** supplies CI/CD, deployment, branch strategy, badges, merge-conflict narrative drafts.  
- **Backend** supplies API docs, DB/setup env notes, testing commands for backend.  
- Frontend integrates screenshots, features, user docs, contribution matrix formatting, and final polish.

### Collaboration norms

- PRs reviewed by at least one other student (written review comments).  
- API contract changes require Backend + Frontend acknowledgment in the PR.  
- DevOps reviews workflow and deployment config changes.  
- Each student commits only from their own GitHub account.

---

## 19. Suggested Feature Branches

Ordered roughly by dependency (foundation → product → polish → evidence):

| Branch | Owner | Purpose |
|--------|-------|---------|
| `chore/repo-scaffold` | DevOps (+ team) | Monorepo folders, `.gitignore`, base packages, stub README |
| `chore/ci-github-actions` | DevOps | Full CI: push + PR triggers, lint, test, build |
| `feature/backend-health-db` | Backend | Express boot, health route, Mongo connection |
| `feature/backend-task-model-api` | Backend | Task schema + full CRUD endpoints |
| `feature/backend-filters-stats-clear` | Backend | Filter query, stats, clear completed |
| `feature/backend-api-tests` | Backend | Jest + Supertest coverage |
| `feature/frontend-app-shell` | Frontend | Vite app, layout, responsive shell, brand |
| `feature/frontend-task-crud-ui` | Frontend | Form, list, toggle, delete + confirm |
| `feature/frontend-filter-search-stats` | Frontend | Filters, search, counters |
| `feature/frontend-priority-duedate` | Frontend | Extra fields in form/item display |
| `feature/frontend-api-integration` | Frontend | Wire to real API; env base URL |
| `feature/frontend-unit-tests` | Frontend | Vitest + RTL |
| `chore/cd-deploy-workflows` | DevOps | Deploy workflow + platform config docs |
| `docs/team-contributions-backend` | Backend | Conflicting branch for intentional merge conflict (see §23) |
| `docs/team-contributions-frontend` | Frontend | Conflicting branch for intentional merge conflict (see §23) |
| `docs/readme-comprehensive` | Frontend (all contribute) | Final README assembly |
| `release/v1-develop-to-main` | DevOps | First production release PR |

**Why many small branches:** Creates a realistic PR/review/merge-commit history for Git grading.

---

## 20. Suggested Meaningful Commit Areas

Commits should be small and intentional. Group work into areas such as:

1. **Scaffold** — Create `frontend/` and `backend/` package manifests.  
2. **CI** — Add workflow with required triggers; lint/test/build.  
3. **Schema** — Introduce Task model fields and validation.  
4. **API: create/list** — First vertical slice.  
5. **API: update/delete** — Complete CRUD.  
6. **API: clear completed + stats** — Extra endpoints.  
7. **API tests** — One commit per major suite is fine.  
8. **UI shell** — Header, layout, CSS variables.  
9. **UI list + form** — Core interactions.  
10. **UI filters + search + stats** — Assignment filters/counter.  
11. **UI polish states** — Empty, loading, error, confirm.  
12. **Integration** — Point frontend at backend; CORS fix.  
13. **Frontend tests** — Components/hooks.  
14. **Deploy config** — Render / Vercel / env docs.  
15. **Docs** — README sections, screenshots, team roles.  
16. **Intentional conflict** — Divergent edits to the contributions stub, then resolution commit.

**Commit message style (recommended):** Imperative, scoped.

```
feat(backend): add PATCH /api/tasks/:id
fix(frontend): show error banner on failed fetch
chore(ci): run lint test and build on push and pull_request
docs: add merge conflict resolution section
```

**Why:** Markers can map commits to roles and features; bisecting integration bugs stays feasible.

---

## 21. Recommended Project Folder Structure

```
todoflow/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/          # optional
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── healthRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── app.js               # Express app (export for Supertest)
│   │   └── server.js            # listen() entrypoint
│   ├── tests/
│   │   ├── tasks.test.js
│   │   └── health.test.js
│   ├── package.json
│   ├── .env.example
│   └── README.md                # optional; can point to root
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── tasksApi.js
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tests/ or src/**/*.test.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── README.md                # optional
├── docs/
│   └── CONTRIBUTIONS_STUB.md    # safe file for intentional merge conflict
├── .gitignore                   # must ignore .env and secrets
├── README.md                    # primary documentation (Frontend-coordinated)
├── PROJECT_PLAN.md
└── REQUIREMENTS_TRACEABILITY.md
```

**Why monorepo with `frontend/` + `backend/`:** One GitHub repo, clear role boundaries, independent CI package installs.

---

## 22. README Documentation Plan

`README.md` is a graded deliverable. **Frontend Developer coordinates maintenance**; all members contribute their technical sections.

### Required README sections (in recommended order)

| # | Section | Primary author | Notes |
|---|---------|----------------|-------|
| 1 | Project title | Frontend | Exact product name: **TodoFlow** |
| 2 | Build status badges | DevOps | CI (and deploy if available) |
| 3 | Group information | Frontend (collect from team) | Course / group / team identifier as required by LMS |
| 4 | Student full names | Each student → Frontend formats | **Exactly as shown in LMS** |
| 5 | Student IDs | Each student → Frontend formats | **Exactly as shown in LMS** |
| 6 | Role of each member | Frontend | DevOps / Backend / Frontend |
| 7 | Project description | Frontend | Short Option B summary |
| 8 | Live deployment URL | DevOps | Public frontend URL (and API URL) |
| 9 | Technologies used | Frontend (+ Backend) | React, Vite, Express, MongoDB, etc. |
| 10 | Features | Frontend | Option B + extras actually shipped |
| 11 | Screenshots | Frontend | Desktop + mobile if possible |
| 12 | User documentation | Frontend | How to add/edit/complete/delete/filter/search |
| 13 | Branch strategy | DevOps | `main` / `develop` / `feature/*` + merge commits |
| 14 | Individual contributions | Each role | Narrative per student |
| 15 | Contribution matrix | Frontend assembles | Table: Name → Role → Branches → PRs → Key commits |
| 16 | Commit / feature evidence | All | Links to PRs/commits where useful |
| 17 | API documentation | Backend | Endpoints, payloads, status codes |
| 18 | Setup instructions | Frontend + Backend + DevOps | Clone, install, run locally |
| 19 | Environment variables | Backend + DevOps | Document names only; placeholders |
| 20 | Testing instructions | Backend + Frontend | How to run Jest / Vitest / lint |
| 21 | CI/CD explanation | DevOps | Triggers, steps, fail-on-error |
| 22 | Deployment process | DevOps | Vercel, Render, Atlas, `main` deploy |
| 23 | Merge conflict documentation | DevOps (+ participants) | See §23; link PR + resolution |
| 24 | Challenges and resolutions | All → Frontend edits | At least conflict + one deploy/CORS/cold-start item |

Placeholders for LMS names/IDs remain until real values are known; the **structure** must exist before submission.

---

## 23. Intentional Merge Conflict Plan

One intentional, safe merge conflict will be created and documented for assignment evidence.

### Summary

| Item | Plan |
|------|------|
| **File** | `docs/CONTRIBUTIONS_STUB.md` (documentation only — not application source) |
| **Branch A** | `docs/team-contributions-backend` (Backend Developer) |
| **Branch B** | `docs/team-contributions-frontend` (Frontend Developer) |
| **Base** | Both branch from the same `develop` commit after a stub file already exists on `develop` |
| **Coordinator** | DevOps / Release Manager |
| **Resolver** | DevOps / Release Manager (with Backend + Frontend present) |

### Conflicting changes

1. On `develop`, commit an initial stub, for example:

   ```markdown
   # Team contributions (draft)
   - Backend: TBD
   - Frontend: TBD
   ```

2. **Backend Developer** on `docs/team-contributions-backend` changes the same lines to list Backend deliverables (API, tests, MongoDB).  
3. **Frontend Developer** on `docs/team-contributions-frontend` changes the **same lines** to list Frontend deliverables (UI, README, Vitest).  
4. Merge Branch A into `develop` first via PR (merge commit, no conflict yet).  
5. Open PR from Branch B → `develop`. GitHub will report a conflict on `docs/CONTRIBUTIONS_STUB.md`.

### Resolution process

1. DevOps checks out the PR branch locally (or uses GitHub conflict editor).  
2. Manually combines both contribution lists into one coherent stub (keep both students’ bullets).  
3. Commits the resolution.  
4. Ensures CI is green.  
5. Completes the PR with a **merge commit**.  
6. Optionally folds the stub content into the final README contribution matrix later; the conflict PR remains historical evidence.

### Why this file is safe

- It is documentation-only.  
- It cannot break runtime behavior, builds, or production deploys.  
- It is easy to reproduce and explain to markers.

### README documentation (required)

README section **“Merge conflict documentation”** must include:

- Branches involved  
- File path  
- Why the conflict occurred  
- Who resolved it  
- How it was resolved (combine both lists)  
- Link to the conflicting PR  
- Link to the merge commit resolving it  

### GitHub evidence that must remain visible

- Both feature branches (not deleted until after marking, or recoverable via PR refs)  
- PR from Branch A (merged)  
- PR from Branch B showing conflict discussion / resolution commit  
- Merge commits on `develop`  
- README narrative with links  
- Review comments if reviewers participated  

---

## 24. Repository Visibility and Secrets Policy

| Rule | Requirement |
|------|-------------|
| Visibility | Repository **must be PUBLIC** before academic submission so markers can access code, Actions, and PRs |
| Secrets in git | **No** API keys, passwords, Atlas connection strings with credentials, tokens, or private credentials may be committed |
| `.env` files | **Must be ignored** via `.gitignore` (root and/or package-level) |
| `.env.example` | **May be committed** with **placeholder values only** (e.g. `MONGODB_URI=your_mongodb_uri_here`) |
| Hosted secrets | Real values live only in GitHub Actions secrets, Vercel env, Render env, and Atlas UI |
| Pre-submit check | Scan git history / working tree for accidental secrets before making the repo public if it was private during development |

---

## 25. Final Quality / Smoke-Testing Checklist

Complete this checklist on the **production** deployment before submission. DevOps coordinates; Frontend verifies UI; Backend verifies API/persistence.

| # | Check | Pass? |
|---|-------|-------|
| 1 | Application loads successfully at the live frontend URL | ☐ |
| 2 | No browser console errors during normal use | ☐ |
| 3 | Add task works | ☐ |
| 4 | Edit task works | ☐ |
| 5 | Complete / incomplete toggle works | ☐ |
| 6 | Delete task works (including confirmation) | ☐ |
| 7 | Filters All / Active / Completed work | ☐ |
| 8 | Search works | ☐ |
| 9 | Counter / statistics update correctly | ☐ |
| 10 | Backend API works (health + tasks endpoints) | ☐ |
| 11 | Database persistence works (refresh / new browser still shows data) | ☐ |
| 12 | Responsive **mobile** layout works | ☐ |
| 13 | Responsive **desktop** layout works | ☐ |
| 14 | Production URL works in **incognito / private** browsing | ☐ |
| 15 | CI passes on `main` / latest release PR | ☐ |
| 16 | Deployment workflow / production deploy succeeds | ☐ |

Failures block submission until fixed or explicitly documented with severity and workaround.

---

## 26. Assignment Evidence Strategy

How TodoFlow preserves graded collaboration and delivery evidence:

| Evidence type | How it is preserved |
|---------------|---------------------|
| **Individual commits** | Each student uses their own GitHub account; commits scoped to their role areas (§20) |
| **Feature branches** | Named `feature/*`, `chore/*`, `docs/*` per §19; at least one major branch per member |
| **Pull requests** | All integration via PRs into `develop` or `main`; ≥2 PRs minimum (many expected) |
| **Code reviews** | Required peer Approve + written comments before merge |
| **Merge commits** | Default merge method = merge commit (no squash-only policy) (§16) |
| **Merge conflict resolution** | Planned conflict on `docs/CONTRIBUTIONS_STUB.md` with README write-up + PR links (§23) |
| **CI runs** | Actions history for pushes and PRs; green checks required to merge (§17) |
| **Deployment runs** | `deploy.yml` and/or platform deploy logs from `main`; live URL in README |
| **Individual contributions** | README contribution matrix + narratives + linked PRs/commits (§22) |

**Do not** rewrite authored history, force-push shared branches, or delete evidence PRs before marking is complete.

---

## 27. Future Scope

Items deliberately postponed so v1 stays shippable:

| Idea | Why later |
|------|-----------|
| Authentication (JWT / Auth0) | Large security & testing surface |
| Per-user task isolation | Depends on auth |
| Categories / tags | Extra schema + UI filters |
| Drag-and-drop reordering | UX complexity + `order` field |
| Server-side full-text search | Needs indexes / Atlas Search |
| Due-date reminders / email | External providers |
| Real-time sync (Socket.IO) | Ops and testing complexity |
| PWA offline + local queue | Dual persistence story |
| Dark mode / themes | Nice-to-have polish |
| Playwright E2E in CI | Valuable but time-heavy |
| Docker Compose local stack | Good DevOps stretch goal |
| Staging environment parity | Second Render/Vercel projects |

Any Future Scope item should be proposed as its own `feature/*` branch after v1 is deployed and graded requirements are met.

---

## Decision Summary (quick reference)

| Decision | Choice | Why appropriate |
|----------|--------|-----------------|
| Persistence | MongoDB Atlas + API | Stronger than localStorage-only; teaches full stack + deploy |
| No auth | Single shared task list | Keeps academic scope realistic |
| Monorepo | `frontend/` + `backend/` | One repo, clear roles |
| State | React hooks, no Redux | One resource type |
| Filter/search | Mostly client-side | Less API surface; still demo-complete |
| Hosting | Vercel + Render + Atlas | Matches brief; free-tier friendly |
| Git | `main` / `develop` / `feature/*` | Assignment requirement |
| Merge method | Merge commits (no squash-only) | Preserves collaboration evidence |
| Intentional conflict | `docs/CONTRIBUTIONS_STUB.md` | Safe, reproducible, documentable |
| CI/CD | GitHub Actions; lint+test+build required | Assignment requirement |
| Repo visibility | Public before submission | Marker access |
| README ownership | Frontend coordinates; all contribute | Matches role expectations |
| Tests | Jest/Supertest + Vitest | Role-aligned, CI-friendly |

---

## Next Steps (after planning approval)

1. Freeze API response envelope: `{ success, data, error }`.  
2. Create public-ready GitHub repo policy; add collaborators; create `develop`.  
3. Enable branch protection (PR + CI required).  
4. Scaffold monorepo (`chore/repo-scaffold`) — **implementation phase**.  
5. Implement CI with full triggers and required lint/test/build.  
6. Backend vertical slice + tests; Frontend shell + integration.  
7. Execute intentional merge conflict exercise (§23).  
8. CD from `main`; complete smoke checklist (§25).  
9. Frontend-led comprehensive README (§22).  
10. Release PR `develop` → `main`.

---

## Plan Status

| Item | Status |
|------|--------|
| Product / architecture planning | Complete |
| Assignment-readiness gap closure | Complete |
| Application source code | **Not started** |
| Repository scaffold | **Not started** |
| Live deployment | **Not started** |

*Document status: Planning complete for assignment coverage — no application source code has been implemented yet.*
