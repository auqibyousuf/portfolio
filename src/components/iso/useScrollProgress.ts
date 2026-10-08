import { useEffect, useRef, type RefObject } from "react";

/**
 * Tracks how far the page has scrolled through `target`, as a 0..1 value held
 * in a ref so three.js frame loops can read it without triggering re-renders.
 * `sticky` sections report progress over (height - viewport); others over the
 * distance the element takes to leave the viewport.
 */
export function useScrollProgress(target: RefObject<HTMLElement | null>, mode: "sticky" | "leave" = "sticky") {
  const progress = useRef(0);

  useEffect(() => {
    const update = () => {
      const el = target.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = mode === "sticky" ? rect.height - vh : rect.height;
      const done = -rect.top;
      progress.current = span > 0 ? Math.min(1, Math.max(0, done / span)) : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target, mode]);

  return progress;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
