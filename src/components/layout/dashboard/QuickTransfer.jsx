import { useState } from "react";
import { ChevronRight, Send } from "lucide-react";

const contacts = [
  { name: "Priya Sharma", role: "CFO", from: "from-violet-400 to-fuchsia-500" },
  { name: "Arjun Malhotra", role: "Director", from: "from-sky-400 to-blue-600" },
  { name: "Kavita Reddy", role: "Designer", from: "from-emerald-400 to-teal-600" },
];

export default function QuickTransfer() {
  const [amount, setAmount] = useState("25.50");

  return (
    <section className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
        Quick Transfer
      </h2>

      <div className="relative">
        <div className="flex items-start gap-3 overflow-x-auto pb-2">
          {contacts.map((c) => (
            <div
              key={c.name}
              className="flex min-w-[88px] flex-col items-center text-center"
            >
              <div
                className={`h-14 w-14 rounded-full bg-gradient-to-br ${c.from} shadow-md ring-4 ring-white dark:ring-slate-900`}
              />
              <p className="mt-2 max-w-[88px] truncate text-sm font-semibold text-slate-900 dark:text-white">
                {c.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{c.role}</p>
            </div>
          ))}
          <button
            type="button"
            className="flex h-14 w-14 shrink-0 items-center justify-center self-start rounded-full border border-slate-200 bg-slate-50 text-slate-400 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            aria-label="More contacts"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Write Amount
          </label>
          <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
            <span className="text-lg font-semibold text-slate-400">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="ml-1 w-full bg-transparent text-lg font-semibold text-slate-900 outline-none dark:text-white"
            />
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
        >
          Send
          <Send className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
