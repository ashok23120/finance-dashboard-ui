import { useContext } from "react";
import { AppContext } from "../../context/app-context";

/**
 * Full-viewport decorative backgrounds: light = gray tech pattern, dark = neon network.
 * Kept at low opacity so cards and text stay readable.
 */
export default function ThemeBackground() {
  const { darkMode } = useContext(AppContext);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Base wash */}
      <div
        className="absolute inset-0 bg-slate-50 transition-colors duration-300 dark:bg-slate-950"
      />

      {/* Theme image — opacity tuned for legibility */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300"
        style={{
          backgroundImage: darkMode ? "url(/bg-dark.png)" : "url(/bg-light.png)",
          opacity: darkMode ? 0.14 : 0.065,
        }}
      />

      {/* Soft veil so charts/cards pop; keeps pattern subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-slate-100/30 dark:from-slate-950/50 dark:via-transparent dark:to-slate-950/70" />
    </div>
  );
}
