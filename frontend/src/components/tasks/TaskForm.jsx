import { useEffect, useId, useState } from 'react';
import { PRIORITIES } from '../../data/initialTasks';
import {
  getTodayDateInputValue,
  isDueDateOnOrAfterToday,
} from '../../utils/dateUtils';

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 2000;
const DUE_DATE_PAST_ERROR = 'Due date cannot be in the past.';

const EMPTY_FORM = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

function toFormState(task) {
  if (!task) {
    return EMPTY_FORM;
  }

  return {
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    dueDate: task.dueDate || '',
  };
}

function TaskForm({
  mode = 'create',
  initialTask = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitError = '',
}) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(() => toFormState(initialTask));
  const [titleError, setTitleError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const [priorityError, setPriorityError] = useState('');
  const titleId = useId();
  const descriptionId = useId();
  const priorityId = useId();
  const dueDateId = useId();
  const titleErrorId = useId();
  const dueDateErrorId = useId();
  const priorityErrorId = useId();
  const submitErrorId = useId();
  const minDueDate = getTodayDateInputValue();

  useEffect(() => {
    setForm(toFormState(initialTask));
    setTitleError('');
    setDueDateError('');
    setPriorityError('');
  }, [initialTask, mode]);

  useEffect(() => {
    const titleInput = document.getElementById(titleId);
    titleInput?.focus();
  }, [titleId, mode, initialTask]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === 'title' && titleError) {
      setTitleError('');
    }
    if (field === 'dueDate' && dueDateError) {
      setDueDateError('');
    }
    if (field === 'priority' && priorityError) {
      setPriorityError('');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const trimmedTitle = form.title.trim();
    const trimmedDescription = form.description.trim();
    let hasError = false;

    if (!trimmedTitle) {
      setTitleError('Title is required.');
      hasError = true;
    } else if (trimmedTitle.length > TITLE_MAX) {
      setTitleError(`Title must be ${TITLE_MAX} characters or fewer.`);
      hasError = true;
    }

    if (trimmedDescription.length > DESCRIPTION_MAX) {
      hasError = true;
    }

    if (!PRIORITIES.includes(form.priority)) {
      setPriorityError('Priority must be low, medium, or high.');
      hasError = true;
    }

    if (!isDueDateOnOrAfterToday(form.dueDate)) {
      setDueDateError(DUE_DATE_PAST_ERROR);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: trimmedDescription,
      priority: form.priority,
      dueDate: form.dueDate || null,
    });
  }

  function handleCancel() {
    if (isSubmitting) {
      return;
    }

    setForm(toFormState(initialTask));
    setTitleError('');
    setDueDateError('');
    setPriorityError('');
    onCancel();
  }

  const submitLabel = isSubmitting
    ? isEdit
      ? 'Saving...'
      : 'Adding...'
    : isEdit
      ? 'Save Changes'
      : 'Add Task';

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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
            className={`field__control${priorityError ? ' field__control--error' : ''}`}
            name="priority"
            value={form.priority}
            disabled={isSubmitting}
            aria-invalid={priorityError ? 'true' : 'false'}
            aria-describedby={priorityError ? priorityErrorId : undefined}
            onChange={(event) => updateField('priority', event.target.value)}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
          {priorityError ? (
            <p id={priorityErrorId} className="field__error" role="alert">
              {priorityError}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label className="field__label" htmlFor={dueDateId}>
            Due date (today or later)
          </label>
          <input
            id={dueDateId}
            className={`field__control${dueDateError ? ' field__control--error' : ''}`}
            name="dueDate"
            type="date"
            min={minDueDate}
            value={form.dueDate}
            disabled={isSubmitting}
            aria-invalid={dueDateError ? 'true' : 'false'}
            aria-describedby={dueDateError ? dueDateErrorId : undefined}
            onChange={(event) => updateField('dueDate', event.target.value)}
          />
          {dueDateError ? (
            <p id={dueDateErrorId} className="field__error" role="alert">
              {dueDateError}
            </p>
          ) : null}
        </div>
      </div>

      {submitError ? (
        <p id={submitErrorId} className="field__error" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={isSubmitting}
          aria-busy={isSubmitting ? 'true' : undefined}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
