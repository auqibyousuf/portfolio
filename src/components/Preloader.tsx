import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "../data/site";
import { useReducedMotion } from "../lib/useMedia";

const BUBBLES = Array.from({ length: 14 }, (_, i) => ({
  size: 24 + ((i * 37) % 90),
  left: (i * 71) % 100,
  top: (i * 53) % 100,
  delay: (i % 5) * 0.4,
  duration: 5 + (i % 4),
}));

/** Boot-sequence preloader: floating bubbles, status ticker, monogram, signature title and a percentage counter. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);
  const total = reduced ? 700 : 2600;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      setPct(Math.round(1 - Math.pow(1 - t, 3) === 1 ? 100 : (1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [onDone, total]);

  const status = useMemo(() => SITE.preloader.status, []);
  const message = status[Math.min(status.length - 1, Math.floor((pct / 100) * status.length))];

  return (
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-paper"
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      role="status"
      aria-label={`Loading ${pct} percent`}
    >
      {BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full border border-white/80 bg-gradient-to-br from-white to-accent/10 shadow-card"
          style={{ width: b.size, height: b.size, left: `${b.left}%`, top: `${b.top}%` }}
          animate={reduced ? undefined : { y: [0, -26, 0], x: [0, 8, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <p className="absolute left-0 right-0 top-8 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-mute">{message}</p>

      <div className="relative flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid h-24 w-24 place-items-center rounded-[28px] bg-ink font-display text-4xl font-semibold tracking-tight text-white shadow-lift"
        >
          {SITE.monogram}
        </motion.div>
        <p className="mt-6 font-script text-5xl text-accent sm:text-6xl">{SITE.profile.title}</p>
        <p className="mt-10 font-display text-7xl font-light tabular-nums tracking-tighter text-ink sm:text-8xl">
          {pct}
          <span className="text-3xl text-mute">%</span>
        </p>
        <div className="mt-6 h-[3px] w-56 overflow-hidden rounded-full bg-soft">
          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </motion.div>
  );
}
