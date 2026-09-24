import React, { useState, useEffect } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

export type ThemePreference = "auto" | "light" | "dark";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred-theme") as ThemePreference | null;
      if (saved === "light" || saved === "dark" || saved === "auto") return saved;
    }
    return "auto";
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("preferred-theme", theme);

    if (theme === "auto") {
      root.removeAttribute("data-theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      root.classList.add("dark");
    } else {
      root.setAttribute("data-theme", "light");
      root.classList.remove("dark");
    }

    // Listener for system preference changes when in auto mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const current = localStorage.getItem("preferred-theme");
      if (current === "auto" || !current) {
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <div
      aria-label="Theme selector"
      className={`inline-flex items-center p-0.5 rounded-full bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] shadow-sm select-none font-mono ${className}`}
    >
      <button
        onClick={() => setTheme("auto")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
          theme === "auto"
            ? "bg-[hsl(var(--surface))] text-[hsl(var(--text))] shadow-xs border border-[hsl(var(--stroke))]"
            : "text-[hsl(var(--muted))] hover:text-[hsl(var(--text))]"
        }`}
        title="System Auto Theme"
      >
        <Laptop className="w-3 h-3 text-sky-500" />
        <span className="hidden md:inline">Auto</span>
      </button>

      <button
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
          theme === "light"
            ? "bg-[hsl(var(--surface))] text-amber-500 shadow-xs border border-[hsl(var(--stroke))]"
            : "text-[hsl(var(--muted))] hover:text-[hsl(var(--text))]"
        }`}
        title="Light Theme"
      >
        <Sun className="w-3 h-3 text-amber-500" />
        <span className="hidden md:inline">Light</span>
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
          theme === "dark"
            ? "bg-[hsl(var(--surface))] text-indigo-400 shadow-xs border border-[hsl(var(--stroke))]"
            : "text-[hsl(var(--muted))] hover:text-[hsl(var(--text))]"
        }`}
        title="Dark Theme"
      >
        <Moon className="w-3 h-3 text-indigo-400" />
        <span className="hidden md:inline">Dark</span>
      </button>
    </div>
  );
};
