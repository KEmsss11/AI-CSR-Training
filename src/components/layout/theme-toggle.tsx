
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // next-themes provides this attribute only after the theme is resolved.
  const isMounted =
    typeof document !== "undefined" &&
    document.documentElement.dataset.theme !== undefined;

  if (!isMounted) {
    return (
      <button
        type="button"
        className="btn btn-ghost btn-circle"
        aria-label="Toggle theme"
        title="Toggle theme"
        disabled
      >
        <span className="loading loading-spinner loading-sm" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="btn btn-ghost btn-circle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
