# Personal Task Manager

A task-management web app for adding, organizing and tracking daily to-dos. Built with **React**, **Vite** and **Tailwind CSS**. Tasks are saved in the browser, so they are still there after a page refresh.

**Repository:** https://github.com/ashad0806/Task-Manager

## Features

### Core features

- **Add, edit, delete and complete tasks.** Edit tasks inline (text, category and due date).
- **Filter by status:** All, Active or Completed.
- **Categories:** Work, Personal, College/Student and Urgent, with color-coded badges. Tasks can also be filtered by category.
- **Persistence:** all tasks are stored in `localStorage` and survive a page refresh.
- **Live counters:** the number of remaining and completed tasks updates instantly.

### Extras

- **Confirmation popups** before deleting a task or saving an edit, to prevent accidents.
- **Due dates** can be set on each task.
- **Input validation:** empty or whitespace-only tasks are rejected.
- **Responsive layout** that works on mobile and desktop.

### Stretch goals

- [x] Due dates
- [ ] Overdue indicators for late tasks
- [ ] Dark / light theme toggle
- [ ] Drag-and-drop reordering

## Tech Stack

| Tool | Purpose |
|---|---|
| React | UI components and state |
| Vite | Dev server and build tool |
| Tailwind CSS | Styling |
| localStorage | Saving tasks in the browser |

## Getting Started

You need [Node.js](https://nodejs.org/) (version 18 or newer).

```bash
# 1. Clone the repository
git clone https://github.com/ashad0806/Task-Manager.git

# 2. Go into the project folder
cd Task-Manager

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open the address shown in the terminal (usually `http://localhost:5173`).

### Other commands

```bash
npm run build     # create a production build in /dist
npm run preview   # preview the production build locally
```

## Project Structure

```
src/
├── components/
│   ├── ConfirmModal.jsx   # Reusable confirmation popup
│   ├── FilterBar.jsx      # Status and category filters
│   ├── Stats.jsx          # Remaining / completed counters
│   ├── TaskForm.jsx       # Form for adding tasks
│   ├── TaskItem.jsx       # Single task row with inline editing
│   └── TaskList.jsx       # List of tasks and empty state
├── hooks/
│   └── useLocalStorage.js # State hook that syncs with localStorage
├── utils/
│   ├── constants.js       # Category list
│   └── storage.js         # Safe localStorage read/write helpers
├── App.jsx                # Main state and task logic
├── App.css                # Tailwind import
└── main.jsx               # App entry point
```

## How It Works

- **State lives in `App.jsx`.** It holds the task list and the add, edit, delete and toggle functions, and passes them down to child components as props.
- **`useLocalStorage`** is a custom hook that works like `useState`, but loads its initial value from `localStorage` and saves automatically whenever the value changes.
- **Each task** is stored as an object:

```js
{
  id: 'unique-id',
  text: 'Finish assignment',
  category: 'College',
  dueDate: '2026-10-01',
  completed: false,
  createdAt: 1790000000000
}
```

- **Filtering is derived, not stored.** The visible list is calculated from the full task list and the current filters on every render, so the counters always stay accurate.

## Testing Checklist

- [ ] Add a task with a category and due date
- [ ] Empty tasks are rejected
- [ ] Mark a task complete and undo it
- [ ] Edit a task (Save, Cancel and Escape all behave correctly)
- [ ] Deleting and saving edits both ask for confirmation
- [ ] Filters (All / Active / Completed) and the category filter work
- [ ] Counters update after every change
- [ ] Refreshing the page keeps all tasks

## Deployment

The app is deployed to GitHub Pages using the `gh-pages` package.

```bash
npm run deploy
```

`vite.config.js` sets `base: '/Task-Manager/'` so the built files load correctly from the repository path.

## Author

**Your Name**
GitHub: [@ashad0806](https://github.com/ashad0806)
