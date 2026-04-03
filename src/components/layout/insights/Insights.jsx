import { useContext, useMemo } from "react";
import { ArrowRight, Lightbulb, TrendingUp } from "lucide-react";
import { AppContext } from "../../../context/app-context";

function monthKey(isoDate) {
  return isoDate.slice(0, 7);
}

export default function Insights() {
  const { transactions } = useContext(AppContext);

  const insight = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const byCat = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const topCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

    const dates = transactions.map((t) => t.date).sort();
    const last = dates[dates.length - 1] || "2026-04-01";
    const [y, m] = last.split("-").map(Number);
    const curYm = `${y}-${String(m).padStart(2, "0")}`;
    const pm = m === 1 ? 12 : m - 1;
    const py = m === 1 ? y - 1 : y;
    const prevYm = `${py}-${String(pm).padStart(2, "0")}`;

    let curExp = 0;
    let prevExp = 0;
    let curInc = 0;
    let prevInc = 0;
    for (const t of transactions) {
      const mk = monthKey(t.date);
      if (mk === curYm) {
        if (t.type === "expense") curExp += t.amount;
        else curInc += t.amount;
      } else if (mk === prevYm) {
        if (t.type === "expense") prevExp += t.amount;
        else prevInc += t.amount;
      }
    }

    const expChange =
      prevExp === 0 ? (curExp > 0 ? 100 : 0) : Math.round(((curExp - prevExp) / prevExp) * 100);
    const incChange =
      prevInc === 0 ? (curInc > 0 ? 100 : 0) : Math.round(((curInc - prevInc) / prevInc) * 100);

    return {
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      monthly: {
        curYm,
        prevYm,
        curExp,
        prevExp,
        expChange,
        incChange,
        hasPrev: transactions.some((t) => monthKey(t.date) === prevYm),
      },
    };
  }, [transactions]);

  return (
    <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
          <Lightbulb className="h-4 w-4" />
        </span>
        Insights
      </h3>

      <div className="space-y-5">
        {insight.topCategory ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Highest spending category
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <span className="text-violet-600 dark:text-violet-400">
                {insight.topCategory.name}
              </span>{" "}
              — ${insight.topCategory.amount.toLocaleString()} total outflows
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Add expenses to see category insights.</p>
        )}

        <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 dark:border-violet-900/40 dark:bg-violet-950/20">
          <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
            <TrendingUp className="h-4 w-4" />
            <p className="text-[10px] font-bold uppercase tracking-wider">
              Monthly comparison
            </p>
          </div>
          {insight.monthly.hasPrev ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex justify-between gap-2">
                <span>Spending vs prior month</span>
                <span
                  className={
                    insight.monthly.expChange <= 0
                      ? "font-semibold text-emerald-600 dark:text-emerald-400"
                      : "font-semibold text-amber-600 dark:text-amber-400"
                  }
                >
                  {insight.monthly.expChange >= 0 ? "+" : ""}
                  {insight.monthly.expChange}%
                </span>
              </li>
              <li className="flex justify-between gap-2">
                <span>Income vs prior month</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {insight.monthly.incChange >= 0 ? "+" : ""}
                  {insight.monthly.incChange}%
                </span>
              </li>
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Keep logging activity across months to unlock comparisons.
            </p>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-slate-900 p-4 text-slate-100 dark:bg-slate-800">
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
          <p className="text-sm leading-relaxed text-slate-300">
            {insight.monthly.curExp > insight.monthly.curInc * 0.6
              ? "Your fixed costs are a large share of spending — review subscriptions and bills for quick wins."
              : "Your spending mix looks balanced relative to income. Consider routing surplus into savings goals."}
          </p>
        </div>
      </div>
    </div>
  );
}
