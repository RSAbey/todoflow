/**
 * Format a due date for display.
 * Accepts YYYY-MM-DD strings or Date-compatible values.
 * Returns null when missing/invalid so callers can omit the UI.
 */
export function formatDueDate(dueDate, options = {}) {
  if (dueDate == null || dueDate === '') {
    return null;
  }

  const value =
    typeof dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dueDate)
      ? new Date(`${dueDate}T00:00:00`)
      : new Date(dueDate);

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  const formatted = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    ...(options.includeYear ? { year: 'numeric' } : {}),
  }).format(value);

  return options.prefix === false ? formatted : `Due ${formatted}`;
}

/**
 * Local calendar date as YYYY-MM-DD for HTML date inputs.
 * Uses local year/month/day — not UTC via toISOString().
 */
export function getTodayDateInputValue(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Empty due dates are allowed. Non-empty values must be YYYY-MM-DD
 * and on or after today's local calendar date.
 */
export function isDueDateOnOrAfterToday(dueDate, now = new Date()) {
  if (dueDate == null || dueDate === '') {
    return true;
  }

  if (typeof dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return false;
  }

  return dueDate >= getTodayDateInputValue(now);
}
