import { Fragment } from "react";

/** Mono status ticker. The list is doubled so the loop is seamless. */
export function Ticker({ items, fast = false, reverse = false, className = "" }: { items: string[]; fast?: boolean; reverse?: boolean; className?: string }) {
  const loop = [...items, ...items];
  return (
    <div className={`ticker overflow-hidden ${className}`} aria-hidden="true">
      <div className={`ticker-track ${fast ? "fast" : ""} ${reverse ? "reverse" : ""}`}>
        {loop.map((t, i) => (
          <Fragment key={i}>
            <span className="label !text-inherit whitespace-nowrap px-5">{t}</span>
            <span className="self-center h-1 w-1 rounded-full bg-accent" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/** Large pill-style marquee row used for skills. */
export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="ticker overflow-hidden py-1.5" aria-hidden="true">
      <div className={`ticker-track ${reverse ? "reverse" : ""}`} style={{ animationDuration: reverse ? "55s" : "48s" }}>
        {loop.map((t, i) => (
          <span key={i} className="mx-1.5 shrink-0 rounded-full border border-line bg-white/80 px-6 py-2.5 font-display text-lg font-medium tracking-tight text-ink">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
