import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';
import { getTodayDateInputValue } from '../../utils/dateUtils';

function shiftDateInputValue(baseYmd, dayOffset) {
  const [year, month, day] = baseYmd.split('-').map(Number);
  const date = new Date(year, month - 1, day + dayOffset);
  return getTodayDateInputValue(date);
}

function setDueDate(value) {
  fireEvent.change(screen.getByLabelText(/due date/i), {
    target: { value },
  });
}

describe('TaskForm due date validation', () => {
  it('sets the date input min to today\'s local calendar date', () => {
    const today = getTodayDateInputValue();
    render(<TaskForm mode="create" onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/due date/i)).toHaveAttribute('min', today);
  });

  it('accepts today as a due date', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const today = getTodayDateInputValue();
    render(<TaskForm mode="create" onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/title/i), 'Due today');
    setDueDate(today);
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Due today',
        dueDate: today,
      }),
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('accepts a future due date', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const future = shiftDateInputValue(getTodayDateInputValue(), 5);
    render(<TaskForm mode="create" onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/title/i), 'Due later');
    setDueDate(future);
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Due later',
        dueDate: future,
      }),
    );
  });

  it('accepts an empty due date', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskForm mode="create" onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/title/i), 'No due date');
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'No due date',
        dueDate: null,
      }),
    );
  });

  it('rejects a past due date with an accessible validation error', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const past = shiftDateInputValue(getTodayDateInputValue(), -1);
    render(<TaskForm mode="create" onSubmit={onSubmit} onCancel={vi.fn()} />);

    const dueDateInput = screen.getByLabelText(/due date/i);
    await user.type(screen.getByLabelText(/title/i), 'Past due');
    setDueDate(past);
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Due date cannot be in the past.');
    expect(dueDateInput).toHaveAttribute('aria-invalid', 'true');
    expect(dueDateInput).toHaveAccessibleDescription(
      'Due date cannot be in the past.',
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects a manually entered past date and does not submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const past = shiftDateInputValue(getTodayDateInputValue(), -30);
    render(<TaskForm mode="create" onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/title/i), 'Typed past date');
    setDueDate(past);
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Due date cannot be in the past.',
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('applies the same past-date rule in edit mode', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const today = getTodayDateInputValue();
    const future = shiftDateInputValue(today, 3);
    const past = shiftDateInputValue(today, -1);

    render(
      <TaskForm
        mode="edit"
        initialTask={{
          id: 'task-1',
          title: 'Existing task',
          description: '',
          priority: 'medium',
          dueDate: future,
        }}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    const dueDateInput = screen.getByLabelText(/due date/i);
    expect(dueDateInput).toHaveValue(future);
    expect(dueDateInput).toHaveAttribute('min', today);

    setDueDate(past);
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Due date cannot be in the past.',
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('preserves an existing future due date in edit mode', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const future = shiftDateInputValue(getTodayDateInputValue(), 7);

    render(
      <TaskForm
        mode="edit"
        initialTask={{
          id: 'task-2',
          title: 'Keep due date',
          description: 'Details',
          priority: 'high',
          dueDate: future,
        }}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/due date/i)).toHaveValue(future);

    await user.clear(screen.getByLabelText(/title/i));
    await user.type(screen.getByLabelText(/title/i), 'Keep due date (edited)');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Keep due date (edited)',
      description: 'Details',
      priority: 'high',
      dueDate: future,
    });
  });
});
