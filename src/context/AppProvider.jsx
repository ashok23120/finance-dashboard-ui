import { useCallback, useEffect, useMemo, useState } from "react";
import { AppContext } from "./app-context";
import { DEFAULT_TRANSACTIONS, STORAGE_KEY } from "../data/mockData";

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const persisted = typeof window !== "undefined" ? loadPersisted() : null;

  const [transactions, setTransactions] = useState(
    () => persisted?.transactions ?? DEFAULT_TRANSACTIONS,
  );
  const [role, setRole] = useState(() => persisted?.role ?? "viewer");
  const [darkMode, setDarkMode] = useState(() => persisted?.darkMode ?? false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [chartPeriod, setChartPeriod] = useState("monthly");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ transactions, role, darkMode }),
    );
  }, [transactions, role, darkMode]);

  const addTransaction = useCallback((payload) => {
    setTransactions((prev) => [
      {
        ...payload,
        id: crypto.randomUUID(),
      },
      ...prev,
    ]);
  }, []);

  const updateTransaction = useCallback((id, payload) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...payload } : t)),
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let list = transactions;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.category.toLowerCase().includes(q) ||
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.medium && t.medium.toLowerCase().includes(q)),
      );
    }
    if (filterCategory !== "all") {
      list = list.filter((t) => t.category === filterCategory);
    }
    if (filterType !== "all") {
      list = list.filter((t) => t.type === filterType);
    }
    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sortBy === "date") {
        const da = new Date(
          `${a.date}T${a.time || "12:00"}`,
        ).getTime();
        const db = new Date(
          `${b.date}T${b.time || "12:00"}`,
        ).getTime();
        return (da - db) * dir;
      }
      if (sortBy === "amount") {
        return (a.amount - b.amount) * dir;
      }
      if (sortBy === "category") {
        return a.category.localeCompare(b.category) * dir;
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "") * dir;
      }
      return 0;
    });
  }, [
    transactions,
    search,
    filterCategory,
    filterType,
    sortBy,
    sortDir,
  ]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const toggleSort = useCallback((field) => {
    setSortBy((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir(field === "category" || field === "title" ? "asc" : "desc");
      return field;
    });
  }, []);

  const value = useMemo(
    () => ({
      transactions,
      setTransactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      role,
      setRole,
      darkMode,
      setDarkMode,
      search,
      setSearch,
      filterCategory,
      setFilterCategory,
      filterType,
      setFilterType,
      sortBy,
      setSortBy,
      sortDir,
      setSortDir,
      toggleSort,
      chartPeriod,
      setChartPeriod,
      categories,
      filteredTransactions,
      totals,
    }),
    [
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      role,
      darkMode,
      search,
      filterCategory,
      filterType,
      sortBy,
      sortDir,
      toggleSort,
      chartPeriod,
      categories,
      filteredTransactions,
      totals,
    ],
  );

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}
