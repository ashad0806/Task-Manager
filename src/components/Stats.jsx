export default function Stats({ remaining, completed, overdue }) {
  return (
    <div className="mb-4 flex flex-wrap gap-3 text-sm">
      <span className="rounded bg-amber-100 px-3 py-1 font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
        {remaining} remaining
      </span>
      <span className="rounded bg-green-100 px-3 py-1 font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
        {completed} completed
      </span>
      {overdue > 0 && (
        <span className="rounded bg-red-100 px-3 py-1 font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
          {overdue} overdue
        </span>
      )}
    </div>
  );
}