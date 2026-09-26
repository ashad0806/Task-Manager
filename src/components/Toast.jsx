export default function Toast({ message, actionLabel, onAction, onClose }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg dark:bg-gray-700">
      <span>{message}</span>
      {actionLabel && (
        <button
          onClick={onAction}
          className="font-semibold text-indigo-300 underline hover:text-indigo-200"
        >
          {actionLabel}
        </button>
      )}
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="text-gray-400 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}