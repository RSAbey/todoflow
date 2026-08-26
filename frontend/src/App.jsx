import AppShell from './components/layout/AppShell';
import Header from './components/layout/Header';
import DashboardPlaceholder from './components/dashboard/DashboardPlaceholder';
import TasksPlaceholder from './components/tasks/TasksPlaceholder';

function App() {
  return (
    <AppShell>
      <Header />
      <main id="main-content" className="page">
        <header className="page__intro">
          <h1 className="page__title">Your tasks</h1>
          <p className="page__subtitle">
            Plan your day, track progress, and keep work organized in one calm
            place.
          </p>
        </header>

        <DashboardPlaceholder />
        <TasksPlaceholder />
      </main>
    </AppShell>
  );
}

export default App;
