import { useContext, useEffect, useRef } from "react";
import { Bell, Command, Moon, Search, Settings, Sun, User } from "lucide-react";
import { AppContext } from "../../context/app-context";

export default function Header() {
  const { search, setSearch, darkMode, setDarkMode } = useContext(AppContext);
  const searchRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 px-4 py-5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85 md:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
          Overview
        </h1>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3 lg:max-w-2xl">
          <div className="relative min-w-[200px] flex-1 lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for something"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-14 text-sm text-slate-800 placeholder:text-slate-400 outline-none ring-blue-500/20 transition focus:border-blue-200 focus:bg-white focus:ring-2 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 text-[11px] font-medium text-slate-400 sm:inline-flex">
              <Command className="h-3.5 w-3.5" />K
            </span>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-amber-500 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700"
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            title={darkMode ? "Light theme" : "Dark theme"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          </button>
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-300 text-white shadow-md ring-2 ring-white dark:from-amber-700 dark:to-orange-800 dark:ring-slate-900"
            title="Profile"
          >
            <User className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
