const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

function TaskFilters({ value, onChange }) {
  return (
    <div
      className="task-filters"
      role="radiogroup"
      aria-label="Filter tasks"
    >
      {FILTERS.map((filter) => {
        const selected = value === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`task-filters__option${
              selected ? ' task-filters__option--selected' : ''
            }`}
            onClick={() => onChange(filter.id)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export default TaskFilters;
