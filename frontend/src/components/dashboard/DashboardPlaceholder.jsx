function DashboardPlaceholder() {
  return (
    <section className="panel" aria-labelledby="dashboard-heading">
      <div className="panel__header">
        <h2 id="dashboard-heading" className="panel__title">
          Overview
        </h2>
        <p className="panel__description">
          Summary counters will appear here once tasks are connected.
        </p>
      </div>

      <div className="placeholder-grid">
        <div className="placeholder-card">
          <span className="placeholder-card__label">Total</span>
          <span className="placeholder-card__hint">Placeholder</span>
        </div>
        <div className="placeholder-card">
          <span className="placeholder-card__label">Active</span>
          <span className="placeholder-card__hint">Placeholder</span>
        </div>
        <div className="placeholder-card">
          <span className="placeholder-card__label">Completed</span>
          <span className="placeholder-card__hint">Placeholder</span>
        </div>
      </div>
    </section>
  );
}

export default DashboardPlaceholder;
