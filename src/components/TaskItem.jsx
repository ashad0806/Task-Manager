import { useState } from 'react';
import { CATEGORIES } from '../utils/constants';
import { fieldSmClass } from '../utils/styles';
import { getDueStatus, formatDate } from '../utils/dates';
import ConfirmModal from './ConfirmModal';

const BADGE_STYLES = {
  Work: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Personal: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  College: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Shopping: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Other: 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200',
  Urgent: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(task.text);
  const [draftCategory, setDraftCategory] = useState(task.category);
  const [draftDate, setDraftDate] = useState(task.dueDate);

  // null | 'delete' | 'save'  (which confirmation popup is open)
  const [confirming, setConfirming] = useState(null);

  const dueStatus = getDueStatus(task); // 'overdue' | 'today' | 'upcoming' | 'none'

  const startEdit = () => {
    setDraftText(task.text);
    setDraftCategory(task.category);
    setDraftDate(task.dueDate);
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const requestSave = () => {
    if (!draftText.trim()) return;

    const unchanged =
      draftText.trim() === task.text &&
      draftCategory === task.category &&
      draftDate === task.dueDate;

    if (unchanged) {
      setIsEditing(false);
      return;
    }
    setConfirming('save');
  };

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

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id); // Firefox needs this
    onDragStart();
  };

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
      <li className="flex flex-col gap-2 rounded-lg border border-indigo-300 bg-white p-3 sm:flex-row sm:items-center dark:border-indigo-500 dark:bg-gray-800">
        <input
          type="text"
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={120}
          autoFocus
          className={`flex-1 ${fieldSmClass}`}
        />
        <select
          value={draftCategory}
          onChange={(e) => setDraftCategory(e.target.value)}
          aria-label="Category"
          className={fieldSmClass}
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
          className={fieldSmClass}
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
            className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
        {modal}
      </li>
    );
  }

  // ---------- NORMAL MODE ----------
  const rowClass = [
    'task-enter flex items-center gap-3 rounded-lg border p-3',
    dueStatus === 'overdue'
      ? 'task-overdue border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
    isDragging ? 'task-dragging' : '',
    isDragOver ? 'task-drag-over' : '',
  ].join(' ');

  const dueTextClass =
    dueStatus === 'overdue'
      ? 'font-semibold text-red-600 dark:text-red-400'
      : dueStatus === 'today'
      ? 'font-semibold text-amber-600 dark:text-amber-400'
      : 'text-gray-500 dark:text-gray-400';

  return (
    <li
      draggable
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={rowClass}
    >
      <span
        aria-hidden="true"
        title="Drag to reorder"
        className="select-none text-gray-400 dark:text-gray-500"
      >
        ⋮⋮
      </span>

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
            task.completed
              ? 'text-gray-400 line-through dark:text-gray-500'
              : 'text-gray-800 dark:text-gray-100'
          }`}
        >
          {task.text}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${
              BADGE_STYLES[task.category] ||
              'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
            }`}
          >
            {task.category}
          </span>

          {task.dueDate && (
            <span className={dueTextClass}>Due: {formatDate(task.dueDate)}</span>
          )}

          {dueStatus === 'overdue' && (
            <span className="rounded bg-red-600 px-1.5 py-0.5 font-semibold text-white">
              Overdue
            </span>
          )}
          {dueStatus === 'today' && (
            <span className="rounded bg-amber-500 px-1.5 py-0.5 font-semibold text-white">
              Due today
            </span>
          )}
        </div>
      </div>

      <button
        onClick={startEdit}
        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        Edit
      </button>
      <button
        onClick={() => setConfirming('delete')}
        className="text-sm text-red-600 hover:underline dark:text-red-400"
      >
        Delete
      </button>

      {modal}
    </li>
  );
}