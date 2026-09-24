import { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import Stats from './components/Stats';

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');

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

  // Live counts (always based on ALL tasks)
  const completedCount = tasks.filter((t) => t.completed).length;
  const remainingCount = tasks.length - completedCount;

  // Apply status + category filters
  const visibleTasks = tasks.filter((t) => {
    const statusOk =
      filter === 'all' ||
      (filter === 'active' && !t.completed) ||
      (filter === 'completed' && t.completed);
    const categoryOk = categoryFilter === 'All' || t.category === categoryFilter;
    return statusOk && categoryOk;
  });

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <main className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-indigo-600">My Tasks</h1>

        <Stats remaining={remainingCount} completed={completedCount} />

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
        />
      </main>
    </div>
  );
}

export default App;