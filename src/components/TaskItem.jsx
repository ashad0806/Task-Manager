import { useState } from 'react';
import { CATEGORIES } from '../utils/constants';
import { ConfirmModal } from './ConfirmModal';

const BADGE_STYLES = {
  Work: 'bg-blue-100 text-blue-700',
  Personal: 'bg-green-100 text-green-700',
  Urgent: 'bg-red-100 text-red-700',
  College: 'bg-purple-100 text-purple-700',
  Shopping: 'bg-yellow-100 text-yellow-700',
  Others: 'bg-gray-100 text-gray-700',
};

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(task.text);
  const [draftCategory, setDraftCategory] = useState(task.category);
  const [draftDate, setDraftDate] = useState(task.dueDate);

  // null | 'delete' | 'save'  (which confirmation popup is open)
  const [confirming, setConfirming] = useState(null);

  const startEdit = () => {
    setDraftText(task.text);
    setDraftCategory(task.category);
    setDraftDate(task.dueDate);
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  // Step 1: user clicks Save -> validate, then ask for confirmation
  const requestSave = () => {
    if (!draftText.trim()) return;

    const unchanged =
      draftText.trim() === task.text &&
      draftCategory === task.category &&
      draftDate === task.dueDate;

    if (unchanged) {
      setIsEditing(false); // nothing to save, no popup needed
      return;
    }
    setConfirming('save');
  };

  // Step 2: user confirms -> actually save
  const confirmSave = () => {
    onEdit(task.id, {
      text: draftText.trim(),
      category: draftCategory,
      dueDate: draftDate,
    });
    setConfirming(null);
    setIsEditing(false);
  };

  const confirmDelete = () => {
    setConfirming(null);
    onDelete(task.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') requestSave();
    if (e.key === 'Escape') cancelEdit();
  };

  // The popup (shown on top of the page when needed)
  const modal =
    confirming === 'delete' ? (
      <ConfirmModal
        title="Delete this task?"
        message={`"${task.text}" will be permanently removed.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setConfirming(null)}
      />
    ) : confirming === 'save' ? (
      <ConfirmModal
        title="Save changes?"
        message="Your edits will replace the current task details."
        confirmLabel="Save"
        onConfirm={confirmSave}
        onCancel={() => setConfirming(null)}
      />
    ) : null;

  // ---------- EDIT MODE ----------
  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 rounded-lg border border-indigo-300 p-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={120}
          autoFocus
          className="flex-1 rounded border border-gray-300 px-2 py-1 outline-none focus:border-indigo-500"
        />
        <select
          value={draftCategory}
          onChange={(e) => setDraftCategory(e.target.value)}
          aria-label="Category"
          className="rounded border border-gray-300 px-2 py-1"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="date"
          value={draftDate}
          onChange={(e) => setDraftDate(e.target.value)}
          aria-label="Due date"
          className="rounded border border-gray-300 px-2 py-1"
        />
        <div className="flex gap-2">
          <button
            onClick={requestSave}
            className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
          >
            Save
          </button>
          <button
            onClick={cancelEdit}
            className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
        {modal}
      </li>
    );
  }

  // ---------- NORMAL MODE ----------
  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.text}" as complete`}
        className="h-5 w-5 cursor-pointer accent-indigo-600"
      />

      <div className="min-w-0 flex-1">
        <p
          className={`break-words ${
            task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
        >
          {task.text}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${
              BADGE_STYLES[task.category] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {task.category}
          </span>
          {task.dueDate && (
            <span className="text-gray-500">Due: {task.dueDate}</span>
          )}
        </div>
      </div>

      <button onClick={startEdit} className="text-sm text-blue-600 hover:underline">
        Edit
      </button>
      <button
        onClick={() => setConfirming('delete')}
        className="text-sm text-red-600 hover:underline"
      >
        Delete
      </button>

      {modal}
    </li>
  );
}