# TodoFlow – Assignment Requirements Traceability

**Source of truth for product/process design:** `PROJECT_PLAN.md` (updated after gap closure)  
**Assignment context:** Option B Todo List + 3-student Git & DevOps deliverables  
**Review type:** Plan coverage only (no application code exists yet)  
**Date:** 2026-08-26 (post gap-closure update)  

**Status legend**

| Status | Meaning |
|--------|---------|
| **Covered (plan)** | Explicitly and completely addressed in `PROJECT_PLAN.md` |
| **Not started (repo)** | Planned, but not yet present / executed in the repository |

---

## 1. Application Requirements

| Assignment Requirement | TodoFlow Implementation | Responsible Role | Evidence | Status |
|---|---|---|---|---|
| Add tasks | `POST /api/tasks`; `TaskForm` create flow; title required | Backend + Frontend | `PROJECT_PLAN.md` §§3, 6, 10, 11, 12 | Covered (plan) |
| Delete tasks | `DELETE /api/tasks/:id`; `TaskItem` + `ConfirmDialog` | Backend + Frontend | §§3, 10, 11, 13 | Covered (plan) |
| Mark tasks complete | Toggle via `PATCH /api/tasks/:id`; `TaskCheckbox` | Backend + Frontend | §§3, 6, 10, 11, 12 | Covered (plan) |
| Filter All / Active / Completed | `FilterTabs`; client filter and/or `?completed=` | Frontend (+ Backend optional query) | §§3, 5, 10, 11, 12 | Covered (plan) |
| Persistent storage | MongoDB Atlas via Express/Mongoose | Backend + DevOps (Atlas/env) | §§3, 8, 9, 15, 24 | Covered (plan) |
| Responsive UI | Mobile-first CSS; desktop + mobile smoke checks | Frontend | §§3, 4, 7, 11, 25 | Covered (plan) |
| Task counter | `TaskStats`; optional `GET /api/tasks/stats` | Frontend (+ Backend optional) | §§3, 5, 10, 11, 25 | Covered (plan) |

**Verdict:** 100% of Option B application requirements are covered at plan level.

---

## 2. Three-Student Role Requirements

### DevOps / Release Manager

| Expected responsibility | Planned? | Evidence in plan | Status |
|---|---|---|---|
| Repository initialization/configuration | Yes | §18 GitHub repository; §19 `chore/repo-scaffold`; §24 public repo | Covered (plan) |
| Branch protection | Yes | §§16, 18 | Covered (plan) |
| GitHub Actions | Yes | §§17, 18, 21 (`ci.yml`, `deploy.yml`) | Covered (plan) |
| Deployment pipeline | Yes | §§15, 17, 18 | Covered (plan) |
| Release coordination | Yes | §18 Release; §19 `release/v1-develop-to-main` | Covered (plan) |
| Merge conflict coordination | Yes | §§18, 23 intentional conflict plan | Covered (plan) |
| CI/CD documentation | Yes | §§18, 22 (DevOps README sections) | Covered (plan) |
| Deployment configuration | Yes | §§15, 18, 22 | Covered (plan) |
| Release documentation | Yes | Live URL + deployment process in README (§22); release PR | Covered (plan) |

### Backend Developer

| Expected responsibility | Planned? | Evidence in plan | Status |
|---|---|---|---|
| Express API | Yes | §§8, 10, 18 | Covered (plan) |
| MongoDB | Yes | §§8, 9, 15, 18 | Covered (plan) |
| Mongoose model | Yes | §§9, 18 | Covered (plan) |
| Validation | Yes | §§8, 13, 18 | Covered (plan) |
| Backend tests | Yes | §§14, 18 | Covered (plan) |
| API documentation | Yes | §§10, 18, 22 | Covered (plan) |
| Backend feature branches | Yes | §19 `feature/backend-*` | Covered (plan) |

### Frontend Developer

| Expected responsibility | Planned? | Evidence in plan | Status |
|---|---|---|---|
| React UI | Yes | §§7, 11, 18 | Covered (plan) |
| Responsive styling | Yes | §§7, 18, 25 | Covered (plan) |
| Frontend features | Yes | §§3, 5, 18, 19 | Covered (plan) |
| API integration | Yes | §§12, 18, 19 | Covered (plan) |
| Frontend tests | Yes | §§14, 18 | Covered (plan) |
| README coordination | Yes | §§18, 22 — Frontend maintains README | Covered (plan) |
| User documentation | Yes | §§18, 22 section “User documentation” | Covered (plan) |
| UI components | Yes | §11 | Covered (plan) |

**Role verdict:** 100% of required role ownership areas are explicitly planned.

---

## 3. Repository Requirements

| Requirement | Planned implementation | Evidence | Status |
|---|---|---|---|
| Public GitHub repository | Must be PUBLIC before submission | §24 | Covered (plan) / Not started (repo) |
| Secrets policy | No secrets committed; `.env` ignored; `.env.example` placeholders only | §24 | Covered (plan) / Not started (repo) |
| `main` branch | Production; protected; merge commits from `develop` | §16 | Covered (plan) / Not started (repo) |
| `develop` branch | Integration; protected | §16 | Covered (plan) / Not started (repo) |
| `feature/*` branches | Naming + full suggested list including conflict branches | §§16, 19 | Covered (plan) / Not started (repo) |
| `.github/workflows/` | Required folder | §21 | Covered (plan) / Not started (repo) |
| `ci.yml` | Full trigger + step definition | §§17, 21 | Covered (plan) / Not started (repo) |
| `deploy.yml` | Deploy from `main` | §§17, 21 | Covered (plan) / Not started (repo) |
| `frontend/` | React + Vite package | §§7, 21 | Covered (plan) / Not started (repo) |
| `backend/` | Node + Express package | §§8, 21 | Covered (plan) / Not started (repo) |
| `.gitignore` | Includes ignoring `.env` | §§21, 24 | Covered (plan) / Not started (repo) |
| `README.md` | Full section plan; Frontend-coordinated | §22 | Covered (plan) / Not started (repo content) |
| Package configuration | `frontend/package.json` + `backend/package.json` | §21 | Covered (plan) / Not started (repo) |

**Repo verdict:** 100% planned. Nothing scaffolded yet except planning documents.

---

## 4. Git Collaboration Requirements

| Requirement | Planned? | Evidence | Status |
|---|---|---|---|
| Minimum 10 meaningful commits | Yes | ≥16 commit areas (§20) | Covered (plan) |
| At least one feature branch per member | Yes | DevOps / Backend / Frontend branches (§19) | Covered (plan) |
| At least 3 merged branches | Yes | Many planned PRs into `develop` / `main` | Covered (plan) |
| At least 2 pull requests | Yes | Feature → `develop` and `develop` → `main` minimum | Covered (plan) |
| PR descriptions | Yes | PR template (§17) | Covered (plan) |
| Code reviews | Yes | Peer Approve + written comments (§§16, 18, 26) | Covered (plan) |
| Merge commits | Yes | Mandatory merge commits; **no squash-only** (§16) | Covered (plan) |
| Intentional documented merge conflict | Yes | Full plan on `docs/CONTRIBUTIONS_STUB.md` (§23) | Covered (plan) |
| Visible commits from all members | Yes | Own GitHub identities; evidence strategy (§26) | Covered (plan) |
| Clear individual contribution breakdown | Yes | README matrix + narratives (§22) | Covered (plan) |

**Collaboration verdict:** 100% covered at plan level, including the former conflict and squash gaps.

---

## 5. CI/CD Requirements

| Requirement | Planned? | Evidence | Status |
|---|---|---|---|
| CI workflow | Yes | `.github/workflows/ci.yml` (§17) | Covered (plan) |
| CI on push to `main` | Yes | §17 triggers | Covered (plan) |
| CI on push to `develop` | Yes | §17 triggers | Covered (plan) |
| CI on push to `feature/*` | Yes | §17 `feature/**` | Covered (plan) |
| CI on PRs to `main` | Yes | §17 | Covered (plan) |
| CI on PRs to `develop` | Yes | §17 | Covered (plan) |
| Checkout | Yes | CI step 1 (§17) | Covered (plan) |
| Node.js setup | Yes | CI step 2 (§17) | Covered (plan) |
| Dependency installation | Yes | CI step 3 (§17) | Covered (plan) |
| Linting | Yes | Required ESLint — not optional (§17) | Covered (plan) |
| Frontend tests | Yes | Vitest (§§14, 17) | Covered (plan) |
| Backend tests | Yes | Jest + Supertest (§§14, 17) | Covered (plan) |
| Build | Yes | Frontend build (§17) | Covered (plan) |
| Fail on failed checks | Yes | Workflow fails; branch protection requires CI (§17) | Covered (plan) |
| Deployment workflow | Yes | `deploy.yml` (§17) | Covered (plan) |
| Deployment from `main` | Yes | §17 CD trigger | Covered (plan) |
| Successful GitHub Actions runs | Planned outcome | Evidence strategy §26 | Covered (plan) / Not started (repo) |
| Build status badges | Yes | README badges (§§18, 22) | Covered (plan) |

**CI/CD verdict:** 100% of checklist items are explicitly planned.

---

## 6. Deployment Requirements

| Requirement | Planned? | Evidence | Status |
|---|---|---|---|
| Public live deployment | Yes | §§2, 15, 22 | Covered (plan) |
| Frontend deployment | Yes | Vercel (§15) | Covered (plan) |
| Backend deployment | Yes | Render (§15) | Covered (plan) |
| MongoDB Atlas | Yes | §§9, 15 | Covered (plan) |
| Production environment configuration | Yes | §§8, 15, 24 | Covered (plan) |
| Accessible without authentication | Yes | Auth out of scope (§3) | Covered (plan) |
| Responsive application | Yes | §§3, 7, 25 | Covered (plan) |
| No console errors | Yes | Smoke checklist item 2 (§25) | Covered (plan) |
| Automated deployment | Yes | §§17, 26 | Covered (plan) |
| Incognito / private browsing check | Yes | Smoke checklist item 14 (§25) | Covered (plan) |

**Deployment verdict:** 100% covered at plan level (execution pending).

---

## 7. Documentation Requirements

| Requirement | Planned? | Evidence | Status |
|---|---|---|---|
| README | Yes | §22 full outline | Covered (plan) |
| Group information | Yes | §22 §3 | Covered (plan) |
| Student full names (LMS-exact) | Yes | §22 §4 | Covered (plan) |
| Student IDs (LMS-exact) | Yes | §22 §5 | Covered (plan) |
| Roles | Yes | §§18, 22 | Covered (plan) |
| Project description | Yes | §22 | Covered (plan) |
| Live URL | Yes | §22 | Covered (plan) |
| Technologies | Yes | §22 | Covered (plan) |
| Features | Yes | §22 | Covered (plan) |
| Screenshots | Yes | §22 | Covered (plan) |
| Branch strategy | Yes | §§16, 22 | Covered (plan) |
| Individual contributions | Yes | §22 | Covered (plan) |
| Contribution matrix | Yes | §22 | Covered (plan) |
| Commit/feature evidence | Yes | §§22, 26 | Covered (plan) |
| Setup instructions | Yes | §22 | Covered (plan) |
| Environment variables | Yes | §§22, 24 | Covered (plan) |
| Testing instructions | Yes | §22 | Covered (plan) |
| CI/CD explanation | Yes | §§17, 22 | Covered (plan) |
| Deployment process | Yes | §22 | Covered (plan) |
| Merge conflict documentation | Yes | §§22, 23 | Covered (plan) |
| Challenges and resolutions | Yes | §22 | Covered (plan) |
| Build status badges | Yes | §22 | Covered (plan) |
| API documentation | Yes | §§10, 22 | Covered (plan) |
| User documentation | Yes | §§18, 22 | Covered (plan) |

**Documentation verdict:** 100% of required README topics are planned. Actual LMS names/IDs and live URLs remain to be filled during implementation/docs phase.

---

## 8. Risks and Gaps

Previous planning gaps (intentional conflict, squash ambiguity, optional lint, push triggers, public visibility, README metadata, console smoke checks, README ownership) are **closed in `PROJECT_PLAN.md`**.

| Remaining risk | Why it matters | Recommended solution |
|---|---|---|
| **Execution risk** | Plan coverage ≠ submitted evidence | Follow §§19–26 in order; do not skip conflict exercise or smoke checklist |
| **LMS identity fields unknown** | README needs exact names/IDs | Collect from each student before final README PR |
| **Time pressure on extras** | Search/priority/due date could delay CI/CD/docs | Ship Option B core + CI + deploy + docs first; extras second |
| **Render cold starts** | Markers may think the app is down | Document in README Challenges; keep loading UI (§13) |
| **Shared public task data** | Demo list can be vandalized without auth | Optional maintainer seed/reset script; accept as scope tradeoff |
| **Secrets leak if `.gitignore` forgotten** | Public repo would expose credentials | Implement `.gitignore` in first scaffold commit; use only `.env.example` placeholders |
| **Feature-branch CI noise** | Many pushes to `feature/*` increase Actions minutes | Keep jobs efficient; pin Node; cache npm where appropriate |
| **API envelope not coded yet** | Parallel FE/BE thrash | Freeze `{ success, data, error }` at scaffold kickoff (Next Steps) |

**No assignment-readiness planning gaps remain.** Remaining items are implementation, configuration, or operational risks.

---

## 9. Final Readiness Score

| Layer | Score | Notes |
|-------|-------|-------|
| **Assignment-level planning coverage** | **100%** | All audited requirement areas now explicit in `PROJECT_PLAN.md` |
| **Implementation / scaffold / deploy** | **0%** | No application source code yet — by design |

### Area breakdown (planning only)

| Area | Planning coverage |
|------|-------------------|
| Application (Option B) | 100% |
| Roles | 100% |
| Repository structure & visibility | 100% |
| Git collaboration (incl. conflict + merge commits) | 100% |
| CI/CD | 100% |
| Deployment + smoke checklist | 100% |
| Documentation outline | 100% |
| Evidence strategy | 100% |

**Do not interpret 100% planning coverage as “assignment complete.”** Implementation, GitHub history, CI runs, live deploy, and filled README content are still required for submission.

---

## 10. Recommended Changes Before Development

All previously listed planning corrections have been applied to `PROJECT_PLAN.md`. Before writing application code, the team should only:

1. Confirm the three student LMS names/IDs for eventual README fields.  
2. Confirm who holds each role (DevOps / Backend / Frontend).  
3. Agree to freeze API envelope `{ success, data, error }` at scaffold start.  
4. Begin implementation with `chore/repo-scaffold` (not done in this planning update).

No further planning-document gaps block development.

---

## Traceability Change Log

| Update | Result |
|--------|--------|
| Intentional merge conflict | Added §23 in plan; status → Covered |
| Merge strategy (no squash-only) | Added §16 merge rules; status → Covered |
| CI triggers + required lint | Expanded §17; status → Covered |
| README full outline + Frontend ownership | Added §22; roles §18; status → Covered |
| Public repo + secrets policy | Added §24; status → Covered |
| Smoke-testing checklist | Added §25; status → Covered |
| Assignment evidence strategy | Added §26; status → Covered |
| Role ownership tables | Rewrote §18; status → Covered |

---

*Traceability updated after gap closure. Planning coverage target: 100%. Implementation is not complete and has not started.*
