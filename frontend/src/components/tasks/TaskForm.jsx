import { useEffect, useId, useState } from 'react';
import { PRIORITIES } from '../../data/initialTasks';

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 2000;

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

function TaskForm({ onSubmit, onCancel, submitLabel = 'Add Task' }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [titleError, setTitleError] = useState('');
  const titleId = useId();
  const descriptionId = useId();
  const priorityId = useId();
  const dueDateId = useId();
  const titleErrorId = useId();

  useEffect(() => {
    const titleInput = document.getElementById(titleId);
    titleInput?.focus();
  }, [titleId]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === 'title' && titleError) {
      setTitleError('');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) {
      setTitleError('Title is required.');
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
    });

    setForm(EMPTY_FORM);
    setTitleError('');
  }

  function handleCancel() {
    setForm(EMPTY_FORM);
    setTitleError('');
    onCancel();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor={titleId}>
          Title <span className="field__required">*</span>
        </label>
        <input
          id={titleId}
          className={`field__control${titleError ? ' field__control--error' : ''}`}
          name="title"
          type="text"
          value={form.title}
          maxLength={TITLE_MAX}
          placeholder="What needs to be done?"
          aria-invalid={titleError ? 'true' : 'false'}
          aria-describedby={titleError ? titleErrorId : undefined}
          onChange={(event) => updateField('title', event.target.value)}
        />
        {titleError ? (
          <p id={titleErrorId} className="field__error" role="alert">
            {titleError}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor={descriptionId}>
          Description
        </label>
        <textarea
          id={descriptionId}
          className="field__control field__control--textarea"
          name="description"
          rows={4}
          maxLength={DESCRIPTION_MAX}
          placeholder="Add optional details"
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field__label" htmlFor={priorityId}>
            Priority
          </label>
          <select
            id={priorityId}
            className="field__control"
            name="priority"
            value={form.priority}
            onChange={(event) => updateField('priority', event.target.value)}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor={dueDateId}>
            Due date
          </label>
          <input
            id={dueDateId}
            className="field__control"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(event) => updateField('dueDate', event.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
