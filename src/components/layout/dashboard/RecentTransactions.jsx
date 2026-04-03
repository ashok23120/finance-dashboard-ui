import { useContext, useMemo } from "react";
import { AppContext } from "../../../context/app-context";

function iconFor(t, i) {
  const hues = [
    "bg-amber-100 text-amber-700",
    "bg-sky-100 text-sky-700",
    "bg-teal-100 text-teal-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
    "bg-indigo-100 text-indigo-700",
  ];
  return hues[i % hues.length];
}

export default function RecentTransactions() {
  const { transactions } = useContext(AppContext);

  const recent = useMemo(() => {
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.time || "12:00"}`).getTime() -
          new Date(`${a.date}T${a.time || "12:00"}`).getTime(),
      )
      .slice(0, 6);
  }, [transactions]);

  return (
    <section className="flex h-full flex-col rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
        Recent Transaction
      </h2>

      <ul className="flex flex-1 flex-col gap-0 divide-y divide-slate-100 dark:divide-slate-800">
        {recent.length === 0 ? (
          <li className="py-8 text-center text-sm text-slate-500">
            No transactions yet.
          </li>
        ) : (
          recent.map((t, i) => {
            const label = t.title || t.category;
            const dateStr = new Date(
              `${t.date}T${t.time || "12:00"}`,
            ).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            const isIn = t.type === "income";
            return (
              <li
                key={t.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs font-bold ${iconFor(t, i)}`}
                >
                  {label.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900 dark:text-white">
                    {label}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {dateStr}
                  </p>
                </div>
                <p
                  className={`shrink-0 text-base font-semibold tabular-nums ${
                    isIn ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {isIn ? "+" : "−"}$
                  {t.amount.toLocaleString()}
                </p>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
