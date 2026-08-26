import TaskList from './TaskList';
import TaskFilters from './TaskFilters';
import TaskSearch from './TaskSearch';
import {
  getFilterLabel,
  getVisibleCountLabel,
} from '../../utils/taskFilters';

function TasksSection({
  tasks,
  visibleTasks,
  activeFilter,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onClearSearch,
  onClearView,
  onAddTaskClick,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}) {
  const hasSearch = searchQuery.trim().length > 0;
  const filterLabel = getFilterLabel(activeFilter);
  const countLabel = getVisibleCountLabel(
    activeFilter,
    visibleTasks.length,
    hasSearch,
  );

  return (
    <section className="panel" aria-labelledby="tasks-heading">
      <div className="tasks-section__header">
        <div>
          <h2 id="tasks-heading" className="panel__title">
            {filterLabel}
          </h2>
          <p className="panel__description">{countLabel}</p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={onAddTaskClick}
        >
          + Add Task
        </button>
      </div>

      <div className="tasks-toolbar">
        <TaskSearch
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onClearSearch}
        />
        <TaskFilters value={activeFilter} onChange={onFilterChange} />
      </div>

      {(hasSearch || activeFilter !== 'all') && tasks.length > 0 ? (
        <div className="tasks-toolbar__reset">
          <button
            type="button"
            className="btn btn--ghost btn--compact"
            onClick={onClearView}
          >
            Clear filters
          </button>
        </div>
      ) : null}

      <TaskList
        tasks={visibleTasks}
        hasAnyTasks={tasks.length > 0}
        onToggleComplete={onToggleComplete}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onAddTask={onAddTaskClick}
        onClearView={onClearView}
      />
    </section>
  );
}

export default TasksSection;
