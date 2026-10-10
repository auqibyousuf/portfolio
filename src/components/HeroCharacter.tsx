import { useEffect, useRef } from "react";

const PIVOT = "45.9% 22%"; // the neck, as a share of the image box

/**
 * The hero character as two layers (body and head). The head turns, tilts and nods towards the pointer around the neck,
 * so it appears to look at the cursor. Touch devices, which have no cursor, get a slow idle look-around instead. With
 * reduced motion the head stays still.
 */
export function HeroCharacter({ className = "", title }: { className?: string; title?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = head.current;
    const wrap = box.current;
    if (!el || !wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cur = { x: 0, y: 0 };
    const goal = { x: 0, y: 0 };
    let usedPointer = false;
    let visible = true;
    let raf = 0;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      usedPointer = true;
      const r = wrap.getBoundingClientRect();
      // Aim from the head (about a fifth of the way down the image) towards the pointer.
      goal.x = clamp((e.clientX - (r.left + r.width * 0.46)) / (window.innerWidth * 0.3));
      goal.y = clamp((e.clientY - (r.top + r.height * 0.14)) / (window.innerHeight * 0.32));
    };
    const onLeave = () => {
      goal.x = 0;
      goal.y = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(wrap);

    function tick(t: number) {
      if (!visible) return;
      if (!usedPointer) {
        goal.x = Math.sin(t / 2600) * 0.55;
        goal.y = Math.sin(t / 3400 + 1) * 0.22;
      }
      cur.x += (goal.x - cur.x) * 0.1;
      cur.y += (goal.y - cur.y) * 0.1;
      el!.style.transform =
        `perspective(900px) translate3d(${cur.x * 4}px,${cur.y * 3}px,0) rotateZ(${cur.x * 4.5}deg) rotateY(${cur.x * 18}deg) rotateX(${-cur.y * 11}deg)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={box} className={`relative ${className}`} style={{ aspectRatio: "306 / 900" }} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <img src="/images/characters/hero-body.webp" width={306} height={900} alt="" fetchPriority="high" decoding="async" draggable={false} className="absolute inset-0 h-full w-full" />
      <img ref={head} src="/images/characters/hero-head.webp" width={306} height={900} alt="" fetchPriority="high" decoding="async" draggable={false} className="absolute inset-0 h-full w-full will-change-transform" style={{ transformOrigin: PIVOT }} />
    </div>
  );
}
