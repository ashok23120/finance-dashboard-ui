import { useContext, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppContext } from "../../../context/app-context";

const DAY_ORDER = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function dayLabel(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return names[d.getDay()];
}

export default function WeeklyActivity() {
  const { transactions } = useContext(AppContext);

  const data = useMemo(() => {
    const map = Object.fromEntries(
      DAY_ORDER.map((d) => [d, { day: d, deposit: 0, withdraw: 0 }]),
    );
    for (const t of transactions) {
      const label = dayLabel(t.date);
      if (!map[label]) continue;
      if (t.type === "income") map[label].deposit += t.amount;
      else map[label].withdraw += t.amount;
    }
    return DAY_ORDER.map((d) => map[d]);
  }, [transactions]);

  return (
    <section className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
        Weekly Activity
      </h2>
      <div className="mb-4 flex flex-wrap items-center gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-teal-500" />
          <span className="text-slate-600 dark:text-slate-300">Deposit</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-slate-600 dark:text-slate-300">Withdraw</span>
        </span>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={6}
            margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
            />
            <XAxis
              dataKey="day"
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
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
              }}
              formatter={(v) => [`$${Number(v).toLocaleString()}`, ""]}
            />
            <Bar
              dataKey="deposit"
              name="Deposit"
              fill="#14b8a6"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="withdraw"
              name="Withdraw"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
