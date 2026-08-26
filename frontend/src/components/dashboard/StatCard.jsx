function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value" aria-label={`${label}: ${value}`}>
        {value}
      </p>
    </article>
  );
}

export default StatCard;
