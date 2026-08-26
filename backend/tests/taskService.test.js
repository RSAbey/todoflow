jest.mock('../src/models/Task');

const Task = require('../src/models/Task');
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  deleteCompletedTasks,
} = require('../src/services/taskService');

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('creates and returns a task', async () => {
      const input = { title: 'Write service layer' };
      const created = { _id: '1', title: 'Write service layer', completed: false };
      Task.create.mockResolvedValue(created);

      const result = await createTask(input);

      expect(Task.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(created);
    });

    it('propagates database errors', async () => {
      const error = new Error('create failed');
      Task.create.mockRejectedValue(error);

      await expect(createTask({ title: 'Fail' })).rejects.toThrow('create failed');
    });
  });

  describe('getAllTasks', () => {
    it('returns tasks newest first', async () => {
      const tasks = [{ _id: '2' }, { _id: '1' }];
      const sort = jest.fn().mockResolvedValue(tasks);
      Task.find.mockReturnValue({ sort });

      const result = await getAllTasks();

      expect(Task.find).toHaveBeenCalledWith({});
      expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(tasks);
    });

    it('filters active tasks', async () => {
      const sort = jest.fn().mockResolvedValue([]);
      Task.find.mockReturnValue({ sort });

      await getAllTasks({ status: 'active' });

      expect(Task.find).toHaveBeenCalledWith({ completed: false });
    });

    it('filters completed tasks', async () => {
      const sort = jest.fn().mockResolvedValue([]);
      Task.find.mockReturnValue({ sort });

      await getAllTasks({ status: 'completed' });

      expect(Task.find).toHaveBeenCalledWith({ completed: true });
    });
  });

  describe('getTaskById', () => {
    it('returns a task when found', async () => {
      const task = { _id: 'abc', title: 'Found' };
      Task.findById.mockResolvedValue(task);

      await expect(getTaskById('abc')).resolves.toEqual(task);
      expect(Task.findById).toHaveBeenCalledWith('abc');
    });

    it('returns null when the task is missing', async () => {
      Task.findById.mockResolvedValue(null);

      await expect(getTaskById('missing')).resolves.toBeNull();
    });
  });

  describe('updateTask', () => {
    it('updates only allowed fields', async () => {
      const updated = {
        _id: '1',
        title: 'Updated',
        description: 'New notes',
        priority: 'high',
      };
      Task.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await updateTask('1', {
        title: 'Updated',
        description: 'New notes',
        priority: 'high',
      });

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        {
          title: 'Updated',
          description: 'New notes',
          priority: 'high',
        },
        { new: true, runValidators: true },
      );
      expect(result).toEqual(updated);
    });

    it('rejects unknown fields instead of silently accepting them', async () => {
      await expect(
        updateTask('1', { title: 'Ok', completed: true, createdAt: new Date() }),
      ).rejects.toThrow(/Unsupported update fields/);

      expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('toggleTaskCompletion', () => {
    it('toggles completion and returns the updated task', async () => {
      const task = {
        _id: '1',
        completed: false,
        save: jest.fn().mockResolvedValue(undefined),
      };
      Task.findById.mockResolvedValue(task);

      const result = await toggleTaskCompletion('1');

      expect(task.completed).toBe(true);
      expect(task.save).toHaveBeenCalled();
      expect(result).toBe(task);
    });

    it('returns null when the task is missing', async () => {
      Task.findById.mockResolvedValue(null);

      await expect(toggleTaskCompletion('missing')).resolves.toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('handles successful deletion', async () => {
      const task = { _id: '1', title: 'Remove me' };
      Task.findByIdAndDelete.mockResolvedValue(task);

      await expect(deleteTask('1')).resolves.toEqual({
        deleted: true,
        task,
      });
    });

    it('reports when nothing was deleted', async () => {
      Task.findByIdAndDelete.mockResolvedValue(null);

      await expect(deleteTask('missing')).resolves.toEqual({
        deleted: false,
        task: null,
      });
    });
  });

  describe('deleteCompletedTasks', () => {
    it('returns the deleted count', async () => {
      Task.deleteMany.mockResolvedValue({ deletedCount: 3 });

      await expect(deleteCompletedTasks()).resolves.toBe(3);
      expect(Task.deleteMany).toHaveBeenCalledWith({ completed: true });
    });
  });
});
