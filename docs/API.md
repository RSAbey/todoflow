# TodoFlow API Documentation

## Base URL

| Environment | Base URL |
|-------------|----------|
| Local | `http://localhost:5000/api` |
| Production | `https://<your-render-service>.onrender.com/api` |

All task endpoints are under `/api/tasks`. Health is under `/api/health`.

## Authentication

**No authentication.** The API is intentionally open for this academic project scope. Do not send API keys or bearer tokens.

## Common response format

### Success

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

### Error

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

Clients never receive stack traces, MongoDB connection strings, or internal driver details.

### Common error codes

| Code | Typical status | Meaning |
|------|----------------|---------|
| `VALIDATION_ERROR` | 400 | Request body or model validation failed (including invalid field values such as a bad `dueDate`) |
| `INVALID_BODY` | 400 | Body was not a JSON object |
| `INVALID_QUERY` | 400 | Unsupported query parameter value |
| `INVALID_ID` | 400 | Malformed task id (`_id` cast failure) |
| `NOT_FOUND` | 404 | Task does not exist |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## CORS

Cross-origin access is controlled by `CORS_ORIGIN` (see `backend/.env.example`).

| Setting | Behavior |
|---------|----------|
| `CORS_ORIGIN=http://localhost:5173` | Only that origin (comma-separate multiple origins if needed) |
| Unset / empty in development | Defaults to `http://localhost:5173` and `http://127.0.0.1:5173` |
| Unset / empty in production | Browser cross-origin requests are denied (`origin: false`) |

Set the deployed frontend origin in the host environment when known. Do not commit secrets.

---

## Endpoints

### 1. Health check

`GET /api/health`

Confirms the API process is running. Does not require MongoDB when tested via the Express `app` import in unit tests; the production server connects to MongoDB on startup.

**Success `200`**

```json
{
  "success": true,
  "data": {
    "service": "TodoFlow API",
    "status": "ok",
    "message": "TodoFlow backend is running"
  },
  "error": null
}
```

---

### 2. Create task

`POST /api/tasks`

**Allowed body fields**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Trimmed; 1–200 characters |
| `description` | string | no | Max 2000 characters |
| `priority` | string | no | `low` \| `medium` \| `high` (default `medium`) |
| `dueDate` | string/date | no | ISO date when provided |

Unsupported fields (for example `completed`, `_id`, `createdAt`) are rejected.

**Example request**

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Finish README",
  "description": "Document setup and deploy steps",
  "priority": "high",
  "dueDate": "2026-09-01"
}
```

**Success `201`**

```json
{
  "success": true,
  "data": {
    "_id": "64b0f0c2e1a1a1a1a1a1a1a1",
    "title": "Finish README",
    "description": "Document setup and deploy steps",
    "completed": false,
    "priority": "high",
    "dueDate": "2026-09-01T00:00:00.000Z",
    "createdAt": "2026-08-26T08:00:00.000Z",
    "updatedAt": "2026-08-26T08:00:00.000Z"
  },
  "error": null
}
```

**Errors:** `400` validation / unsupported fields / empty title / invalid field values (for example bad `dueDate`); `500` unexpected failure.

---

### 3. List tasks

`GET /api/tasks`

**Query parameters** (optional; mutually prefer `completed` when both are present — `completed` is applied first)

| Parameter | Values | Effect |
|-----------|--------|--------|
| `status` | `all` \| `active` \| `completed` | Filter by completion state |
| `completed` | `true` \| `false` | Explicit boolean filter |

Results are sorted newest-first by `createdAt`.

**Example**

```http
GET /api/tasks?status=active
```

**Success `200`**

```json
{
  "success": true,
  "data": {
    "tasks": [],
    "count": 0
  },
  "error": null
}
```

**Errors:** `400` for unsupported `status` / `completed` values.

---

### 4. Get task by id

`GET /api/tasks/:id`

**Path parameters**

| Name | Description |
|------|-------------|
| `id` | MongoDB ObjectId string |

**Success `200`** — `data` is the task document.

**Errors:** `404` `NOT_FOUND`; `400` `INVALID_ID` for malformed ids.

---

### 5. Update task

`PUT /api/tasks/:id`

**Allowed body fields only:** `title`, `description`, `priority`, `dueDate`.

Not allowed: `completed`, `createdAt`, `updatedAt`, `_id`, or any other field.

**Example request**

```http
PUT /api/tasks/64b0f0c2e1a1a1a1a1a1a1a1
Content-Type: application/json

{
  "title": "Finish README (revised)",
  "priority": "medium"
}
```

**Success `200`** — `data` is the updated task.

**Errors:** `400` unsupported/empty body / invalid field values; `404` missing task; `400` invalid id.

---

### 6. Toggle task completion

`PATCH /api/tasks/:id/complete`

No request body required. Flips `completed` from `false → true` or `true → false`.

**Success `200`** — `data` is the updated task.

**Errors:** `404` missing task; `400` invalid id.

---

### 7. Delete task

`DELETE /api/tasks/:id`

**Success `200`**

```json
{
  "success": true,
  "data": {
    "deleted": true,
    "task": { "_id": "64b0f0c2e1a1a1a1a1a1a1a1", "title": "…" }
  },
  "error": null
}
```

**Errors:** `404` missing task; `400` invalid id.

---

### 8. Delete completed tasks

`DELETE /api/tasks/completed`

Deletes every task with `completed: true`.

> This static route is registered **before** `/api/tasks/:id` so `completed` is never treated as an id.

**Success `200`**

```json
{
  "success": true,
  "data": {
    "deletedCount": 3
  },
  "error": null
}
```

---

## Status code summary

| Status | When |
|--------|------|
| 200 | Successful read / update / delete / toggle / clear-completed |
| 201 | Task created |
| 400 | Validation, invalid query, invalid id, unsupported fields |
| 404 | Task not found (or unmatched route/method under default Express behavior) |
| 500 | Unexpected server error (generic message only) |

## Notes for frontend integration

- Base URL should come from `VITE_API_BASE_URL` (for example `http://localhost:5000/api`).
- Send `Content-Type: application/json` for `POST` and `PUT`.
- Prefer `status=active|completed|all` for list filtering to match the UI filter tabs.
- Ensure the frontend origin is allowed via `CORS_ORIGIN` (or local Vite defaults in development).
