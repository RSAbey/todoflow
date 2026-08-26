/**
 * Normalize a MongoDB/API task document into the UI task shape.
 * UI components use `id`; the API uses `_id`.
 */
export function mapApiTaskToUi(task) {
  if (!task || typeof task !== 'object') {
    return null;
  }

  const rawId = task.id ?? task._id;
  if (rawId == null || rawId === '') {
    return null;
  }

  let dueDate = task.dueDate ?? null;
  if (typeof dueDate === 'string' && dueDate.includes('T')) {
    dueDate = dueDate.slice(0, 10);
  } else if (dueDate instanceof Date && !Number.isNaN(dueDate.getTime())) {
    dueDate = dueDate.toISOString().slice(0, 10);
  }

  return {
    id: String(rawId),
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    dueDate,
    completed: Boolean(task.completed),
    createdAt: task.createdAt || null,
    updatedAt: task.updatedAt || null,
  };
}

export function mapApiTasksToUi(tasks = []) {
  if (!Array.isArray(tasks)) {
    return [];
  }

  return tasks.map(mapApiTaskToUi).filter(Boolean);
}
