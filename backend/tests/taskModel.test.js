const Task = require('../src/models/Task');

describe('Task model', () => {
  it('accepts a valid task', async () => {
    const task = new Task({
      title: 'Finish README',
      description: 'Document setup steps',
      priority: 'high',
      dueDate: new Date('2026-09-01'),
    });

    await expect(task.validate()).resolves.toBeUndefined();
    expect(task.title).toBe('Finish README');
    expect(task.description).toBe('Document setup steps');
    expect(task.priority).toBe('high');
    expect(task.completed).toBe(false);
  });

  it('requires a title', async () => {
    const task = new Task({});

    await expect(task.validate()).rejects.toMatchObject({
      errors: {
        title: expect.objectContaining({
          kind: 'required',
        }),
      },
    });
  });

  it('rejects an empty title', async () => {
    const task = new Task({ title: '   ' });

    await expect(task.validate()).rejects.toBeDefined();
    await expect(task.validate()).rejects.toHaveProperty('errors.title');
  });

  it('defaults priority to medium', async () => {
    const task = new Task({ title: 'Call mentor' });

    await task.validate();

    expect(task.priority).toBe('medium');
  });

  it('rejects an invalid priority', async () => {
    const task = new Task({
      title: 'Invalid priority task',
      priority: 'urgent',
    });

    await expect(task.validate()).rejects.toMatchObject({
      errors: {
        priority: expect.objectContaining({
          kind: 'enum',
        }),
      },
    });
  });

  it('defaults completed to false', async () => {
    const task = new Task({ title: 'Buy groceries' });

    await task.validate();

    expect(task.completed).toBe(false);
  });

  it('allows an omitted description', async () => {
    const task = new Task({ title: 'No description needed' });

    await expect(task.validate()).resolves.toBeUndefined();
    expect(task.description).toBe('');
  });

  it('allows an omitted due date', async () => {
    const task = new Task({ title: 'No due date' });

    await expect(task.validate()).resolves.toBeUndefined();
    expect(task.dueDate).toBeNull();
  });

  it('configures createdAt and updatedAt timestamps on the schema', () => {
    expect(Task.schema.options.timestamps).toBe(true);
    expect(Task.schema.path('createdAt')).toBeDefined();
    expect(Task.schema.path('updatedAt')).toBeDefined();
  });
});
