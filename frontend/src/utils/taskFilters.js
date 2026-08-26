export function getVisibleTasks(tasks = [], filter = 'all', searchQuery = '') {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    if (filter === 'active' && task.completed) {
      return false;
    }
    if (filter === 'completed' && !task.completed) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const title = String(task.title || '').toLowerCase();
    const description = String(task.description || '').toLowerCase();
    return title.includes(normalizedQuery) || description.includes(normalizedQuery);
  });
}

export function getFilterLabel(filter = 'all') {
  if (filter === 'active') {
    return 'Active tasks';
  }
  if (filter === 'completed') {
    return 'Completed tasks';
  }
  return 'All tasks';
}

export function getVisibleCountLabel(filter = 'all', count = 0, hasSearch = false) {
  if (hasSearch) {
    return `${count} matching ${count === 1 ? 'task' : 'tasks'}`;
  }

  if (filter === 'active') {
    return `${count} active ${count === 1 ? 'task' : 'tasks'}`;
  }

  if (filter === 'completed') {
    return `${count} completed ${count === 1 ? 'task' : 'tasks'}`;
  }

  return `${count} ${count === 1 ? 'task' : 'tasks'}`;
}
