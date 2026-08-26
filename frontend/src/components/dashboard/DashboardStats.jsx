import StatCard from './StatCard';

function DashboardStats({ stats }) {
  return (
    <section className="panel" aria-labelledby="overview-heading">
      <div className="panel__header">
        <h2 id="overview-heading" className="panel__title">
          Overview
        </h2>
        <p className="panel__description">
          A quick snapshot of your current workload.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Completed" value={stats.completed} />
      </div>
    </section>
  );
}

export default DashboardStats;
