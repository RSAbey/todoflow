import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import {
  ApiError,
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from './services/taskApi';
import { getTodayDateInputValue } from './utils/dateUtils';

vi.mock('./services/taskApi', async () => {
  const actual = await vi.importActual('./services/taskApi');
  return {
    ...actual,
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  };
});

const API_TASKS = [
  {
    _id: 'api-1',
    title: 'Prepare project demo notes',
    description: 'Outline the Git workflow and live deployment story.',
    priority: 'high',
    dueDate: '2026-08-28T00:00:00.000Z',
    completed: false,
    createdAt: '2026-08-20T10:00:00.000Z',
  },
  {
    _id: 'api-2',
    title: 'Review API documentation',
    description: 'Confirm frontend request shapes against docs/API.md.',
    priority: 'medium',
    dueDate: '2026-08-30T00:00:00.000Z',
    completed: false,
    createdAt: '2026-08-21T09:00:00.000Z',
  },
  {
    _id: 'api-3',
    title: 'Sketch mobile task list layout',
    description: '',
    priority: 'low',
    dueDate: null,
    completed: true,
    createdAt: '2026-08-18T14:00:00.000Z',
  },
];

function mockTasksResponse(tasks = API_TASKS) {
  getTasks.mockResolvedValue({
    tasks,
    count: tasks.length,
  });
}

function mockCreatedTask(overrides = {}) {
  return {
    _id: 'api-created-1',
    title: 'Ship frontend tests',
    description: 'Cover add edit filter and search',
    priority: 'medium',
    dueDate: null,
    completed: false,
    createdAt: '2026-08-26T12:00:00.000Z',
    updatedAt: '2026-08-26T12:00:00.000Z',
    ...overrides,
  };
}

async function renderReadyApp() {
  render(<App />);
  await screen.findByText('Prepare project demo notes');
}

describe('TodoFlow App', () => {
  beforeEach(() => {
    mockTasksResponse();
    createTask.mockReset();
    updateTask.mockReset();
    deleteTask.mockReset();
    createTask.mockResolvedValue(mockCreatedTask());
    updateTask.mockResolvedValue({
      ...API_TASKS[2],
      title: 'Refine mobile task list layout',
      updatedAt: '2026-08-26T13:00:00.000Z',
    });
    deleteTask.mockResolvedValue({
      deleted: true,
      task: { _id: 'api-2', title: 'Review API documentation' },
    });
  });

  it('shows a loading state before tasks arrive', async () => {
    let resolveLoad;
    getTasks.mockReturnValue(
      new Promise((resolve) => {
        resolveLoad = resolve;
      }),
    );

    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading your tasks…');
    expect(screen.queryByText('No tasks yet')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Total:/)).not.toBeInTheDocument();

    resolveLoad({ tasks: API_TASKS, count: API_TASKS.length });
    expect(await screen.findByText('Prepare project demo notes')).toBeInTheDocument();
  });

  it('calls GET /api/tasks on startup and renders API tasks', async () => {
    await renderReadyApp();

    expect(getTasks).toHaveBeenCalledWith('all');
    expect(screen.getByText('Prepare project demo notes')).toBeInTheDocument();
    expect(screen.getByText('Review API documentation')).toBeInTheDocument();
    expect(screen.getByText('Sketch mobile task list layout')).toBeInTheDocument();
  });

  it('renders dashboard statistics from API tasks', async () => {
    await renderReadyApp();

    expect(screen.getByLabelText('Total: 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Active: 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Completed: 1')).toBeInTheDocument();
  });

  it('creates a task through the API and updates the UI', async () => {
    const user = userEvent.setup();
    await renderReadyApp();

    await user.click(screen.getByRole('button', { name: '+ Add Task' }));

    const dialog = screen.getByRole('dialog', { name: 'Add New Task' });
    expect(dialog).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add Task' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Title is required.');
    expect(createTask).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/title/i), 'Ship frontend tests');
    await user.type(
      screen.getByLabelText(/description/i),
      'Cover add edit filter and search',
    );
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledTimes(1);
    });

    expect(createTask).toHaveBeenCalledWith({
      title: 'Ship frontend tests',
      description: 'Cover add edit filter and search',
      priority: 'medium',
      dueDate: null,
    });

    const createPayload = createTask.mock.calls[0][0];
    expect(createPayload).not.toHaveProperty('id');
    expect(createPayload).not.toHaveProperty('_id');
    expect(createPayload).not.toHaveProperty('completed');
    expect(createPayload).not.toHaveProperty('createdAt');
    expect(createPayload).not.toHaveProperty('updatedAt');

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Add New Task' }),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText('Ship frontend tests')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: /Mark “Ship frontend tests” as complete/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Total: 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Active: 3')).toBeInTheDocument();
  });

  it('shows Adding... and prevents duplicate create submissions', async () => {
    const user = userEvent.setup();
    let resolveCreate;
    createTask.mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve;
      }),
    );

    await renderReadyApp();
    await user.click(screen.getByRole('button', { name: '+ Add Task' }));
    await user.type(screen.getByLabelText(/title/i), 'Only once');

    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    const busyButton = await screen.findByRole('button', { name: 'Adding...' });
    expect(busyButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();

    await user.click(busyButton);
    expect(createTask).toHaveBeenCalledTimes(1);

    resolveCreate(mockCreatedTask({ title: 'Only once' }));
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Add New Task' }),
      ).not.toBeInTheDocument();
    });
    expect(createTask).toHaveBeenCalledTimes(1);
  });

  it('keeps the create dialog open with values after an API failure and allows retry', async () => {
    const user = userEvent.setup();
    createTask
      .mockRejectedValueOnce(
        new ApiError('Unable to reach the TodoFlow API.', {
          code: 'NETWORK_ERROR',
        }),
      )
      .mockResolvedValueOnce(
        mockCreatedTask({
          _id: 'api-retry-1',
          title: 'Retry create',
          description: 'Try again',
        }),
      );

    await renderReadyApp();
    await user.click(screen.getByRole('button', { name: '+ Add Task' }));
    await user.type(screen.getByLabelText(/title/i), 'Retry create');
    await user.type(screen.getByLabelText(/description/i), 'Try again');
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(
      await screen.findByText(
        'Unable to reach the server. Check your connection and try again.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Add New Task' })).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('Retry create');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Try again');
    expect(screen.queryByText('Retry create')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Add New Task' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText('Retry create')).toBeInTheDocument();
    expect(screen.getByLabelText('Total: 4')).toBeInTheDocument();
  });

  it('uses the backend task id after a successful create', async () => {
    const user = userEvent.setup();
    createTask.mockResolvedValue(
      mockCreatedTask({
        _id: 'mongo-id-abc',
        title: 'Persisted id task',
      }),
    );

    await renderReadyApp();
    await user.click(screen.getByRole('button', { name: '+ Add Task' }));
    await user.type(screen.getByLabelText(/title/i), 'Persisted id task');
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    await waitFor(() => {
      expect(screen.getByText('Persisted id task')).toBeInTheDocument();
    });

    expect(
      document.getElementById('task-complete-mongo-id-abc'),
    ).toBeInTheDocument();
  });

  it('updates a task through the API and preserves completion state', async () => {
    const user = userEvent.setup();
    await renderReadyApp();

    const completedCheckbox = screen.getByRole('checkbox', {
      name: /Sketch mobile task list layout/,
    });
    expect(completedCheckbox).toBeChecked();

    await user.click(
      screen.getByRole('button', {
        name: 'Edit task “Sketch mobile task list layout”',
      }),
    );

    const dialog = screen.getByRole('dialog', { name: 'Edit Task' });
    const titleInput = within(dialog).getByLabelText(/title/i);
    expect(titleInput).toHaveValue('Sketch mobile task list layout');

    await user.clear(titleInput);
    await user.type(titleInput, 'Refine mobile task list layout');
    await user.click(within(dialog).getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledTimes(1);
    });

    expect(updateTask).toHaveBeenCalledWith('api-3', {
      title: 'Refine mobile task list layout',
      description: '',
      priority: 'low',
      dueDate: null,
    });

    const updatePayload = updateTask.mock.calls[0][1];
    expect(updatePayload).not.toHaveProperty('id');
    expect(updatePayload).not.toHaveProperty('_id');
    expect(updatePayload).not.toHaveProperty('completed');
    expect(updatePayload).not.toHaveProperty('createdAt');
    expect(updatePayload).not.toHaveProperty('updatedAt');

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Edit Task' }),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText('Refine mobile task list layout')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: /Refine mobile task list layout/,
      }),
    ).toBeChecked();
    expect(document.getElementById('task-complete-api-3')).toBeInTheDocument();
    expect(screen.getByLabelText('Completed: 1')).toBeInTheDocument();
  });

  it('shows Saving... and prevents duplicate edit submissions', async () => {
    const user = userEvent.setup();
    let resolveUpdate;
    updateTask.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      }),
    );

    await renderReadyApp();
    await user.click(
      screen.getByRole('button', {
        name: 'Edit task “Sketch mobile task list layout”',
      }),
    );

    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Busy edit');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    const busyButton = await screen.findByRole('button', { name: 'Saving...' });
    expect(busyButton).toBeDisabled();
    await user.click(busyButton);
    expect(updateTask).toHaveBeenCalledTimes(1);

    resolveUpdate({
      ...API_TASKS[2],
      title: 'Busy edit',
    });
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Edit Task' }),
      ).not.toBeInTheDocument();
    });
    expect(updateTask).toHaveBeenCalledTimes(1);
  });

  it('keeps the edit dialog open after API failure and allows retry', async () => {
    const user = userEvent.setup();
    const futureDue = getTodayDateInputValue();
    updateTask
      .mockRejectedValueOnce(
        new ApiError('Unable to reach the TodoFlow API.', {
          code: 'NETWORK_ERROR',
        }),
      )
      .mockResolvedValueOnce({
        ...API_TASKS[0],
        title: 'Edited demo notes',
        description: 'Updated description',
        priority: 'medium',
        dueDate: `${futureDue}T00:00:00.000Z`,
        completed: false,
      });

    await renderReadyApp();
    await user.click(
      screen.getByRole('button', {
        name: 'Edit task “Prepare project demo notes”',
      }),
    );

    const dialog = screen.getByRole('dialog', { name: 'Edit Task' });
    await user.clear(within(dialog).getByLabelText(/title/i));
    await user.type(within(dialog).getByLabelText(/title/i), 'Edited demo notes');
    await user.clear(within(dialog).getByLabelText(/description/i));
    await user.type(
      within(dialog).getByLabelText(/description/i),
      'Updated description',
    );
    await user.selectOptions(within(dialog).getByLabelText(/priority/i), 'medium');
    fireEvent.change(within(dialog).getByLabelText(/due date/i), {
      target: { value: futureDue },
    });
    await user.click(within(dialog).getByRole('button', { name: 'Save Changes' }));

    expect(
      await screen.findByText(
        'Unable to reach the server. Check your connection and try again.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Edit Task' })).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/title/i)).toHaveValue('Edited demo notes');
    expect(within(dialog).getByLabelText(/description/i)).toHaveValue(
      'Updated description',
    );
    expect(screen.getByText('Prepare project demo notes')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Save Changes' }));

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Edit Task' }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText('Edited demo notes')).toBeInTheDocument();
    expect(updateTask.mock.calls[1][0]).toBe('api-1');
    expect(updateTask.mock.calls[1][1]).toEqual({
      title: 'Edited demo notes',
      description: 'Updated description',
      priority: 'medium',
      dueDate: futureDue,
    });
  });

  it('toggles completion and updates statistics', async () => {
    const user = userEvent.setup();
    await renderReadyApp();

    const checkbox = screen.getByRole('checkbox', {
      name: /Prepare project demo notes/,
    });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByLabelText('Active: 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Completed: 2')).toBeInTheDocument();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(screen.getByLabelText('Active: 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Completed: 1')).toBeInTheDocument();
  });

  it('confirms delete through the API and can cancel deletion', async () => {
    const user = userEvent.setup();
    await renderReadyApp();

    await user.click(
      screen.getByRole('button', {
        name: 'Delete task “Review API documentation”',
      }),
    );

    expect(
      screen.getByRole('dialog', { name: 'Delete task' }),
    ).toHaveTextContent('Review API documentation');

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByText('Review API documentation')).toBeInTheDocument();
    expect(screen.getByLabelText('Total: 3')).toBeInTheDocument();
    expect(deleteTask).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole('button', {
        name: 'Delete task “Review API documentation”',
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith('api-2');
    });
    await waitFor(() => {
      expect(
        screen.queryByText('Review API documentation'),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('Total: 2')).toBeInTheDocument();
  });

  it('shows Deleting... and prevents duplicate delete submissions', async () => {
    const user = userEvent.setup();
    let resolveDelete;
    deleteTask.mockReturnValue(
      new Promise((resolve) => {
        resolveDelete = resolve;
      }),
    );

    await renderReadyApp();
    await user.click(
      screen.getByRole('button', {
        name: 'Delete task “Review API documentation”',
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    const busyButton = await screen.findByRole('button', { name: 'Deleting...' });
    expect(busyButton).toBeDisabled();
    await user.click(busyButton);
    expect(deleteTask).toHaveBeenCalledTimes(1);

    resolveDelete({
      deleted: true,
      task: { _id: 'api-2', title: 'Review API documentation' },
    });
    await waitFor(() => {
      expect(
        screen.queryByText('Review API documentation'),
      ).not.toBeInTheDocument();
    });
    expect(deleteTask).toHaveBeenCalledTimes(1);
  });

  it('keeps the task after delete API failure and allows retry', async () => {
    const user = userEvent.setup();
    deleteTask
      .mockRejectedValueOnce(
        new ApiError('Unable to reach the TodoFlow API.', {
          code: 'NETWORK_ERROR',
        }),
      )
      .mockResolvedValueOnce({
        deleted: true,
        task: { _id: 'api-2', title: 'Review API documentation' },
      });

    await renderReadyApp();
    await user.click(
      screen.getByRole('button', {
        name: 'Delete task “Review API documentation”',
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      await screen.findByText(
        'Unable to reach the server. Check your connection and try again.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Review API documentation')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Delete task' })).toBeInTheDocument();
    expect(screen.getByLabelText('Total: 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
      expect(
        screen.queryByText('Review API documentation'),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('Total: 2')).toBeInTheDocument();
  });

  it('filters All, Active, and Completed without changing dashboard totals', async () => {
    const user = userEvent.setup();
    await renderReadyApp();

    await user.click(screen.getByRole('radio', { name: 'Active' }));
    expect(screen.getByText('Prepare project demo notes')).toBeInTheDocument();
    expect(screen.getByText('Review API documentation')).toBeInTheDocument();
    expect(
      screen.queryByText('Sketch mobile task list layout'),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('Total: 3')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Completed' }));
    expect(screen.getByText('Sketch mobile task list layout')).toBeInTheDocument();
    expect(
      screen.queryByText('Prepare project demo notes'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'All' }));
    expect(screen.getByText('Prepare project demo notes')).toBeInTheDocument();
    expect(screen.getByText('Sketch mobile task list layout')).toBeInTheDocument();
  });

  it('searches by title and description and clears search', async () => {
    const user = userEvent.setup();
    await renderReadyApp();

    const search = screen.getByLabelText('Search tasks');
    await user.type(search, 'API');
    expect(screen.getByText('Review API documentation')).toBeInTheDocument();
    expect(
      screen.queryByText('Prepare project demo notes'),
    ).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'git workflow');
    expect(screen.getByText('Prepare project demo notes')).toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'ASSIGNMENT');
    expect(screen.getByText('No matching tasks')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(search).toHaveValue('');
    expect(screen.getByText('Prepare project demo notes')).toBeInTheDocument();
  });

  it('combines search with filters and supports empty states', async () => {
    const user = userEvent.setup();
    await renderReadyApp();

    await user.click(screen.getByRole('radio', { name: 'Active' }));
    await user.type(screen.getByLabelText('Search tasks'), 'API');
    expect(screen.getByText('Review API documentation')).toBeInTheDocument();
    expect(
      screen.queryByText('Sketch mobile task list layout'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('radio', { name: 'All' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByLabelText('Search tasks')).toHaveValue('');

    await user.click(
      screen.getByRole('button', {
        name: 'Delete task “Prepare project demo notes”',
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(
      screen.getByRole('button', {
        name: 'Delete task “Review API documentation”',
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(
      screen.getByRole('button', {
        name: 'Delete task “Sketch mobile task list layout”',
      }),
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add Task' }));
    expect(
      screen.getByRole('dialog', { name: 'Add New Task' }),
    ).toBeInTheDocument();
  });

  it('shows the empty state when the API returns no tasks', async () => {
    mockTasksResponse([]);
    render(<App />);

    expect(await screen.findByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByLabelText('Total: 0')).toBeInTheDocument();
    expect(screen.queryByText('Unable to load your tasks.')).not.toBeInTheDocument();
  });

  it('shows an error state when loading fails and retries GET /api/tasks', async () => {
    const user = userEvent.setup();
    getTasks
      .mockRejectedValueOnce(
        new ApiError('Unable to reach the TodoFlow API.', {
          code: 'NETWORK_ERROR',
        }),
      )
      .mockResolvedValueOnce({
        tasks: API_TASKS,
        count: API_TASKS.length,
      });

    render(<App />);

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('Unable to load your tasks.');
    expect(
      screen.getByText('Please check your connection and try again.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('No tasks yet')).not.toBeInTheDocument();
    expect(getTasks).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => {
      expect(getTasks).toHaveBeenCalledTimes(2);
    });
    expect(await screen.findByText('Prepare project demo notes')).toBeInTheDocument();
    expect(screen.getByLabelText('Total: 3')).toBeInTheDocument();
  });

  it('exposes accessible names, selected filters, and linked validation errors', async () => {
    const user = userEvent.setup();
    await renderReadyApp();

    expect(
      screen.getByRole('checkbox', {
        name: /Mark “Prepare project demo notes” as complete/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Edit task “Prepare project demo notes”',
      }),
    ).toHaveAccessibleName();
    expect(screen.getByRole('radio', { name: 'All' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await user.click(screen.getByRole('button', { name: '+ Add Task' }));
    const dialog = screen.getByRole('dialog', { name: 'Add New Task' });
    expect(dialog).toHaveAccessibleName('Add New Task');

    const titleInput = within(dialog).getByLabelText(/title/i);
    expect(titleInput).toHaveAccessibleName(/title/i);
    await user.click(within(dialog).getByRole('button', { name: 'Add Task' }));

    const error = within(dialog).getByRole('alert');
    expect(error).toHaveTextContent('Title is required.');
    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    expect(titleInput).toHaveAccessibleDescription('Title is required.');
  });
});
