import { useState, useEffect, useRef } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { getDueStatus } from './utils/dates';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import Stats from './components/Stats';
import ThemeToggle from './components/ThemeToggle';
import SearchBox from './components/SearchBox';
import Toast from './components/Toast';

const systemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [theme, setTheme] = useLocalStorage('theme', systemTheme());
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  // Delete + undo
  const [deletedTask, setDeletedTask] = useState(null); // { task, index } | null
  const deletedTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    return () => {
      if (deletedTimerRef.current) clearTimeout(deletedTimerRef.current);
    };
  }, []);

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
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    const task = tasks[index];

    setTasks((prev) => prev.filter((t) => t.id !== id));

    if (deletedTimerRef.current) clearTimeout(deletedTimerRef.current);
    setDeletedTask({ task, index });
    deletedTimerRef.current = setTimeout(() => setDeletedTask(null), 5000);
  };

  const undoDelete = () => {
    if (!deletedTask) return;
    const { task, index } = deletedTask;

    setTasks((prev) => {
      const next = [...prev];
      const safeIndex = Math.min(index, next.length);
      next.splice(safeIndex, 0, task);
      return next;
    });

    if (deletedTimerRef.current) clearTimeout(deletedTimerRef.current);
    setDeletedTask(null);
  };

  const editTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

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

  const completedCount = tasks.filter((t) => t.completed).length;
  const remainingCount = tasks.length - completedCount;
  const overdueCount = tasks.filter((t) => getDueStatus(t) === 'overdue').length;

  const visibleTasks = tasks.filter((t) => {
    const statusOk =
      filter === 'all' ||
      (filter === 'active' && !t.completed) ||
      (filter === 'completed' && t.completed);
    const categoryOk = categoryFilter === 'All' || t.category === categoryFilter;
    const searchOk =
      !searchText.trim() ||
      t.text.toLowerCase().includes(searchText.trim().toLowerCase());
    return statusOk && categoryOk && searchOk;
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

        <SearchBox value={searchText} onChange={setSearchText} />

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

      {deletedTask && (
        <Toast
          message={`"${deletedTask.task.text}" deleted`}
          actionLabel="Undo"
          onAction={undoDelete}
          onClose={() => setDeletedTask(null)}
        />
      )}
    </div>
  );
}

export default App;