function EmptyState({
  title = 'No tasks yet',
  description = 'Add your first task to get started.',
  actionLabel = 'Add Task',
  onAction,
}) {
  return (
    <div className="empty-state" role="status">
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {onAction ? (
        <button type="button" className="btn btn--primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
