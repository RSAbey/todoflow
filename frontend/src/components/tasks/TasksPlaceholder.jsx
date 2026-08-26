function TasksPlaceholder() {
  return (
    <section className="panel" aria-labelledby="tasks-heading">
      <div className="panel__header">
        <h2 id="tasks-heading" className="panel__title">
          Tasks
        </h2>
        <p className="panel__description">
          Create, filter, and manage tasks in a later step. This area is a layout
          placeholder only.
        </p>
      </div>

      <div className="placeholder-stack" aria-hidden="true">
        <div className="placeholder-row">
          <span className="placeholder-row__label">Task form area</span>
        </div>
        <div className="placeholder-row">
          <span className="placeholder-row__label">Filters and search</span>
        </div>
        <div className="placeholder-row">
          <span className="placeholder-row__label">Task list</span>
        </div>
      </div>
    </section>
  );
}

export default TasksPlaceholder;
