import { useContext, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppContext } from "../../../context/app-context";

export default function BalanceHistory() {
  const { transactions } = useContext(AppContext);

  const data = useMemo(() => {
    const byMonth = new Map();
    for (const t of transactions) {
      const ym = t.date.slice(0, 7);
      if (!byMonth.has(ym)) {
        byMonth.set(ym, { income: 0, expense: 0 });
      }
      const row = byMonth.get(ym);
      if (t.type === "income") row.income += t.amount;
      else row.expense += t.amount;
    }
    const sorted = Array.from(byMonth.entries()).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );
    return sorted.reduce(
      (acc, [ym, v]) => {
        const running = acc.running + v.income - v.expense;
        const [y, m] = ym.split("-").map(Number);
        const label = new Date(y, m - 1, 1).toLocaleDateString("en-US", {
          month: "short",
        });
        return {
          running,
          rows: [
            ...acc.rows,
            { month: label, balance: Math.max(0, running) },
          ],
        };
      },
      { running: 0, rows: [] },
    ).rows;
  }, [transactions]);

  const chartData =
    data.length >= 2
      ? data.slice(-7)
      : [
          { month: "Jul", balance: 2100 },
          { month: "Aug", balance: 2400 },
          { month: "Sep", balance: 2800 },
          { month: "Oct", balance: 3100 },
          { month: "Nov", balance: 2900 },
          { month: "Dec", balance: 3500 },
          { month: "Jan", balance: 4000 },
        ];

  return (
    <section className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
        Balance History
      </h2>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balanceHistoryFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-slate-400"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-slate-400"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
              }}
              formatter={(v) => [`$${Number(v).toLocaleString()}`, "Balance"]}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#balanceHistoryFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
