import { useState } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onDelete, onEdit, onReorder }) {
  const [dragId, setDragId] = useState(null); // task being dragged
  const [overId, setOverId] = useState(null); // task it is hovering over

  const clearDrag = () => {
    setDragId(null);
    setOverId(null);
  };

  if (tasks.length === 0) {
    return (
      <p className="mt-6 text-center text-gray-400 dark:text-gray-500">
        No tasks here. Add one above!
      </p>
    );
  }

  return (
    <ul className="mt-6 space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          isDragging={dragId === task.id}
          isDragOver={overId === task.id && dragId !== task.id}
          onDragStart={() => setDragId(task.id)}
          onDragOver={(e) => {
            e.preventDefault(); // required, otherwise dropping is not allowed
            setOverId(task.id);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragId && dragId !== task.id) onReorder(dragId, task.id);
            clearDrag();
          }}
          onDragEnd={clearDrag}
        />
      ))}
    </ul>
  );
}