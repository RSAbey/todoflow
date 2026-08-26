import { useCallback, useMemo, useState } from 'react';
import AppShell from './components/layout/AppShell';
import Header from './components/layout/Header';
import DashboardStats from './components/dashboard/DashboardStats';
import TasksSection from './components/tasks/TasksSection';
import TaskForm from './components/tasks/TaskForm';
import Modal from './components/common/Modal';
import { initialTasks } from './data/initialTasks';
import { createLocalId, getTaskStats } from './utils/taskStats';

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);

  const handleCloseForm = useCallback(() => {
    setIsAddOpen(false);
  }, []);

  function handleCreateTask(payload) {
    const nextTask = {
      id: createLocalId(),
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      dueDate: payload.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((current) => [nextTask, ...current]);
    setIsAddOpen(false);
  }

  return (
    <AppShell>
      <Header />
      <main id="main-content" className="page">
        <header className="page__intro">
          <h1 className="page__title">My Tasks</h1>
          <p className="page__subtitle">Stay organized and get things done.</p>
        </header>

        <DashboardStats stats={stats} />
        <TasksSection
          tasks={tasks}
          activeCount={stats.active}
          onAddTaskClick={() => setIsAddOpen(true)}
        />
      </main>

      <Modal open={isAddOpen} title="Add Task" onClose={handleCloseForm}>
        <TaskForm onSubmit={handleCreateTask} onCancel={handleCloseForm} />
      </Modal>
    </AppShell>
  );
}

export default App;
