import { useContext, useMemo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { AppContext } from "../../../context/app-context";

function monthKey(isoDate) {
  return isoDate.slice(0, 7);
}

function totalsForMonth(transactions, ym) {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (monthKey(t.date) !== ym) continue;
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense };
}

function Card({ title, value, accent, sub, trendUp, pill }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:shadow-none`}
    >
      <div className={`absolute left-0 right-0 top-0 h-1 ${accent}`} />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            trendUp
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
          }`}
        >
          {trendUp ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {pill}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{sub}</span>
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { transactions, totals } = useContext(AppContext);

  const { prevYm, cmp } = useMemo(() => {
    const dates = transactions.map((t) => t.date).sort();
    const last = dates[dates.length - 1] || "2026-04-01";
    const [y, m] = last.split("-").map(Number);
    const cur = `${y}-${String(m).padStart(2, "0")}`;
    const pm = m === 1 ? 12 : m - 1;
    const py = m === 1 ? y - 1 : y;
    const prev = `${py}-${String(pm).padStart(2, "0")}`;

    const c = totalsForMonth(transactions, cur);
    const p = totalsForMonth(transactions, prev);

    const pct = (now, was) => {
      if (was === 0) return now > 0 ? 100 : 0;
      return Math.round(((now - was) / was) * 100);
    };

    return {
      prevYm: prev,
      cmp: {
        income: pct(c.income, p.income),
        expense: pct(c.expense, p.expense),
        balance: pct(c.balance, p.balance),
      },
    };
  }, [transactions]);

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const hasPrev = transactions.some((t) => monthKey(t.date) === prevYm);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        title="Total balance"
        value={fmt(totals.balance)}
        accent="bg-violet-500"
        trendUp={cmp.balance >= 0}
        pill={
          hasPrev
            ? `${cmp.balance >= 0 ? "+" : ""}${cmp.balance}%`
            : "— 0%"
        }
        sub={
          hasPrev
            ? "vs previous month"
            : "Not enough history for comparison"
        }
      />
      <Card
        title="Total income"
        value={fmt(totals.income)}
        accent="bg-emerald-500"
        trendUp={cmp.income >= 0}
        pill={
          hasPrev
            ? `${cmp.income >= 0 ? "+" : ""}${cmp.income}%`
            : "— 0%"
        }
        sub="Increased from last month"
      />
      <Card
        title="Total expenses"
        value={fmt(totals.expense)}
        accent="bg-orange-500"
        trendUp={cmp.expense <= 0}
        pill={
          hasPrev
            ? `${cmp.expense >= 0 ? "+" : ""}${cmp.expense}%`
            : "— 0%"
        }
        sub="Versus prior month"
      />
      <Card
        title="Savings rate"
        value={
          totals.income > 0
            ? `${(((totals.income - totals.expense) / totals.income) * 100).toFixed(1)}%`
            : "—"
        }
        accent="bg-sky-500"
        trendUp={
          totals.income > 0
            ? (totals.income - totals.expense) / totals.income > 0.15
            : true
        }
        pill={
          totals.income > 0
            ? (totals.income - totals.expense) / totals.income > 0.2
              ? "Healthy"
              : "Watch"
            : "N/A"
        }
        sub="Of income retained"
      />
    </div>
  );
}
