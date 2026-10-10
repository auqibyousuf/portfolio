import { useEffect, useRef } from "react";

const PIVOT = "45.9% 22%"; // the neck, as a share of the image box

/**
 * The hero character as two layers (body and head). The head turns, tilts and nods towards the pointer around the neck,
 * and the shoulders lean with it, so the character appears to watch the cursor wherever it goes. The response never
 * flattens (each side is scaled to the distance to the screen edge), and a faint breathing motion keeps it alive when the pointer is still. Touch devices,
 * which have no cursor, get a slow look-around instead. With reduced motion everything stays still.
 */
export function HeroCharacter({ className = "", title }: { className?: string; title?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLImageElement>(null);
  const body = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const headEl = head.current;
    const bodyEl = body.current;
    const wrap = box.current;
    if (!headEl || !bodyEl || !wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cur = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, seen: false };
    let visible = true;
    let raf = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.seen = true;
    };

    const frame = (t: number) => {
      raf = 0;
      if (!visible) {
        running = false;
        return;
      }
      let gx: number;
      let gy: number;
      if (pointer.seen) {
        // Aim from the head to the pointer. Each side is scaled by the room the pointer has to travel on that side,
        // so the angle keeps changing all the way to every edge of the screen instead of flattening out.
        const r = wrap.getBoundingClientRect();
        const hx = r.left + r.width * 0.46;
        const hy = r.top + r.height * 0.14;
        const dx = pointer.x - hx;
        const dy = pointer.y - hy;
        const tx = dx < 0 ? dx / Math.max(hx, 1) : dx / Math.max(window.innerWidth - hx, 1);
        const ty = dy < 0 ? dy / Math.max(hy, 1) : dy / Math.max(window.innerHeight - hy, 1);
        gx = Math.sign(tx) * Math.pow(Math.min(1, Math.abs(tx)), 0.85);
        gy = Math.sign(ty) * Math.pow(Math.min(1, Math.abs(ty)), 0.85);
      } else {
        gx = Math.sin(t / 2400) * 0.6;
        gy = Math.sin(t / 3100 + 1) * 0.25;
      }
      // Breathing, so the figure is never perfectly still.
      const breathe = Math.sin(t / 900);
      cur.x += (gx - cur.x) * 0.16;
      cur.y += (gy - cur.y) * 0.16;
      headEl.style.transform =
        `perspective(900px) translate3d(${cur.x * 8}px,${cur.y * 5 + breathe * 0.8}px,0) rotateZ(${cur.x * 6}deg) rotateY(${cur.x * 26}deg) rotateX(${-cur.y * 15}deg)`;
      bodyEl.style.transform = `translate3d(${cur.x * 3}px,${breathe * 0.7}px,0) rotateZ(${cur.x * 1.3}deg) scaleY(${1 + breathe * 0.0035})`;
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(wrap);
    start();

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      running = false;
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={box} className={`relative ${className}`} style={{ aspectRatio: "306 / 900" }} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <img ref={body} src="/images/characters/hero-body.webp" width={306} height={900} alt="" fetchPriority="high" decoding="async" draggable={false} className="absolute inset-0 h-full w-full will-change-transform" style={{ transformOrigin: "50% 100%" }} />
      <img ref={head} src="/images/characters/hero-head.webp" width={306} height={900} alt="" fetchPriority="high" decoding="async" draggable={false} className="absolute inset-0 h-full w-full will-change-transform" style={{ transformOrigin: PIVOT }} />
    </div>
  );
}
