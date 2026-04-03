import { useContext, useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AppContext } from "../../../context/app-context";

const COLORS = ["#8b5cf6", "#10b981", "#fbbf24", "#f97316", "#38bdf8", "#ec4899"];

export default function CategoryChart() {
  const { transactions } = useContext(AppContext);

  const { segments, totalExpense, growthHint } = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const byCat = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const entries = Object.entries(byCat)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const total = entries.reduce((s, x) => s + x.value, 0);

    const top = entries.slice(0, 5);
    const rest = entries.slice(5).reduce((s, x) => s + x.value, 0);
    const segments =
      rest > 0 ? [...top, { name: "Other", value: rest }] : top;

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const growthHint =
      income > 0 && total > 0
        ? Math.min(
            99,
            Math.round(((income - total) / Math.max(income, 1)) * 40),
          )
        : 12;

    return {
      segments,
      totalExpense: total,
      growthHint,
    };
  }, [transactions]);

  const empty = segments.length === 0 || totalExpense === 0;

  return (
    <div className="flex h-full min-h-[320px] flex-col p-5 md:p-6">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Transaction view
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Spending mix by category
        </p>
      </div>

      {empty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-400">
          <p>No expense data yet.</p>
          <p className="text-xs">Record expenses to see your breakdown.</p>
        </div>
      ) : (
        <>
          <div className="relative mx-auto h-[200px] w-full max-w-sm">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="58%"
                  outerRadius="100%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {segments.map((_, i) => (
                    <Cell
                      key={segments[i].name}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `$${Number(v).toLocaleString()}`}
                  contentStyle={{ borderRadius: "12px", border: "none" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-1 text-center">
              <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                ${totalExpense.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                +{growthHint}% vs income headroom
              </p>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {segments.map((s, i) => (
              <li
                key={s.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {s.name}
                </span>
                <span className="font-medium tabular-nums text-slate-800 dark:text-slate-100">
                  {Math.round((s.value / totalExpense) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
