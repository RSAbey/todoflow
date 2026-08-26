import { describe, expect, it } from 'vitest';
import { getTaskStats, createLocalId } from './taskStats';
import {
  getVisibleTasks,
  getFilterLabel,
  getVisibleCountLabel,
} from './taskFilters';
import {
  formatDueDate,
  getTodayDateInputValue,
  isDueDateOnOrAfterToday,
} from './dateUtils';
import { mapApiTaskToUi, mapApiTasksToUi } from './taskMappers';

describe('getTaskStats', () => {
  it('counts total, active, and completed tasks', () => {
    expect(
      getTaskStats([
        { completed: false },
        { completed: true },
        { completed: false },
      ]),
    ).toEqual({ total: 3, active: 2, completed: 1 });
  });

  it('handles an empty list', () => {
    expect(getTaskStats([])).toEqual({ total: 0, active: 0, completed: 0 });
  });
});

describe('createLocalId', () => {
  it('returns a non-empty string id', () => {
    expect(createLocalId()).toEqual(expect.any(String));
    expect(createLocalId().length).toBeGreaterThan(0);
  });
});

describe('getVisibleTasks', () => {
  const tasks = [
    {
      id: '1',
      title: 'Write assignment notes',
      description: 'Include Git workflow',
      completed: false,
    },
    {
      id: '2',
      title: 'Buy groceries',
      description: 'Milk and eggs',
      completed: true,
    },
    {
      id: '3',
      title: 'Review docs',
      description: 'assignment checklist',
      completed: false,
    },
  ];

  it('returns all tasks for the all filter', () => {
    expect(getVisibleTasks(tasks, 'all', '')).toHaveLength(3);
  });

  it('returns only active tasks', () => {
    expect(getVisibleTasks(tasks, 'active', '').map((task) => task.id)).toEqual([
      '1',
      '3',
    ]);
  });

  it('returns only completed tasks', () => {
    expect(getVisibleTasks(tasks, 'completed', '').map((task) => task.id)).toEqual([
      '2',
    ]);
  });

  it('searches titles case-insensitively', () => {
    expect(getVisibleTasks(tasks, 'all', 'ASSIGNMENT').map((task) => task.id)).toEqual([
      '1',
      '3',
    ]);
  });

  it('searches descriptions', () => {
    expect(getVisibleTasks(tasks, 'all', 'milk').map((task) => task.id)).toEqual([
      '2',
    ]);
  });

  it('combines search with filters', () => {
    expect(
      getVisibleTasks(tasks, 'active', 'assignment').map((task) => task.id),
    ).toEqual(['1', '3']);
  });
});

describe('list labels', () => {
  it('builds filter and count labels', () => {
    expect(getFilterLabel('active')).toBe('Active tasks');
    expect(getVisibleCountLabel('all', 4, false)).toBe('4 tasks');
    expect(getVisibleCountLabel('active', 1, false)).toBe('1 active task');
    expect(getVisibleCountLabel('completed', 2, true)).toBe('2 matching tasks');
  });
});

describe('formatDueDate', () => {
  it('returns null for missing or invalid dates', () => {
    expect(formatDueDate(null)).toBeNull();
    expect(formatDueDate('')).toBeNull();
    expect(formatDueDate('not-a-date')).toBeNull();
  });

  it('formats a valid date with a Due prefix', () => {
    expect(formatDueDate('2026-08-30')).toMatch(/^Due /);
  });
});

describe('getTodayDateInputValue', () => {
  it('formats the local calendar date as YYYY-MM-DD', () => {
    const localAfternoon = new Date(2026, 7, 26, 15, 30, 0);
    expect(getTodayDateInputValue(localAfternoon)).toBe('2026-08-26');
  });

  it('does not shift the calendar day via UTC conversion', () => {
    // Late evening in a positive-offset timezone can become the next UTC day.
    const lateLocalEvening = new Date(2026, 7, 26, 23, 30, 0);
    expect(getTodayDateInputValue(lateLocalEvening)).toBe('2026-08-26');
  });
});

describe('isDueDateOnOrAfterToday', () => {
  const now = new Date(2026, 7, 26, 12, 0, 0);

  it('allows empty due dates', () => {
    expect(isDueDateOnOrAfterToday('', now)).toBe(true);
    expect(isDueDateOnOrAfterToday(null, now)).toBe(true);
  });

  it('allows today and future dates', () => {
    expect(isDueDateOnOrAfterToday('2026-08-26', now)).toBe(true);
    expect(isDueDateOnOrAfterToday('2026-08-27', now)).toBe(true);
  });

  it('rejects past dates', () => {
    expect(isDueDateOnOrAfterToday('2026-08-25', now)).toBe(false);
    expect(isDueDateOnOrAfterToday('2026-08-01', now)).toBe(false);
  });
});

describe('mapApiTaskToUi', () => {
  it('maps _id to id and normalizes ISO due dates', () => {
    expect(
      mapApiTaskToUi({
        _id: '64b0f0c2e1a1a1a1a1a1a1a1',
        title: 'Finish README',
        description: 'Docs',
        priority: 'high',
        dueDate: '2026-09-01T00:00:00.000Z',
        completed: true,
        createdAt: '2026-08-26T08:00:00.000Z',
        updatedAt: '2026-08-26T09:00:00.000Z',
      }),
    ).toEqual({
      id: '64b0f0c2e1a1a1a1a1a1a1a1',
      title: 'Finish README',
      description: 'Docs',
      priority: 'high',
      dueDate: '2026-09-01',
      completed: true,
      createdAt: '2026-08-26T08:00:00.000Z',
      updatedAt: '2026-08-26T09:00:00.000Z',
    });
  });

  it('filters invalid entries from a list', () => {
    expect(
      mapApiTasksToUi([
        { _id: '1', title: 'Valid' },
        null,
        { title: 'Missing id' },
      ]),
    ).toEqual([
      {
        id: '1',
        title: 'Valid',
        description: '',
        priority: 'medium',
        dueDate: null,
        completed: false,
        createdAt: null,
        updatedAt: null,
      },
    ]);
  });
});
