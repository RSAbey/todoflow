jest.mock('../src/services/taskService');

const request = require('supertest');
const taskService = require('../src/services/taskService');
const app = require('../src/app');

describe('Task routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    taskService.ALLOWED_UPDATE_FIELDS = [
      'title',
      'description',
      'priority',
      'dueDate',
    ];
  });

  describe('POST /api/tasks', () => {
    it('creates a task with a valid body (201)', async () => {
      const created = {
        _id: '64b0f0c2e1a1a1a1a1a1a1a1',
        title: 'Ship routes',
        completed: false,
        priority: 'medium',
      };
      taskService.createTask.mockResolvedValue(created);

      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Ship routes' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        data: created,
        error: null,
      });
      expect(taskService.createTask).toHaveBeenCalledWith({ title: 'Ship routes' });
    });

    it('rejects a missing title (400)', async () => {
      const response = await request(app).post('/api/tasks').send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(taskService.createTask).not.toHaveBeenCalled();
    });

    it('rejects an empty title via validation failure (400)', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(taskService.createTask).not.toHaveBeenCalled();
    });

    it('maps unexpected service errors to 500', async () => {
      taskService.createTask.mockRejectedValue(new Error('db down'));

      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Failing create' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      });
    });
  });

  describe('GET /api/tasks', () => {
    it('returns a task list', async () => {
      const tasks = [{ _id: '1', title: 'One' }];
      taskService.getAllTasks.mockResolvedValue(tasks);

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: { tasks, count: 1 },
        error: null,
      });
      expect(taskService.getAllTasks).toHaveBeenCalledWith({});
    });

    it('supports the active filter', async () => {
      taskService.getAllTasks.mockResolvedValue([]);

      const response = await request(app).get('/api/tasks?status=active');

      expect(response.status).toBe(200);
      expect(taskService.getAllTasks).toHaveBeenCalledWith({ status: 'active' });
    });

    it('supports the completed filter', async () => {
      taskService.getAllTasks.mockResolvedValue([]);

      const response = await request(app).get('/api/tasks?status=completed');

      expect(response.status).toBe(200);
      expect(taskService.getAllTasks).toHaveBeenCalledWith({
        status: 'completed',
      });
    });

    it('rejects unsupported status values (400)', async () => {
      const response = await request(app).get('/api/tasks?status=archived');

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_QUERY');
      expect(taskService.getAllTasks).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('returns an existing task (200)', async () => {
      const task = { _id: '64b0f0c2e1a1a1a1a1a1a1a1', title: 'Found' };
      taskService.getTaskById.mockResolvedValue(task);

      const response = await request(app).get(
        '/api/tasks/64b0f0c2e1a1a1a1a1a1a1a1',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: task,
        error: null,
      });
    });

    it('returns 404 when the task is missing', async () => {
      taskService.getTaskById.mockResolvedValue(null);

      const response = await request(app).get(
        '/api/tasks/64b0f0c2e1a1a1a1a1a1a1a1',
      );

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('returns 400 for a malformed id', async () => {
      const castError = new Error('Cast to ObjectId failed');
      castError.name = 'CastError';
      castError.path = '_id';
      taskService.getTaskById.mockRejectedValue(castError);

      const response = await request(app).get('/api/tasks/not-a-valid-id');

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_ID');
      expect(response.body.error.message).toBe('Invalid task id');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('updates allowed fields (200)', async () => {
      const updated = {
        _id: '64b0f0c2e1a1a1a1a1a1a1a1',
        title: 'Renamed',
        priority: 'high',
      };
      taskService.updateTask.mockResolvedValue(updated);

      const response = await request(app)
        .put('/api/tasks/64b0f0c2e1a1a1a1a1a1a1a1')
        .send({ title: 'Renamed', priority: 'high' });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(updated);
      expect(taskService.updateTask).toHaveBeenCalledWith(
        '64b0f0c2e1a1a1a1a1a1a1a1',
        { title: 'Renamed', priority: 'high' },
      );
    });

    it('rejects unsupported fields (400)', async () => {
      const response = await request(app)
        .put('/api/tasks/64b0f0c2e1a1a1a1a1a1a1a1')
        .send({ title: 'Ok', completed: true });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(taskService.updateTask).not.toHaveBeenCalled();
    });

    it('returns 404 when the task is missing', async () => {
      taskService.updateTask.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/tasks/64b0f0c2e1a1a1a1a1a1a1a1')
        .send({ title: 'Missing' });

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('toggles completion (200)', async () => {
      const task = {
        _id: '64b0f0c2e1a1a1a1a1a1a1a1',
        completed: true,
      };
      taskService.toggleTaskCompletion.mockResolvedValue(task);

      const response = await request(app).patch(
        '/api/tasks/64b0f0c2e1a1a1a1a1a1a1a1/complete',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(task);
    });

    it('returns 404 when the task is missing', async () => {
      taskService.toggleTaskCompletion.mockResolvedValue(null);

      const response = await request(app).patch(
        '/api/tasks/64b0f0c2e1a1a1a1a1a1a1a1/complete',
      );

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes a task (200)', async () => {
      const task = { _id: '64b0f0c2e1a1a1a1a1a1a1a1', title: 'Remove' };
      taskService.deleteTask.mockResolvedValue({ deleted: true, task });

      const response = await request(app).delete(
        '/api/tasks/64b0f0c2e1a1a1a1a1a1a1a1',
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({ deleted: true, task });
    });

    it('returns 404 when the task is missing', async () => {
      taskService.deleteTask.mockResolvedValue({ deleted: false, task: null });

      const response = await request(app).delete(
        '/api/tasks/64b0f0c2e1a1a1a1a1a1a1a1',
      );

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/tasks/completed', () => {
    it('clears completed tasks and returns deletedCount (200)', async () => {
      taskService.deleteCompletedTasks.mockResolvedValue(5);

      const response = await request(app).delete('/api/tasks/completed');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: { deletedCount: 5 },
        error: null,
      });
      expect(taskService.deleteCompletedTasks).toHaveBeenCalledTimes(1);
    });

    it('does not treat "completed" as a task id', async () => {
      taskService.deleteCompletedTasks.mockResolvedValue(0);

      await request(app).delete('/api/tasks/completed');

      expect(taskService.deleteCompletedTasks).toHaveBeenCalled();
      expect(taskService.deleteTask).not.toHaveBeenCalled();
    });
  });

  describe('unsupported methods', () => {
    it('returns 404 for an unsupported method on /api/tasks', async () => {
      const response = await request(app).patch('/api/tasks');

      expect(response.status).toBe(404);
    });
  });
});
