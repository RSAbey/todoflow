import TaskItem from './TaskItem';
import EmptyState from '../common/EmptyState';

function TaskList({
  tasks,
  hasAnyTasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onClearView,
}) {
  if (!tasks.length) {
    if (!hasAnyTasks) {
      return (
        <EmptyState
          title="No tasks yet"
          description="Add your first task to get started."
          actionLabel="Add Task"
          onAction={onAddTask}
        />
      );
    }

    return (
      <EmptyState
        title="No matching tasks"
        description="Try a different search or filter."
        actionLabel="Clear filters"
        onAction={onClearView}
      />
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;
