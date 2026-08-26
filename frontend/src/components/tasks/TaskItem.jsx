import { formatDueDate } from '../../utils/dateUtils';

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const PRIORITY_MARKS = {
  low: 'L',
  medium: 'M',
  high: 'H',
};

function TaskItem({ task, onToggleComplete, onEditTask, onDeleteTask }) {
  const checkboxId = `task-complete-${task.id}`;
  const dueLabel = formatDueDate(task.dueDate);
  const priority = PRIORITY_LABELS[task.priority] || 'Medium';
  const priorityMark = PRIORITY_MARKS[task.priority] || 'M';

  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
      <div className="task-item__check">
        <input
          id={checkboxId}
          className="task-item__checkbox"
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          aria-label={`Mark “${task.title}” as ${
            task.completed ? 'active' : 'complete'
          }`}
        />
      </div>

      <div className="task-item__body">
        <label htmlFor={checkboxId} className="task-item__title">
          {task.title}
        </label>

        <div className="task-item__meta">
          <span
            className={`priority-badge priority-badge--${task.priority || 'medium'}`}
            title={`Priority: ${priority}`}
          >
            <span className="priority-badge__mark" aria-hidden="true">
              {priorityMark}
            </span>
            <span>{priority}</span>
          </span>

          {dueLabel ? (
            <span className="task-item__due">{dueLabel}</span>
          ) : null}
        </div>

        {task.description ? (
          <p className="task-item__description">{task.description}</p>
        ) : null}
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className="btn btn--secondary btn--compact"
          onClick={() => onEditTask(task)}
          aria-label={`Edit task “${task.title}”`}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn--secondary btn--compact"
          onClick={() => onDeleteTask(task)}
          aria-label={`Delete task “${task.title}”`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
