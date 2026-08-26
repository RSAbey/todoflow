jest.mock('../src/services/taskService');

const taskService = require('../src/services/taskService');
const taskController = require('../src/controllers/taskController');

taskService.ALLOWED_UPDATE_FIELDS = ['title', 'description', 'priority', 'dueDate'];

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

async function invoke(handler, { req = {}, res = mockRes(), next = jest.fn() } = {}) {
  await handler(req, res, next);
  // Allow any microtask from asyncHandler to settle
  await Promise.resolve();
  return { req, res, next };
}

describe('taskController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('returns 201 and the created task', async () => {
      const created = { _id: '1', title: 'New task', priority: 'medium' };
      taskService.createTask.mockResolvedValue(created);

      const { res, next } = await invoke(taskController.createTask, {
        req: { body: { title: 'New task' } },
      });

      expect(taskService.createTask).toHaveBeenCalledWith({ title: 'New task' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: created,
        error: null,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getTasks', () => {
    it('returns tasks with count', async () => {
      const tasks = [{ _id: '1', title: 'A' }];
      taskService.getAllTasks.mockResolvedValue(tasks);

      const { res } = await invoke(taskController.getTasks, {
        req: { query: {} },
      });

      expect(taskService.getAllTasks).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { tasks, count: 1 },
        error: null,
      });
    });

    it('handles the active filter', async () => {
      taskService.getAllTasks.mockResolvedValue([]);

      await invoke(taskController.getTasks, {
        req: { query: { status: 'active' } },
      });

      expect(taskService.getAllTasks).toHaveBeenCalledWith({ status: 'active' });
    });

    it('handles the completed filter', async () => {
      taskService.getAllTasks.mockResolvedValue([]);

      await invoke(taskController.getTasks, {
        req: { query: { status: 'completed' } },
      });

      expect(taskService.getAllTasks).toHaveBeenCalledWith({ status: 'completed' });
    });
  });

  describe('getTaskById', () => {
    it('returns a task when found', async () => {
      const task = { _id: 'abc', title: 'Found' };
      taskService.getTaskById.mockResolvedValue(task);

      const { res, next } = await invoke(taskController.getTaskById, {
        req: { params: { id: 'abc' } },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: task,
        error: null,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 404 when missing', async () => {
      taskService.getTaskById.mockResolvedValue(null);

      const { next } = await invoke(taskController.getTaskById, {
        req: { params: { id: 'missing' } },
      });

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          code: 'NOT_FOUND',
          message: 'Task not found',
        }),
      );
    });
  });

  describe('updateTask', () => {
    it('accepts allowed fields', async () => {
      const updated = { _id: '1', title: 'Updated', priority: 'high' };
      taskService.updateTask.mockResolvedValue(updated);

      const { res } = await invoke(taskController.updateTask, {
        req: {
          params: { id: '1' },
          body: { title: 'Updated', priority: 'high' },
        },
      });

      expect(taskService.updateTask).toHaveBeenCalledWith('1', {
        title: 'Updated',
        priority: 'high',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updated,
        error: null,
      });
    });

    it('rejects unsupported fields', async () => {
      const { next } = await invoke(taskController.updateTask, {
        req: {
          params: { id: '1' },
          body: { title: 'Ok', completed: true },
        },
      });

      expect(taskService.updateTask).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          code: 'VALIDATION_ERROR',
        }),
      );
    });
  });

  describe('toggleTaskCompletion', () => {
    it('returns the updated task', async () => {
      const task = { _id: '1', completed: true };
      taskService.toggleTaskCompletion.mockResolvedValue(task);

      const { res } = await invoke(taskController.toggleTaskCompletion, {
        req: { params: { id: '1' } },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: task,
        error: null,
      });
    });
  });

  describe('deleteTask', () => {
    it('handles successful deletion', async () => {
      const task = { _id: '1', title: 'Gone' };
      taskService.deleteTask.mockResolvedValue({ deleted: true, task });

      const { res } = await invoke(taskController.deleteTask, {
        req: { params: { id: '1' } },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { deleted: true, task },
        error: null,
      });
    });

    it('returns 404 when missing', async () => {
      taskService.deleteTask.mockResolvedValue({ deleted: false, task: null });

      const { next } = await invoke(taskController.deleteTask, {
        req: { params: { id: 'missing' } },
      });

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          code: 'NOT_FOUND',
        }),
      );
    });
  });

  describe('deleteCompletedTasks', () => {
    it('returns deleted count', async () => {
      taskService.deleteCompletedTasks.mockResolvedValue(4);

      const { res } = await invoke(taskController.deleteCompletedTasks, {
        req: {},
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { deletedCount: 4 },
        error: null,
      });
    });
  });

  describe('error propagation', () => {
    it('passes service errors to error handling via next', async () => {
      const error = new Error('service failed');
      taskService.getAllTasks.mockRejectedValue(error);

      const { next } = await invoke(taskController.getTasks, {
        req: { query: {} },
      });

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
