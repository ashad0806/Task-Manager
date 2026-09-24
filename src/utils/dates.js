// Today's date as YYYY-MM-DD in the user's LOCAL time zone
export function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 'overdue' | 'today' | 'upcoming' | 'none'
export function getDueStatus(task) {
  if (!task.dueDate || task.completed) return 'none';
  const today = todayString();
  if (task.dueDate < today) return 'overdue';
  if (task.dueDate === today) return 'today';
  return 'upcoming';
}

// '2026-10-01' -> 'Oct 1, 2026'
export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}