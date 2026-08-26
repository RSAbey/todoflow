import { getApiBaseUrl } from './apiConfig';

const WRITABLE_FIELDS = ['title', 'description', 'priority', 'dueDate'];

export class ApiError extends Error {
  constructor(message, { code = 'UNKNOWN_ERROR', status = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

function pickWritableFields(input = {}) {
  const payload = {};

  for (const field of WRITABLE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      payload[field] = input[field];
    }
  }

  return payload;
}

function buildUrl(path, query) {
  const url = `${getApiBaseUrl()}${path}`;

  if (!query) {
    return url;
  }

  const serialized = new URLSearchParams(query).toString();
  return serialized ? `${url}?${serialized}` : url;
}

async function parseResponseBody(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError('Received an invalid response from the server.', {
      code: 'INVALID_RESPONSE',
      status: response.status,
    });
  }
}

function assertSuccessPayload(payload, status) {
  if (
    payload == null ||
    typeof payload !== 'object' ||
    Array.isArray(payload) ||
    payload.success !== true
  ) {
    throw new ApiError('Received an unexpected response from the server.', {
      code: 'INVALID_RESPONSE',
      status,
    });
  }

  return payload.data;
}

async function request(path, options = {}) {
  const { query, body, headers, ...fetchOptions } = options;
  const url = buildUrl(path, query);

  const requestHeaders = { ...headers };
  let serializedBody = body;

  if (body !== undefined && body !== null && typeof body !== 'string') {
    serializedBody = JSON.stringify(body);
    if (!requestHeaders['Content-Type']) {
      requestHeaders['Content-Type'] = 'application/json';
    }
  }

  let response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
      body: serializedBody,
    });
  } catch {
    throw new ApiError(
      'Unable to reach the TodoFlow API. Check that the backend is running and VITE_API_BASE_URL is correct.',
      { code: 'NETWORK_ERROR' },
    );
  }

  const payload = await parseResponseBody(response);

  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      payload?.error?.message || `Request failed with status ${response.status}.`,
      {
        code: payload?.error?.code || 'HTTP_ERROR',
        status: response.status,
      },
    );
  }

  return assertSuccessPayload(payload, response.status);
}

/**
 * List tasks. Maps UI filters to backend query params.
 * - all → GET /tasks (no status query)
 * - active → GET /tasks?status=active
 * - completed → GET /tasks?status=completed
 */
export async function getTasks(filter = 'all') {
  const query =
    filter === 'active' || filter === 'completed'
      ? { status: filter }
      : undefined;

  return request('/tasks', { method: 'GET', query });
}

export async function getTaskById(id) {
  return request(`/tasks/${encodeURIComponent(id)}`, { method: 'GET' });
}

export async function createTask(taskInput) {
  return request('/tasks', {
    method: 'POST',
    body: pickWritableFields(taskInput),
  });
}

export async function updateTask(id, taskInput) {
  return request(`/tasks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: pickWritableFields(taskInput),
  });
}

export async function toggleTaskCompletion(id) {
  return request(`/tasks/${encodeURIComponent(id)}/complete`, {
    method: 'PATCH',
  });
}

export async function deleteTask(id) {
  return request(`/tasks/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

export async function deleteCompletedTasks() {
  return request('/tasks/completed', {
    method: 'DELETE',
  });
}
