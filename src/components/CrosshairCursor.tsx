import { useEffect, useRef } from "react";

/**
 * Crosshair cursor for mouse users: a dot on the pointer, a lagging ring with four ticks, faint guide lines across the
 * page and a small coordinate readout. The ring swells over links and buttons and pinches on click. It is skipped for
 * touch and for reduced motion, and the normal cursor returns over form fields so typing stays usable.
 */
export function CrosshairCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const hLine = useRef<HTMLDivElement>(null);
  const vLine = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const d = dot.current, r = ring.current, h = hLine.current, v = vLine.current, l = label.current;
    if (!d || !r || !h || !v || !l) return;

    document.documentElement.classList.add("has-crosshair");
    const m = { x: -200, y: -200 };
    const p = { x: -200, y: -200 };
    let shown = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      m.x = e.clientX;
      m.y = e.clientY;
      if (!shown) {
        shown = true;
        p.x = m.x;
        p.y = m.y;
        for (const el of [d, r, h, v, l]) el.style.opacity = "1";
      }
      d.style.transform = `translate3d(${m.x}px,${m.y}px,0) translate(-50%,-50%)`;
      h.style.transform = `translate3d(0,${m.y}px,0)`;
      v.style.transform = `translate3d(${m.x}px,0,0)`;
      const target = e.target as HTMLElement | null;
      r.classList.toggle("is-hover", !!target?.closest("a, button, [role=tab], summary, label"));
      l.textContent = `x ${Math.round(m.x)}  y ${Math.round(m.y)}`;
    };
    const onDown = () => r.classList.add("is-down");
    const onUp = () => r.classList.remove("is-down");
    const onLeave = () => {
      shown = false;
      for (const el of [d, r, h, v, l]) el.style.opacity = "0";
    };
    const tick = () => {
      p.x += (m.x - p.x) * 0.18;
      p.y += (m.y - p.y) * 0.18;
      r.style.transform = `translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%)`;
      l.style.left = `${p.x + 26}px`;
      l.style.top = `${p.y + 22}px`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-crosshair");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="crosshair-layer">
      <div ref={hLine} className="crosshair-line crosshair-h" />
      <div ref={vLine} className="crosshair-line crosshair-v" />
      <div ref={ring} className="crosshair-ring">
        <i /><i /><i /><i />
      </div>
      <div ref={dot} className="crosshair-dot" />
      <div ref={label} className="crosshair-label" />
    </div>
  );
}
