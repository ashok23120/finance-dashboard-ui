import { useContext, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppContext } from "../../../context/app-context";

function startOfWeek(d) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = x.getDate() - day + (day === 0 ? -6 : 1);
  const n = new Date(x.setDate(diff));
  return n.toISOString().slice(0, 10);
}

function buildSeries(transactions, period) {
  const map = new Map();

  for (const t of transactions) {
    const d = new Date(`${t.date}T12:00:00`);
    let key;
    let label;

    if (period === "daily") {
      key = t.date;
      label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (period === "weekly") {
      key = startOfWeek(d);
      const end = new Date(key);
      end.setDate(end.getDate() + 6);
      label = `${new Date(key).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    } else {
      key = t.date.slice(0, 7);
      label = d.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    }

    if (!map.has(key)) {
      map.set(key, { key, label, income: 0, expense: 0 });
    }
    const row = map.get(key);
    if (t.type === "income") row.income += t.amount;
    else row.expense += t.amount;
  }

  return Array.from(map.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(({ label, income, expense }) => ({ label, income, expense }));
}

export default function BalanceChart() {
  const { transactions, chartPeriod, setChartPeriod } = useContext(AppContext);

  const data = useMemo(
    () => buildSeries(transactions, chartPeriod),
    [transactions, chartPeriod],
  );

  const empty = data.length === 0;

  return (
    <div className="flex h-full min-h-[300px] flex-col p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Cash flow trend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Income vs expense — switch daily, weekly, or monthly
          </p>
        </div>
        <select
          value={chartPeriod}
          onChange={(e) => setChartPeriod(e.target.value)}
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 outline-none ring-blue-500/20 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {empty ? (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-400">
          Add transactions to see your cash flow trend.
        </div>
      ) : (
        <div className="h-[280px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-slate-400"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-slate-400"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
                formatter={(value, name) => [
                  `$${Number(value).toLocaleString()}`,
                  name === "income" ? "Income" : "Expense",
                ]}
              />
              <Line
                type="monotone"
                dataKey="income"
                name="income"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="expense"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
