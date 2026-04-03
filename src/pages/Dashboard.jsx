import BalanceChart from "../components/layout/dashboard/BalanceChart";
import BankMyCards from "../components/layout/dashboard/BankMyCards";
import BalanceHistory from "../components/layout/dashboard/BalanceHistory";
import ExpenseStatistics from "../components/layout/dashboard/ExpenseStatistics";
import QuickTransfer from "../components/layout/dashboard/QuickTransfer";
import RecentTransactions from "../components/layout/dashboard/RecentTransactions";
import SummaryCards from "../components/layout/dashboard/SummaryCards";
import WeeklyActivity from "../components/layout/dashboard/WeeklyActivity";
import Insights from "../components/layout/insights/Insights";
import TransactionList from "../components/layout/transactions/TransactionList";

export default function Dashboard() {
  return (
    <main className="dashboard-main flex-1 overflow-y-auto bg-transparent">
      <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 md:px-8 md:py-8">
        {/* Core requirement: financial summary */}
        <section aria-label="Financial summary" className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Overview
          </h2>
          <SummaryCards />
        </section>

        {/* Core requirement: time-based visualization (income vs expense lines) */}
        <section
          aria-label="Cash flow trend"
          className="overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <BalanceChart />
        </section>

        {/* Row 1: My Cards + Recent transactions */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <BankMyCards />
          <RecentTransactions />
        </div>

        {/* Row 2: Weekly activity + categorical spending (donut) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WeeklyActivity />
          </div>
          <div>
            <ExpenseStatistics />
          </div>
        </div>

        {/* Row 3: Quick transfer + Balance history */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <QuickTransfer />
          <BalanceHistory />
        </div>

        {/* Transactions (filters, sort, search, RBAC) + Insights */}
        <section aria-label="All transactions" className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Details &amp; insights
          </h2>
          <TransactionList />
          <Insights />
        </section>
      </div>
    </main>
  );
}
