export const PRIORITIES = ['low', 'medium', 'high'];

export const initialTasks = [
  {
    id: 'local-1',
    title: 'Prepare project demo notes',
    description: 'Outline the Git workflow and live deployment story.',
    priority: 'high',
    dueDate: '2026-08-28',
    completed: false,
    createdAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: 'local-2',
    title: 'Review API documentation',
    description: 'Confirm frontend request shapes against docs/API.md.',
    priority: 'medium',
    dueDate: '2026-08-30',
    completed: false,
    createdAt: '2026-08-21T09:00:00.000Z',
  },
  {
    id: 'local-3',
    title: 'Sketch mobile task list layout',
    description: '',
    priority: 'low',
    dueDate: null,
    completed: true,
    createdAt: '2026-08-18T14:00:00.000Z',
  },
];
