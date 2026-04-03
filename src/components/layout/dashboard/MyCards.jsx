import { CreditCard, Plus } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../../context/app-context";

export default function MyCards() {
  const { role } = useContext(AppContext);

  const cards = [
    {
      id: "1",
      brand: "Visa",
      last4: "4242",
      holder: "Ashok Sihag",
      expiry: "09/28",
      gradient: "from-violet-600 to-indigo-800",
    },
    {
      id: "2",
      brand: "PayPal",
      last4: "8891",
      holder: "Ashok Sihag",
      expiry: "03/27",
      gradient: "from-emerald-600 to-teal-800",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          My cards
        </h3>
        {role === "admin" && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add card
          </button>
        )}
      </div>

      <div className="space-y-4">
        {cards.map((c, i) => (
          <div
            key={c.id}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg ${c.gradient} ${i > 0 ? "opacity-95" : ""}`}
            style={{ transform: i > 0 ? "scale(0.98) translateY(-4px)" : undefined }}
          >
            <div className="flex items-start justify-between">
              <CreditCard className="h-8 w-8 opacity-90" />
              <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {c.brand}
              </span>
            </div>
            <p className="mt-8 font-mono text-lg tracking-widest">
              •••• •••• •••• {c.last4}
            </p>
            <div className="mt-4 flex items-end justify-between text-xs opacity-90">
              <div>
                <p className="text-[10px] uppercase opacity-80">Card holder</p>
                <p className="font-medium">{c.holder}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase opacity-80">Expires</p>
                <p className="font-medium">{c.expiry}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {role === "viewer" && (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Switch to <span className="font-semibold text-violet-600 dark:text-violet-400">Admin</span>{" "}
          to add a new card (demo).
        </p>
      )}
    </div>
  );
}
