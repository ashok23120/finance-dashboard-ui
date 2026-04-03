import { useContext, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Download, Pencil, Trash2 } from "lucide-react";
import { AppContext } from "../../../context/app-context";
import TransactionModal from "./TransactionModal";

function mediumStyles(m) {
  const map = {
    Visa: "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
    PayPal: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    Payoneer: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200",
    Bank: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
    Cash: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  };
  return map[m] || map.Cash;
}

function exportJson(rows) {
  const blob = new Blob([JSON.stringify(rows, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "transactions.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportCsv(rows) {
  const headers = [
    "title",
    "date",
    "time",
    "amount",
    "category",
    "type",
    "medium",
  ];
  const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.title,
        r.date,
        r.time || "",
        r.amount,
        r.category,
        r.type,
        r.medium,
      ]
        .map(esc)
        .join(","),
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function TransactionList() {
  const {
    filteredTransactions,
    role,
    categories,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    toggleSort,
    sortBy,
    sortDir,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useContext(AppContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draftKey, setDraftKey] = useState(0);

  const sortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortDir === "asc" ? (
      <ArrowUp className="inline h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="inline h-3.5 w-3.5" />
    );
  };

  const empty = filteredTransactions.length === 0;

  const canMutate = role === "admin";

  const exportRows = useMemo(
    () =>
      filteredTransactions.map(
        ({ id, title, date, time, amount, category, type, medium }) => ({
          id,
          title,
          date,
          time,
          amount,
          category,
          type,
          medium,
        }),
      ),
    [filteredTransactions],
  );

  return (
    <>
      <div className="overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Latest transactions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Use the header search (⌘K) · filter and sort below
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {canMutate && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setDraftKey((k) => k + 1);
                  setModalOpen(true);
                }}
                className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
              >
                + New
              </button>
            )}
            <div className="flex rounded-xl border border-slate-200 dark:border-slate-600">
              <button
                type="button"
                title="Export CSV"
                onClick={() => exportCsv(exportRows)}
                className="flex items-center gap-1 px-2.5 py-2 text-xs text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Download className="h-4 w-4" />
                CSV
              </button>
              <button
                type="button"
                title="Export JSON"
                onClick={() => exportJson(exportRows)}
                className="border-l border-slate-200 px-2.5 py-2 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                JSON
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("title")}
                    className="inline-flex items-center gap-1 hover:text-violet-600"
                  >
                    Title {sortIcon("title")}
                  </button>
                </th>
                <th className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSort("date")}
                    className="inline-flex items-center gap-1 hover:text-violet-600"
                  >
                    Date / time {sortIcon("date")}
                  </button>
                </th>
                <th className="px-5 py-3">Medium</th>
                <th className="px-5 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort("amount")}
                    className="inline-flex items-center gap-1 hover:text-violet-600"
                  >
                    Amount {sortIcon("amount")}
                  </button>
                </th>
                {canMutate && <th className="w-24 px-5 py-3 text-right"> </th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {empty ? (
                <tr>
                  <td
                    colSpan={canMutate ? 5 : 4}
                    className="px-5 py-16 text-center text-slate-500 dark:text-slate-400"
                  >
                    <p className="font-medium">No transactions match your filters.</p>
                    <p className="mt-1 text-xs">
                      Clear search or add a transaction (admin) to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            t.type === "income"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                          }`}
                        >
                          {t.title?.slice(0, 2).toUpperCase() || "—"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">
                            {t.title || t.category}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t.category} ·{" "}
                            <span
                              className={
                                t.type === "income"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }
                            >
                              {t.type}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {new Date(`${t.date}T${t.time || "12:00"}`).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        },
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${mediumStyles(t.medium)}`}
                      >
                        {t.medium}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-4 text-right text-base font-bold tabular-nums ${
                        t.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}$
                      {t.amount.toLocaleString()}
                    </td>
                    {canMutate && (
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(t);
                            setModalOpen(true);
                          }}
                          className="mr-1 inline-flex rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-violet-600 dark:hover:bg-slate-800"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              confirm(
                                "Delete this transaction?",
                              )
                            )
                              deleteTransaction(t.id);
                          }}
                          className="inline-flex rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <TransactionModal
          key={editing ? editing.id : `new-${draftKey}`}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          initial={editing}
          onSave={(payload) => {
            if (editing) updateTransaction(editing.id, payload);
            else addTransaction(payload);
          }}
        />
      )}
    </>
  );
}
