# Finance Dashboard UI

Frontend-only **finance dashboard** built for the assignment brief: React + Vite + **Tailwind CSS** + Recharts, with **mock data**, **React Context** state, and **localStorage** persistence. No backend required.

## Quick start

```bash
npm install
npm run dev
```

- Dev server: `http://localhost:5173` (check terminal output)
- Production: `npm run build` then `npm run preview`

---

## How this project meets the assignment

### Scenario

Users can **view overall financial summary**, **explore transactions**, and **see spending patterns** through summary cards, charts, filters, and insights.

### Core requirements

| Requirement | Where it lives |
|-------------|----------------|
| **1. Dashboard overview** — summary cards (balance, income, expenses, savings rate) | `SummaryCards.jsx` at top of `Dashboard.jsx` |
| **1. Time-based visualization** — balance / cash flow trend | `BalanceChart.jsx` (income vs expense lines, daily / weekly / monthly). Also: `BalanceHistory.jsx` (area), `WeeklyActivity.jsx` (bars by weekday) |
| **1. Categorical visualization** — spending breakdown | `ExpenseStatistics.jsx` (donut + % by category) |
| **2. Transactions** — date, amount, category, type | `TransactionList.jsx` (table includes title, date/time, medium, amount, type) |
| **2. Filtering, sorting, search** | Header search (⌘K / Ctrl+K), category + type filters, sortable columns |
| **3. Role-based UI (viewer vs admin)** | Sidebar footer toggle. **Viewer**: read-only. **Admin**: add / edit / delete transactions, add card CTA |
| **4. Insights** — top category, month comparison, observation | `Insights.jsx` |
| **5. State management** — transactions, filters, role | `AppProvider.jsx` + `app-context.js` (Context + `useMemo` for derived data) |
| **6. UI/UX** — responsive, empty states | Responsive grids; empty messages in charts and transaction table |

### Optional enhancements (included)

| Enhancement | Implementation |
|-------------|----------------|
| Dark mode | Toggle in sidebar; `dark` class on `<html>`; persisted |
| Data persistence | `localStorage` key `finance-dashboard-state-v1` |
| Mock API | `src/api/mockApi.js` — async `fetchMock*` with simulated delay; `ApiStatusNote.jsx` calls meta endpoint once on load |
| Export | CSV + JSON of filtered transactions in table toolbar |
| Motion | Subtle entry animation on main dashboard (`index.css`, respects `prefers-reduced-motion`) |

---

## Tech stack

- React 19, Vite 8
- Tailwind CSS 4
- Recharts 3
- Lucide React

## Project structure (high level)

| Path | Role |
|------|------|
| `src/context/app-context.js` | Context object |
| `src/context/AppProvider.jsx` | State: transactions, search, filters, sort, chart period, role, dark mode, persistence |
| `src/data/mockData.js` | Seed transactions |
| `src/api/mockApi.js` | Optional mock HTTP-style API |
| `src/pages/Dashboard.jsx` | Composes overview, charts, BankDash-style widgets, table, insights |
| `src/components/layout/Sidebar.jsx` | Nav + role + theme |
| `src/components/layout/Header.jsx` | Overview title + search |
| `src/components/layout/dashboard/*` | Summary cards, charts, cards, transfers |
| `src/components/layout/transactions/*` | Table, modal |
| `src/components/layout/insights/Insights.jsx` | Insights |

## Data & reset

- Initial data: `DEFAULT_TRANSACTIONS` in `mockData.js`.
- After edits, state is saved to **localStorage** (transactions, role, dark mode).
- To reset: Application → Local Storage → remove `finance-dashboard-state-v1`, or clear site data.

## Evaluation criteria (mapping)

1. **Design** — BankDash-inspired layout, clear hierarchy, consistent cards (`rounded-[20px]`, soft shadows).
2. **Responsiveness** — Grids collapse to single column on small screens.
3. **Functionality** — Charts, filters, RBAC, export, modal CRUD for admin.
4. **UX** — Search, keyboard shortcuts, dismissible mock API note, empty states.
5. **Technical quality** — Modular components, Context for shared state, no prop drilling for global data.
6. **State management** — Single provider; derived lists in `useMemo`.
7. **Documentation** — This file + inline section labels in `Dashboard.jsx`.
8. **Detail** — Edge cases: no transactions, no expenses for pie, filter mismatch empty table.

---

For submission, link this repository and (if deployed) your deployment URL. This README is intended to satisfy the **documentation** and **feature explanation** parts of the rubric.
