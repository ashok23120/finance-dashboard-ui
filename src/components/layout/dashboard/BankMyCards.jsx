import { CreditCard, Plus } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../../context/app-context";

export default function BankMyCards() {
  const { role } = useContext(AppContext);

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <section className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          My Cards
        </h2>
        <button
          type="button"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          See All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Primary — BankDash gradient */}
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2b4acb] via-[#3967e6] to-[#5b4fc9] p-6 text-white shadow-lg shadow-blue-900/20">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/80">Balance</p>
              <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight">
                {fmt(5756)}
              </p>
            </div>
            <div className="rounded-lg bg-white/15 p-2 backdrop-blur-sm">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/70">
                Card holder
              </p>
              <p className="text-sm font-semibold">Ashok Sihag</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-white/70">
                Valid Thru
              </p>
              <p className="text-sm font-semibold">12/22</p>
            </div>
          </div>
          <p className="mt-6 font-mono text-lg tracking-[0.2em]">
            3778 **** **** 1234
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-9 w-11 rounded bg-gradient-to-br from-amber-200/90 to-amber-400/80" />
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full bg-red-500/90 opacity-90" />
              <div className="h-8 w-8 rounded-full bg-amber-400/90 opacity-90 mix-blend-lighten" />
            </div>
          </div>
        </div>

        {/* Secondary — white */}
        <div className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white p-6 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Balance</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                {fmt(2375)}
              </p>
            </div>
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
              <CreditCard className="h-6 w-6 text-slate-600 dark:text-slate-300" />
            </div>
          </div>
          <div className="mt-8 flex items-end justify-between text-slate-600 dark:text-slate-300">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Card holder
              </p>
              <p className="text-sm font-semibold">Ashok Sihag</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Valid Thru
              </p>
              <p className="text-sm font-semibold">07/24</p>
            </div>
          </div>
          <p className="mt-6 font-mono text-lg tracking-[0.2em] text-slate-700 dark:text-slate-200">
            5234 **** **** 8901
          </p>
          <div className="mt-4 flex justify-end">
            <span className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-bold uppercase text-slate-500 dark:border-slate-600">
              Visa
            </span>
          </div>
        </div>
      </div>

      {role === "admin" && (
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 dark:border-slate-700 dark:hover:border-blue-600 dark:hover:bg-blue-950/30"
        >
          <Plus className="h-4 w-4" />
          Add new card
        </button>
      )}
    </section>
  );
}
