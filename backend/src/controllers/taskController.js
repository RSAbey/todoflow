const asyncHandler = require('../middleware/asyncHandler');
const { createHttpError } = require('../middleware/httpError');
const taskService = require('../services/taskService');

const CREATE_FIELDS = ['title', 'description', 'priority', 'dueDate'];

function assertObjectBody(body) {
  if (body == null || typeof body !== 'object' || Array.isArray(body)) {
    throw createHttpError(400, 'Request body must be a JSON object', 'INVALID_BODY');
  }
}

function pickCreatePayload(body) {
  assertObjectBody(body);

  const keys = Object.keys(body);
  const unknown = keys.filter((key) => !CREATE_FIELDS.includes(key));
  if (unknown.length > 0) {
    throw createHttpError(
      400,
      `Unsupported create fields: ${unknown.join(', ')}`,
      'VALIDATION_ERROR',
    );
  }

  if (!Object.prototype.hasOwnProperty.call(body, 'title')) {
    throw createHttpError(400, 'Title is required', 'VALIDATION_ERROR');
  }

  if (typeof body.title !== 'string' || !body.title.trim()) {
    throw createHttpError(400, 'Title must not be empty', 'VALIDATION_ERROR');
  }

  const payload = {};
  for (const field of CREATE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  }
  return payload;
}

function pickUpdatePayload(body) {
  assertObjectBody(body);

  const keys = Object.keys(body);
  if (keys.length === 0) {
    throw createHttpError(400, 'Update body must include at least one field', 'VALIDATION_ERROR');
  }

  const unknown = keys.filter(
    (key) => !taskService.ALLOWED_UPDATE_FIELDS.includes(key),
  );
  if (unknown.length > 0) {
    throw createHttpError(
      400,
      `Unsupported update fields: ${unknown.join(', ')}`,
      'VALIDATION_ERROR',
    );
  }

  const payload = {};
  for (const field of taskService.ALLOWED_UPDATE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  }
  return payload;
}

function buildListOptions(query = {}) {
  const options = {};

  if (Object.prototype.hasOwnProperty.call(query, 'completed')) {
    if (query.completed !== 'true' && query.completed !== 'false') {
      throw createHttpError(
        400,
        'completed query parameter must be true or false',
        'INVALID_QUERY',
      );
    }
    options.completed = query.completed === 'true';
    return options;
  }

  if (Object.prototype.hasOwnProperty.call(query, 'status')) {
    if (!['all', 'active', 'completed'].includes(query.status)) {
      throw createHttpError(
        400,
        'status query parameter must be one of: all, active, completed',
        'INVALID_QUERY',
      );
    }
    options.status = query.status;
  }

  return options;
}

const createTask = asyncHandler(async (req, res) => {
  const payload = pickCreatePayload(req.body);
  const task = await taskService.createTask(payload);

  res.status(201).json({
    success: true,
    data: task,
    error: null,
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const options = buildListOptions(req.query);
  const tasks = await taskService.getAllTasks(options);

  res.status(200).json({
    success: true,
    data: {
      tasks,
      count: tasks.length,
    },
    error: null,
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);

  if (!task) {
    throw createHttpError(404, 'Task not found', 'NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: task,
    error: null,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const payload = pickUpdatePayload(req.body);
  const task = await taskService.updateTask(req.params.id, payload);

  if (!task) {
    throw createHttpError(404, 'Task not found', 'NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: task,
    error: null,
  });
});

const toggleTaskCompletion = asyncHandler(async (req, res) => {
  const task = await taskService.toggleTaskCompletion(req.params.id);

  if (!task) {
    throw createHttpError(404, 'Task not found', 'NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: task,
    error: null,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.params.id);

  if (!result.deleted) {
    throw createHttpError(404, 'Task not found', 'NOT_FOUND');
  }

  res.status(200).json({
    success: true,
    data: {
      deleted: true,
      task: result.task,
    },
    error: null,
  });
});

const deleteCompletedTasks = asyncHandler(async (req, res) => {
  const deletedCount = await taskService.deleteCompletedTasks();

  res.status(200).json({
    success: true,
    data: {
      deletedCount,
    },
    error: null,
  });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  deleteCompletedTasks,
};
