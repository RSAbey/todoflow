function formatDueDate(dueDate) {
  if (!dueDate) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${dueDate}T00:00:00`));
}

function TaskPreviewList({ tasks }) {
  if (tasks.length === 0) {
    return (
      <p className="empty-hint">No tasks yet. Use Add Task to create one.</p>
    );
  }

  return (
    <ul className="task-preview-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-preview-item">
          <div className="task-preview-item__main">
            <p
              className={`task-preview-item__title${
                task.completed ? ' task-preview-item__title--done' : ''
              }`}
            >
              {task.title}
            </p>
            {task.description ? (
              <p className="task-preview-item__description">{task.description}</p>
            ) : null}
          </div>
          <div className="task-preview-item__meta">
            <span className={`priority-badge priority-badge--${task.priority}`}>
              {task.priority}
            </span>
            <span className="task-preview-item__due">
              {formatDueDate(task.dueDate)}
            </span>
            <span className="task-preview-item__status">
              {task.completed ? 'Completed' : 'Active'}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function TasksSection({ tasks, activeCount, onAddTaskClick }) {
  return (
    <section className="panel" aria-labelledby="tasks-heading">
      <div className="tasks-section__header">
        <div>
          <h2 id="tasks-heading" className="panel__title">
            Tasks
          </h2>
          <p className="panel__description">
            {activeCount} active {activeCount === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onAddTaskClick}
        >
          + Add Task
        </button>
      </div>

      <TaskPreviewList tasks={tasks} />
    </section>
  );
}

export default TasksSection;
