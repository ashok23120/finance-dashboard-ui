import { useContext, useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AppContext } from "../../../context/app-context";

export default function ExpenseStatistics() {
  const { transactions } = useContext(AppContext);

  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const total = expenses.reduce((s, t) => s + t.amount, 0);
    if (total === 0) {
      return [
        { name: "Entertainment", value: 30, color: "#3b82f6" },
        { name: "Bill Expense", value: 15, color: "#f97316" },
        { name: "Investment", value: 20, color: "#ec4899" },
        { name: "Others", value: 35, color: "#1e3a8a" },
      ];
    }

    const byCat = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const entries = Object.entries(byCat)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const colors = ["#3b82f6", "#f97316", "#ec4899", "#1e3a8a", "#6366f1", "#14b8a6"];
    return entries.slice(0, 5).map((e, i) => ({
      name: e.name,
      value: Math.round((e.value / total) * 100),
      color: colors[i % colors.length],
    }));
  }, [transactions]);

  return (
    <section className="flex h-full flex-col rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
        Expense Statistics
      </h2>
      <div className="relative mx-auto aspect-square w-full max-w-[260px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="88%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, n) => [`${v}%`, n]}
              contentStyle={{ borderRadius: "12px", border: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 space-y-2">
        {data.map((d) => (
          <li
            key={d.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              {d.name}
            </span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
              {d.value}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
