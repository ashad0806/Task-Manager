import { fieldClass } from '../utils/styles';

export default function SearchBox({ value, onChange }) {
  return (
    <div className="mt-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        aria-label="Search tasks"
        className={`w-full ${fieldClass}`}
      />
    </div>
  );
}