import { lazy, Suspense, useEffect, useState } from "react";

// The scene inlines the full three.js runtime (~800 kB), so it only downloads once the hero has scrolled away.
const SylvaLivingWorldScene = lazy(() =>
  import("@designcodeio/threeui/components/SylvaLivingWorldScene").then((m) => ({ default: m.SylvaLivingWorldScene })),
);

/**
 * Keeps the Sylva living world behind every section after the hero. It mounts when the hero leaves the
 * viewport and unmounts when the hero returns, so only one WebGL context is alive at a time.
 */
export function WorldBackdrop() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([e]) => setMounted(e.intersectionRatio < 0.12),
      { threshold: [0, 0.12, 0.5] },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
      style={{ opacity: mounted ? 0.5 : 0 }}
    >
      {mounted && (
        <Suspense fallback={null}>
          <SylvaLivingWorldScene style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
        </Suspense>
      )}
    </div>
  );
}
