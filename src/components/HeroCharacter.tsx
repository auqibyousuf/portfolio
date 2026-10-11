import { useEffect, useRef } from "react";

const HEAD_PIVOT = "46% 76%"; // the neck, as a share of the head layers' box (they cover the top 29% of the canvas)

// Nine heads, one per look direction, on a 3 x 3 grid. Rows run top to bottom, columns left to right. They are drawn over
// one constant body, so only the head and eyes change between them.
const GRID = [
  ["up-left", "up", "up-right"],
  ["left", "center", "right"],
  ["down-left", "down", "down-right"],
] as const;
const LAYERS = GRID.flat();
const HEAD_HEIGHT = 29; // % of the 306 x 900 canvas the head layers cover (261px)

export type LookLabel = "Centre" | "Left" | "Right" | "Up" | "Down" | "Up-Left" | "Up-Right" | "Down-Left" | "Down-Right";

// Two different renders ghost when dissolved (double glasses, double beard), so each pose is held and the switch to
// the next is a quick crossfade in a narrow band around the halfway point.
const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, (t - 0.4) / 0.2));
  return x * x * (3 - 2 * x);
};

function labelFor(x: number, y: number): LookLabel {
  const col = x < -0.5 ? 0 : x > 0.5 ? 2 : 1; // the same thresholds the blend uses, so the label names the pose on show
  const row = y < -0.5 ? 0 : y > 0.5 ? 2 : 1;
  const names: LookLabel[][] = [
    ["Up-Left", "Up", "Up-Right"],
    ["Left", "Centre", "Right"],
    ["Down-Left", "Down", "Down-Right"],
  ];
  return names[row][col];
}

/**
 * The hero character: nine pre-rendered looks over a constant body. The pointer's position, measured towards each
 * screen edge, picks a spot on the 3 x 3 grid and the four nearest looks are blended, so the face turns through every
 * direction as the cursor moves. A small tilt rides on top for continuous motion, a breath keeps the figure alive when
 * the cursor is still, touch devices look around on their own, and reduced motion shows the straight-ahead look.
 */
export function HeroCharacter({ className = "", title, onLook }: { className?: string; title?: string; onLook?: (l: LookLabel) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLImageElement>(null);
  const layers = useRef<(HTMLImageElement | null)[]>([]);
  const loaded = useRef<Set<number>>(new Set([4]));
  const onLookRef = useRef(onLook);
  useEffect(() => {
    onLookRef.current = onLook;
  }, [onLook]);

  useEffect(() => {
    const headEl = head.current;
    const bodyEl = body.current;
    const wrap = box.current;
    if (!headEl || !bodyEl || !wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cur = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, seen: false };
    let visible = true;
    let running = false;
    let raf = 0;
    let lastLabel: LookLabel | "" = "";

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
        // Aim from the head to the pointer, scaled by the distance to the screen edge on that side, so the angle
        // keeps changing right out to every edge.
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
        gx = Math.sin(t / 2600) * 0.9;
        gy = Math.sin(t / 3300 + 1) * 0.6;
      }
      cur.x += (gx - cur.x) * 0.14;
      cur.y += (gy - cur.y) * 0.14;
      const breathe = Math.sin(t / 900);

      // Bilinear weights over the 3 x 3 grid.
      const col0 = cur.x < 0 ? 0 : 1;
      const row0 = cur.y < 0 ? 0 : 1;
      const fx = smooth(cur.x < 0 ? cur.x + 1 : cur.x);
      const fy = smooth(cur.y < 0 ? cur.y + 1 : cur.y);
      const w = new Array<number>(9).fill(0);
      const put = (r: number, c: number, v: number) => {
        const i = r * 3 + c;
        if (loaded.current.has(i)) w[i] += v;
      };
      put(row0, col0, (1 - fx) * (1 - fy));
      put(row0, col0 + 1, fx * (1 - fy));
      put(row0 + 1, col0, (1 - fx) * fy);
      put(row0 + 1, col0 + 1, fx * fy);
      const total = w.reduce((a, b) => a + b, 0);
      if (total === 0) w[4] = 1;
      // Each layer's opacity is its share of the weight so far, which makes the stack an exact weighted blend.
      let cum = 0;
      for (let i = 0; i < 9; i++) {
        const img = layers.current[i];
        if (!img) continue;
        const wi = total === 0 ? w[i] : w[i] / total;
        cum += wi;
        img.style.opacity = wi > 0.002 ? String(wi / cum) : "0";
      }

      headEl.style.transform = `translate3d(${cur.x * 3}px,${cur.y * 2 + breathe * 0.7}px,0) rotateZ(${cur.x * 2.2}deg)`;
      bodyEl.style.transform = `translate3d(${cur.x * 2}px,${breathe * 0.6}px,0) rotateZ(${cur.x * 0.9}deg) scaleY(${1 + breathe * 0.003})`;

      const label = labelFor(cur.x, cur.y);
      if (label !== lastLabel) {
        lastLabel = label;
        onLookRef.current?.(label);
      }
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
      <div ref={head} className="absolute left-0 right-0 top-0 will-change-transform" style={{ height: `${HEAD_HEIGHT}%`, transformOrigin: HEAD_PIVOT }}>
        {LAYERS.map((name, i) => (
          <img
            key={name}
            ref={(n) => {
              layers.current[i] = n;
            }}
            src={`/images/characters/look/${name}.webp`}
            width={306}
            height={261}
            alt=""
            decoding="async"
            fetchPriority={i === 4 ? "high" : "low"}
            draggable={false}
            onLoad={() => loaded.current.add(i)}
            className="absolute inset-0 h-full w-full"
            style={{ opacity: i === 4 ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}
