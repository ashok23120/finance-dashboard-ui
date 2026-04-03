import ApiStatusNote from "./components/layout/ApiStatusNote";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import ThemeBackground from "./components/layout/ThemeBackground";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100">
      <ThemeBackground />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Header />
          <ApiStatusNote />
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
