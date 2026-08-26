import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createTask,
  deleteCompletedTasks,
  deleteTask,
  getTaskById,
  getTasks,
  toggleTaskCompletion,
  updateTask,
} from './taskApi';

const API_BASE = 'http://localhost:5000/api';

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  };
}

function textResponse(text, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => text,
  };
}

describe('taskApi', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_BASE_URL', API_BASE);
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('getTasks(all) requests /tasks without a status query', async () => {
    const data = { tasks: [{ _id: '1', title: 'A' }], count: 1 };
    fetch.mockResolvedValueOnce(
      jsonResponse({ success: true, data, error: null }),
    );

    await expect(getTasks('all')).resolves.toEqual(data);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/tasks`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('getTasks(active) sends status=active', async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse({
        success: true,
        data: { tasks: [], count: 0 },
        error: null,
      }),
    );

    await getTasks('active');

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/tasks?status=active`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('getTasks(completed) sends status=completed', async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse({
        success: true,
        data: { tasks: [], count: 0 },
        error: null,
      }),
    );

    await getTasks('completed');

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/tasks?status=completed`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('createTask posts only writable fields', async () => {
    const created = {
      _id: 'abc',
      title: 'Ship API layer',
      description: 'Wire fetch client',
      priority: 'high',
      dueDate: '2026-09-01T00:00:00.000Z',
      completed: false,
    };

    fetch.mockResolvedValueOnce(
      jsonResponse({ success: true, data: created, error: null }, 201),
    );

    await expect(
      createTask({
        title: 'Ship API layer',
        description: 'Wire fetch client',
        priority: 'high',
        dueDate: '2026-09-01',
        id: 'local-1',
        completed: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      }),
    ).resolves.toEqual(created);

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/tasks`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          title: 'Ship API layer',
          description: 'Wire fetch client',
          priority: 'high',
          dueDate: '2026-09-01',
        }),
      }),
    );
  });

  it('updateTask puts only writable fields', async () => {
    const updated = {
      _id: 'abc',
      title: 'Revised title',
      priority: 'medium',
    };

    fetch.mockResolvedValueOnce(
      jsonResponse({ success: true, data: updated, error: null }),
    );

    await expect(
      updateTask('abc', {
        title: 'Revised title',
        priority: 'medium',
        completed: false,
        id: 'abc',
      }),
    ).resolves.toEqual(updated);

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/tasks/abc`,
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({
          title: 'Revised title',
          priority: 'medium',
        }),
      }),
    );
  });

  it('toggleTaskCompletion patches /complete', async () => {
    const toggled = { _id: 'abc', completed: true };
    fetch.mockResolvedValueOnce(
      jsonResponse({ success: true, data: toggled, error: null }),
    );

    await expect(toggleTaskCompletion('abc')).resolves.toEqual(toggled);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/tasks/abc/complete`,
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('deleteTask deletes by id', async () => {
    const data = { deleted: true, task: { _id: 'abc', title: 'Gone' } };
    fetch.mockResolvedValueOnce(
      jsonResponse({ success: true, data, error: null }),
    );

    await expect(deleteTask('abc')).resolves.toEqual(data);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/tasks/abc`,
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('deleteCompletedTasks hits the static completed route', async () => {
    const data = { deletedCount: 2 };
    fetch.mockResolvedValueOnce(
      jsonResponse({ success: true, data, error: null }),
    );

    await expect(deleteCompletedTasks()).resolves.toEqual(data);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/tasks/completed`,
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('getTaskById requests a single task', async () => {
    const task = { _id: 'abc', title: 'One' };
    fetch.mockResolvedValueOnce(
      jsonResponse({ success: true, data: task, error: null }),
    );

    await expect(getTaskById('abc')).resolves.toEqual(task);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE}/tasks/abc`,
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('throws ApiError for non-2xx responses with backend codes', async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse(
        {
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Task not found' },
        },
        404,
      ),
    );

    await expect(getTaskById('missing')).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Task not found',
      code: 'NOT_FOUND',
      status: 404,
    });
  });

  it('throws ApiError when success is false on an otherwise OK status', async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title must not be empty',
        },
      }),
    );

    await expect(createTask({ title: '   ' })).rejects.toMatchObject({
      name: 'ApiError',
      code: 'VALIDATION_ERROR',
      message: 'Title must not be empty',
    });
  });

  it('throws a network ApiError when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(getTasks()).rejects.toMatchObject({
      name: 'ApiError',
      code: 'NETWORK_ERROR',
    });
  });

  it('throws for invalid JSON responses', async () => {
    fetch.mockResolvedValueOnce(textResponse('<html>nope</html>', 200));

    await expect(getTasks()).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
      message: 'Received an invalid response from the server.',
    });
  });

  it('throws for unexpected success payloads', async () => {
    fetch.mockResolvedValueOnce(
      jsonResponse({ ok: true, result: [] }),
    );

    await expect(getTasks()).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
    });
  });
});
