import {
  Briefcase,
  CreditCard,
  Crown,
  Landmark,
  LayoutDashboard,
  LogOut,
  Receipt,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../context/app-context";

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Receipt, label: "Transactions", active: false },
  { icon: Wallet, label: "Accounts", active: false },
  { icon: TrendingUp, label: "Investments", active: false },
  { icon: CreditCard, label: "Credit Cards", active: false },
  { icon: Landmark, label: "Loans", active: false },
  { icon: Briefcase, label: "Services", active: false },
  { icon: Crown, label: "My Privileges", active: false },
  { icon: Settings, label: "Setting", active: false },
];

export default function Sidebar() {
  const { role, setRole, darkMode, setDarkMode } = useContext(AppContext);

  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col border-r border-slate-200/90 bg-white/92 backdrop-blur-md dark:border-slate-800/90 dark:bg-slate-900/92">
      <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-8 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/25">
          <CreditCard className="h-5 w-5" strokeWidth={2} />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          BankDash<span className="text-blue-600">.</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {nav.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`relative flex w-full items-center gap-3 rounded-xl py-3 pl-4 pr-3 text-left text-[15px] font-medium transition-colors ${
              item.active
                ? "bg-blue-50/80 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-white"
            }`}
          >
            {item.active && (
              <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
            )}
            <item.icon
              className={`h-5 w-5 shrink-0 ${item.active ? "text-blue-600 dark:text-blue-400" : ""}`}
              strokeWidth={item.active ? 2.5 : 2}
            />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Demo role
        </p>
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setRole("viewer")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              role === "viewer"
                ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Viewer
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              role === "admin"
                ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Admin
          </button>
        </div>
        <button
          type="button"
          onClick={() => setDarkMode((d) => !d)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={darkMode ? "Use light theme background" : "Use dark theme background"}
        >
          {darkMode ? "Light theme" : "Dark theme"}
        </button>
        <button
          type="button"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
