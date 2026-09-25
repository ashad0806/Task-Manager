# Wallex

A personal expense-tracking web app for logging income and expenses, viewing a running balance, and understanding spending habits at a glance. Built with React and Vite. Transactions, budget, and theme are saved in the browser, so they're still there after a page refresh.

Repository: https://github.com/ashad0806/Expence_Tracker

## Features

### Core features
- Add transactions with a description, amount, type (income/expense), and category.
- Delete individual transactions.
- Running balance (income − expenses), with income and expense totals shown separately.
- Filter transactions by category, and sort by date or amount (ascending/descending).
- Persistence: all transactions are stored in `localStorage` and survive a page refresh.

### Extras
- Confirmation modal before deleting a transaction, to prevent accidents.
- "View All / Show Less" toggle — only the 5 most relevant transactions show by default.
- Light/dark theme toggle, with the chosen theme remembered across visits.
- Input validation: transactions with an empty description or amount are rejected.
- Two-column responsive layout that reflows to a single column on mobile.

### Stretch goals
- [x] Spending-by-category chart
- [x] Monthly summary view (income, expense, and net grouped by month)
- [x] Budget limit with a donut-chart progress indicator and an overspend warning

## Tech Stack

| Tool | Purpose |
|---|---|
| React | UI components and state |
| Vite | Dev server and build tool |
| Plain CSS (CSS Grid, custom properties) | Styling and light/dark theming |
| Inline SVG | Budget donut chart |
| localStorage | Saving transactions, budget, and theme in the browser |

## Getting Started

You need Node.js (version 18 or newer).
1. Clone the repository

git clone https://github.com/ashad0806/Expence_Tracker.git

2. Go into the project folder

cd Expence_Tracker

3. Install dependencies

npm install

4. Start the development server

npm run dev


Then open the address shown in the terminal (usually `http://localhost:5173`).

### Other commands

npm run build # create a production build in /dist
npm run preview # preview the production build locally


## Project Structure

src/
├── Components/
│ ├── Navbar.jsx # Top navigation and theme toggle
│ ├── Balance.jsx # Running balance summary card
│ ├── TransactionForm.jsx # Form for adding a transaction
│ ├── TransactionList.jsx # List of transactions, empty state, view-more toggle
│ ├── TransactionItem.jsx # Single transaction row
│ ├── ConfirmModal.jsx # Reusable confirmation popup
│ ├── FilterBar.jsx # Category filter and sort controls
│ ├── BudgetTracker.jsx # Monthly budget donut chart and warning
│ ├── CategoryChart.jsx # Spending-by-category bar chart
│ └── MonthlySummary.jsx # Monthly income/expense/net summary
├── App.jsx # Main state and transaction logic
├── App.css # All application styling, including theme variables
└── main.jsx # App entry point


## How It Works

- State lives in `App.jsx`. It holds the transaction list, active view, filters, and theme, and passes the relevant data and handler functions down to child components as props.
- Transactions and the theme choice are persisted with `useEffect`, which writes to `localStorage` whenever they change; both are read back on load using a `useState` initializer function.
- Each transaction is stored as an object:

```js
  {
    id: 1790000000000,
    description: "Groceries",
    amount: -50,
    category: "Personal",
    date: "2026-09-05"
  }
```

  Income is stored as a positive `amount`, expenses as negative — this single sign convention is what lets the balance, chart, and budget components all do simple arithmetic.
- Filtering and sorting are derived, not stored. The visible transaction list is recalculated from the full list and the current filter/sort settings on every render, so the balance and charts always stay accurate regardless of what's currently filtered.

## Testing Checklist

- [x] Add a transaction with a category and amount
- [x] Empty description or amount is rejected
- [x] Delete a transaction (confirmation modal appears and works)
- [x] Filter by category and by "All"
- [x] Sort by date and by amount, both directions
- [x] Balance, category chart, and monthly summary all update correctly
- [x] Set a budget and confirm the donut chart and overspend warning work
- [x] Toggle dark/light theme and refresh — theme choice is remembered
- [x] Refreshing the page keeps all transactions

## Deployment (optional)

To deploy to GitHub Pages using the `gh-pages` package:

npm install gh-pages --save-dev
npm run deploy


Set `base: '/Expence_Tracker/'` in `vite.config.js` first, so the built files load correctly from the repository path.

## Author

Ashad Alam
💻 **GitHub:** [github.com/ashad0806](https://github.com/ashad0806)
🌐 **Live Website:** [Expense Tracker](https://expence-tracker-bay-pi.vercel.app/)
