import { useEffect, useState } from "react";
import { fetchMockDashboardMeta } from "../../api/mockApi";

/**
 * Tiny demo that proves mock API integration (optional enhancement).
 * Dismissible; does not affect persisted transaction state.
 */
export default function ApiStatusNote() {
  const [msg, setMsg] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMockDashboardMeta().then((res) => {
      if (!cancelled && res.ok) {
        setMsg(res.message);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (dismissed || !msg) return null;

  return (
    <div className="mx-auto mb-4 flex max-w-[1600px] items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/90 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-100 md:px-8">
      <p>
        <span className="font-semibold">Mock API:</span> {msg}
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900/50"
      >
        Dismiss
      </button>
    </div>
  );
}
