function ErrorState({
  title = 'Unable to load your tasks.',
  description = 'Please check your connection and try again.',
  actionLabel = 'Retry',
  onAction,
}) {
  return (
    <div className="empty-state empty-state--error" role="alert">
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

export default ErrorState;
