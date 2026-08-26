import { useCallback, useEffect, useMemo, useState } from 'react';
import AppShell from './components/layout/AppShell';
import Header from './components/layout/Header';
import DashboardStats from './components/dashboard/DashboardStats';
import TasksSection from './components/tasks/TasksSection';
import TaskForm from './components/tasks/TaskForm';
import Modal from './components/common/Modal';
import ConfirmDialog from './components/common/ConfirmDialog';
import LoadingState from './components/common/LoadingState';
import ErrorState from './components/common/ErrorState';
import {
  ApiError,
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from './services/taskApi';
import { getTaskStats } from './utils/taskStats';
import { getVisibleTasks } from './utils/taskFilters';
import { mapApiTaskToUi, mapApiTasksToUi } from './utils/taskMappers';

const LOAD_STATUS = {
  loading: 'loading',
  ready: 'ready',
  error: 'error',
};

function getMutationErrorMessage(error, action = 'save') {
  if (error instanceof ApiError) {
    if (error.code === 'NETWORK_ERROR') {
      return 'Unable to reach the server. Check your connection and try again.';
    }

    if (
      error.code === 'VALIDATION_ERROR' ||
      error.code === 'INVALID_BODY' ||
      error.code === 'INVALID_RESPONSE' ||
      error.code === 'NOT_FOUND' ||
      error.code === 'INVALID_ID'
    ) {
      return error.message || `Unable to ${action} this task. Please try again.`;
    }
  }

  return `Unable to ${action} this task. Please try again.`;
}

function App() {
  // GET/CREATE/UPDATE/DELETE use the API. Toggle completion remains local for now.
  const [tasks, setTasks] = useState([]);
  const [loadStatus, setLoadStatus] = useState(LOAD_STATUS.loading);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [taskDialog, setTaskDialog] = useState({ mode: null, task: null });
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadTasksFromApi() {
      setLoadStatus(LOAD_STATUS.loading);

      try {
        const data = await getTasks('all');
        if (cancelled) {
          return;
        }

        const apiTasks = Array.isArray(data?.tasks) ? data.tasks : [];
        setTasks(mapApiTasksToUi(apiTasks));
        setLoadStatus(LOAD_STATUS.ready);
      } catch {
        if (cancelled) {
          return;
        }

        setTasks([]);
        setLoadStatus(LOAD_STATUS.error);
      }
    }

    loadTasksFromApi();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  const visibleTasks = useMemo(
    () => getVisibleTasks(tasks, activeFilter, searchQuery),
    [tasks, activeFilter, searchQuery],
  );

  const isDialogOpen = taskDialog.mode === 'create' || taskDialog.mode === 'edit';
  const isFormBusy = isCreatingTask || isUpdatingTask;

  const handleRetryLoad = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  const handleCloseForm = useCallback(() => {
    if (isFormBusy) {
      return;
    }

    setFormError('');
    setTaskDialog({ mode: null, task: null });
  }, [isFormBusy]);

  const handleCloseDeleteConfirm = useCallback(() => {
    if (isDeletingTask) {
      return;
    }

    setDeleteError('');
    setTaskPendingDelete(null);
  }, [isDeletingTask]);

  const handleClearView = useCallback(() => {
    setActiveFilter('all');
    setSearchQuery('');
  }, []);

  const handleOpenCreate = useCallback(() => {
    setFormError('');
    setTaskDialog({ mode: 'create', task: null });
  }, []);

  const handleOpenEdit = useCallback((task) => {
    setFormError('');
    setTaskDialog({ mode: 'edit', task });
  }, []);

  async function handleCreateTask(payload) {
    if (isCreatingTask) {
      return;
    }

    setIsCreatingTask(true);
    setFormError('');

    try {
      const created = await createTask({
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        dueDate: payload.dueDate,
      });

      const uiTask = mapApiTaskToUi(created);
      if (!uiTask) {
        throw new ApiError('Received an unexpected response from the server.', {
          code: 'INVALID_RESPONSE',
        });
      }

      setTasks((current) => [uiTask, ...current]);
      setFormError('');
      setTaskDialog({ mode: null, task: null });
    } catch (error) {
      setFormError(getMutationErrorMessage(error, 'save'));
    } finally {
      setIsCreatingTask(false);
    }
  }

  async function handleUpdateTask(payload) {
    if (!taskDialog.task || isUpdatingTask) {
      return;
    }

    const editingId = taskDialog.task.id;
    setIsUpdatingTask(true);
    setFormError('');

    try {
      const updated = await updateTask(editingId, {
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        dueDate: payload.dueDate,
      });

      const uiTask = mapApiTaskToUi(updated);
      if (!uiTask) {
        throw new ApiError('Received an unexpected response from the server.', {
          code: 'INVALID_RESPONSE',
        });
      }

      setTasks((current) =>
        current.map((task) => (task.id === editingId ? uiTask : task)),
      );
      setFormError('');
      setTaskDialog({ mode: null, task: null });
    } catch (error) {
      setFormError(getMutationErrorMessage(error, 'save'));
    } finally {
      setIsUpdatingTask(false);
    }
  }

  function handleToggleComplete(taskId) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function handleRequestDelete(task) {
    setDeleteError('');
    setTaskPendingDelete(task);
  }

  async function handleConfirmDelete() {
    if (!taskPendingDelete || isDeletingTask) {
      return;
    }

    const idToDelete = taskPendingDelete.id;
    setIsDeletingTask(true);
    setDeleteError('');

    try {
      await deleteTask(idToDelete);
      setTasks((current) => current.filter((task) => task.id !== idToDelete));
      setDeleteError('');
      setTaskPendingDelete(null);
    } catch (error) {
      setDeleteError(getMutationErrorMessage(error, 'delete'));
    } finally {
      setIsDeletingTask(false);
    }
  }

  let mainContent;

  if (loadStatus === LOAD_STATUS.loading) {
    mainContent = <LoadingState message="Loading your tasks…" />;
  } else if (loadStatus === LOAD_STATUS.error) {
    mainContent = (
      <ErrorState
        title="Unable to load your tasks."
        description="Please check your connection and try again."
        actionLabel="Retry"
        onAction={handleRetryLoad}
      />
    );
  } else {
    mainContent = (
      <>
        <DashboardStats stats={stats} />
        <TasksSection
          tasks={tasks}
          visibleTasks={visibleTasks}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          onClearView={handleClearView}
          onAddTaskClick={handleOpenCreate}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleOpenEdit}
          onDeleteTask={handleRequestDelete}
        />
      </>
    );
  }

  return (
    <AppShell>
      <Header />
      <main id="main-content" className="page">
        <header className="page__intro">
          <h1 className="page__title">My Tasks</h1>
          <p className="page__subtitle">Stay organized and get things done.</p>
        </header>

        {mainContent}
      </main>

      <Modal
        open={isDialogOpen}
        title={taskDialog.mode === 'edit' ? 'Edit Task' : 'Add New Task'}
        onClose={handleCloseForm}
        closeDisabled={isFormBusy}
      >
        {isDialogOpen ? (
          <TaskForm
            mode={taskDialog.mode === 'edit' ? 'edit' : 'create'}
            initialTask={taskDialog.mode === 'edit' ? taskDialog.task : null}
            onSubmit={
              taskDialog.mode === 'edit' ? handleUpdateTask : handleCreateTask
            }
            onCancel={handleCloseForm}
            isSubmitting={
              taskDialog.mode === 'edit' ? isUpdatingTask : isCreatingTask
            }
            submitError={formError}
          />
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(taskPendingDelete)}
        title="Delete task"
        message={
          taskPendingDelete
            ? `Delete “${taskPendingDelete.title}”? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteConfirm}
        isSubmitting={isDeletingTask}
        submitError={deleteError}
      />
    </AppShell>
  );
}

export default App;
