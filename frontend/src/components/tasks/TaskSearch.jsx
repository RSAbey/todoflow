import { useId } from 'react';

function TaskSearch({ value, onChange, onClear }) {
  const inputId = useId();
  const hasValue = value.trim().length > 0;

  return (
    <div className="task-search">
      <label className="visually-hidden" htmlFor={inputId}>
        Search tasks
      </label>
      <div className="task-search__control">
        <span className="task-search__icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id={inputId}
          className="task-search__input"
          type="search"
          value={value}
          placeholder="Search tasks..."
          autoComplete="off"
          onChange={(event) => onChange(event.target.value)}
        />
        {hasValue ? (
          <button
            type="button"
            className="task-search__clear"
            aria-label="Clear search"
            onClick={onClear}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default TaskSearch;
