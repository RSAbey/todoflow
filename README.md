# TodoFlow

Full-stack Todo List application for a team Git & DevOps academic assignment (Option B).

> **Status:** Phase 3 in progress — MongoDB connection foundation added. Todo features, Task model, full REST CRUD, full UI, and CI/CD workflows are not implemented yet.

## Technology stack

| Layer | Planned technology |
|-------|--------------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose (MongoDB Atlas) |
| API style | REST |
| Frontend tests | Vitest |
| Backend tests | Jest + Supertest |
| Frontend hosting | Vercel |
| Backend hosting | Render |

## Planned architecture

### Frontend (`frontend/`)

- React single-page application built with Vite
- Talks to the backend over REST (`fetch`)
- Features (planned): create, view, edit, complete, delete tasks; filters; search; counters; responsive UI

### Backend (`backend/`)

- Express REST API
- Mongoose models persisted on MongoDB Atlas
- Endpoints (planned): health check and task CRUD, plus stats / clear-completed as documented in `PROJECT_PLAN.md`

### Repository layout

```
todoflow/
├── frontend/          # React + Vite app (shell ready; Todo UI pending)
├── backend/           # Express API (health endpoint ready; CRUD pending)
├── .github/workflows/ # GitHub Actions (pending)
├── docs/              # Project documentation
├── PROJECT_PLAN.md
├── REQUIREMENTS_TRACEABILITY.md
├── package.json
└── README.md
```

## Group members

_To be added: group information, student full names (LMS), student IDs (LMS), and roles (DevOps / Backend / Frontend)._

## Setup

### Prerequisites

- Node.js 20 or later
- npm 9 or later (workspaces)

### Install dependencies

From the repository root:

```bash
npm install
```

### Root commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend and backend together |
| `npm run dev:frontend` | Start Vite only |
| `npm run dev:backend` | Start Express only (nodemon) |
| `npm run build` | Build packages that define a build script |
| `npm run test` | Run package tests (backend Jest today) |
| `npm run lint` | Lint frontend and backend |
| `npm run lint:frontend` | Lint frontend only |
| `npm run lint:backend` | Lint backend only |

### Frontend (local development)

```bash
npm run dev:frontend
```

The Vite dev server defaults to [http://localhost:5173](http://localhost:5173).

```bash
npm run build
# or
npm run build --workspace=frontend
```

### Backend (local development)

Copy environment placeholders (no real secrets):

```bash
cd backend
cp .env.example .env
```

On Windows PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
```

```bash
npm run dev:backend
```

Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

Production-style start (no nodemon):

```bash
npm run start --workspace=backend
```

> MongoDB Atlas connection is established when starting the API via `npm run start` / `npm run dev` (requires `MONGODB_URI`). Importing the Express app for Jest tests does **not** open a database connection.

## Linting

```bash
npm run lint
```

Package-level:

```bash
npm run lint --workspace=frontend
npm run lint --workspace=backend
```

## Testing

### Root

```bash
npm test
```

### Backend

```bash
npm test --workspace=backend
```

Watch mode:

```bash
npm run test:watch --workspace=backend
```

Coverage:

```bash
npm run test:coverage --workspace=backend
```

### Frontend

_Frontend Vitest instructions will be added when frontend tests are introduced._

## CI/CD

_GitHub Actions CI and deployment workflows will be added in a later phase. Build status badges will appear here once workflows exist._

## Deployment

_Live frontend and backend URLs will be listed here after production deployment. Do not commit secrets; use environment variables on the host platforms._

## Contributions

_Branch strategy, contribution matrix, individual contributions, and merge-conflict documentation will be added as the team workflow progresses. See `PROJECT_PLAN.md` for the approved process._

## Planning documents

- [`PROJECT_PLAN.md`](./PROJECT_PLAN.md) — approved architecture and delivery plan
- [`REQUIREMENTS_TRACEABILITY.md`](./REQUIREMENTS_TRACEABILITY.md) — assignment requirements mapping
- [`docs/`](./docs/) — documentation index for API, contributions, merge conflicts, and deployment
