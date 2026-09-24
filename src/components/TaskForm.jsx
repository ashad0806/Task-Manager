import { useState } from 'react';
import { CATEGORIES } from '../utils/constants';

export default function TaskForm({ onAdd }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd({ text, category, dueDate });

    setText('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={120}
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Category"
        className="rounded-lg border border-gray-300 px-3 py-2"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="Due date"
        className="rounded-lg border border-gray-300 px-3 py-2"
      />

      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
      >
        Add
      </button>
    </form>
  );
}