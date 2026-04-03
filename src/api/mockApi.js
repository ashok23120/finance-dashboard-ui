/**
 * Optional mock API layer — simulates network latency for demos / interviews.
 * Data still comes from the same shape as mockData; the app uses Context + localStorage as source of truth.
 */
import { DEFAULT_TRANSACTIONS } from "../data/mockData";

export const MOCK_API_DELAY_MS = 400;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Simulates GET /transactions */
export async function fetchMockTransactions() {
  await delay(MOCK_API_DELAY_MS);
  return {
    ok: true,
    data: structuredClone(DEFAULT_TRANSACTIONS),
    meta: { source: "mock-api", fetchedAt: new Date().toISOString() },
  };
}

/** Simulates GET /dashboard/summary — for loaders / suspense demos */
export async function fetchMockDashboardMeta() {
  await delay(200);
  return {
    ok: true,
    version: "1.0.0-mock",
    message: "Finance Dashboard mock API — no real backend",
  };
}
