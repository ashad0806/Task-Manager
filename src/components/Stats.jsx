export default function Stats({ remaining, completed }) {
  return (
    <div className="mb-4 flex gap-4 text-sm">
      <span className="rounded bg-amber-100 px-3 py-1 font-medium text-amber-700">
        {remaining} remaining
      </span>
      <span className="rounded bg-green-100 px-3 py-1 font-medium text-green-700">
        {completed} completed
      </span>
    </div>
  );
}