const Task = require('../models/Task');

const ALLOWED_UPDATE_FIELDS = ['title', 'description', 'priority', 'dueDate'];
const ALLOWED_STATUS_FILTERS = new Set(['all', 'active', 'completed']);

/**
 * Build a safe MongoDB filter for list queries.
 * Accepts either { status: 'all'|'active'|'completed' } or { completed: boolean }.
 * Does not accept raw/operator query objects from callers.
 */
function buildListFilter(options = {}) {
  if (options == null || typeof options !== 'object' || Array.isArray(options)) {
    throw new Error('Invalid task list filter');
  }

  const filter = {};

  if (Object.prototype.hasOwnProperty.call(options, 'completed')) {
    if (typeof options.completed !== 'boolean') {
      throw new Error('completed filter must be a boolean');
    }
    filter.completed = options.completed;
    return filter;
  }

  if (Object.prototype.hasOwnProperty.call(options, 'status')) {
    if (!ALLOWED_STATUS_FILTERS.has(options.status)) {
      throw new Error('status filter must be one of: all, active, completed');
    }
    if (options.status === 'active') {
      filter.completed = false;
    } else if (options.status === 'completed') {
      filter.completed = true;
    }
  }

  return filter;
}

function pickAllowedUpdates(updates) {
  if (updates == null || typeof updates !== 'object' || Array.isArray(updates)) {
    throw new Error('Invalid update payload');
  }

  const keys = Object.keys(updates);
  const unknown = keys.filter((key) => !ALLOWED_UPDATE_FIELDS.includes(key));

  if (unknown.length > 0) {
    throw new Error(`Unsupported update fields: ${unknown.join(', ')}`);
  }

  const payload = {};
  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      payload[field] = updates[field];
    }
  }

  return payload;
}

async function createTask(taskData) {
  const task = await Task.create(taskData);
  return task;
}

async function getAllTasks(options = {}) {
  const filter = buildListFilter(options);
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  return tasks;
}

async function getTaskById(id) {
  const task = await Task.findById(id);
  return task || null;
}

async function updateTask(id, updates) {
  const payload = pickAllowedUpdates(updates);

  const task = await Task.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return task || null;
}

async function toggleTaskCompletion(id) {
  const task = await Task.findById(id);
  if (!task) {
    return null;
  }

  task.completed = !task.completed;
  await task.save();
  return task;
}

async function deleteTask(id) {
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    return { deleted: false, task: null };
  }
  return { deleted: true, task };
}

async function deleteCompletedTasks() {
  const result = await Task.deleteMany({ completed: true });
  return result.deletedCount;
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  deleteCompletedTasks,
  ALLOWED_UPDATE_FIELDS,
  buildListFilter,
  pickAllowedUpdates,
};
