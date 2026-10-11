import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

export type ThemePreference = "auto" | "light" | "dark";
const KEY = "preferred-theme";
const ORDER: ThemePreference[] = ["auto", "light", "dark"];
const LABEL: Record<ThemePreference, string> = { auto: "Theme: follows your device", light: "Theme: light", dark: "Theme: dark" };

function read(): ThemePreference {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark" || v === "auto") return v;
  } catch {
    /* storage unavailable */
  }
  return "auto";
}

function apply(t: ThemePreference) {
  const root = document.documentElement;
  if (t === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", t);
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* ignore */
  }
}

/** One button that cycles auto, light and dark. The saved choice is applied before first paint by a script in index.html. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<ThemePreference>(read);

  useEffect(() => {
    apply(theme);
  }, [theme]);

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`${LABEL[theme]}. Switch to ${next}.`}
      title={LABEL[theme]}
      className={`grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface cursor-pointer ${className}`}
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  );
}
