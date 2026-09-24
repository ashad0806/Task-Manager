import { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { getDueStatus } from './utils/dates';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import Stats from './components/Stats';
import ThemeToggle from './components/ThemeToggle';

const systemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [theme, setTheme] = useLocalStorage('theme', systemTheme());
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Put/remove the "dark" class on <html> whenever the theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const addTask = ({ text, category, dueDate }) => {
    const newTask = {
      id: crypto.randomUUID(),
      text: text.trim(),
      category,
      dueDate,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const editTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  // DRAG-AND-DROP: move the dragged task to the target task's position
  const reorderTasks = (dragId, targetId) => {
    setTasks((prev) => {
      const from = prev.findIndex((t) => t.id === dragId);
      const to = prev.findIndex((t) => t.id === targetId);
      if (from === -1 || to === -1 || from === to) return prev;

      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  // Live counts (always based on ALL tasks)
  const completedCount = tasks.filter((t) => t.completed).length;
  const remainingCount = tasks.length - completedCount;
  const overdueCount = tasks.filter((t) => getDueStatus(t) === 'overdue').length;

  const visibleTasks = tasks.filter((t) => {
    const statusOk =
      filter === 'all' ||
      (filter === 'active' && !t.completed) ||
      (filter === 'completed' && t.completed);
    const categoryOk = categoryFilter === 'All' || t.category === categoryFilter;
    return statusOk && categoryOk;
  });

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 dark:bg-gray-900">
      <main className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            My Tasks
          </h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <Stats
          remaining={remainingCount}
          completed={completedCount}
          overdue={overdueCount}
        />

        <TaskForm onAdd={addTask} />

        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
        />

        <TaskList
          tasks={visibleTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
          onReorder={reorderTasks}
        />
      </main>
    </div>
  );
}

export default App;