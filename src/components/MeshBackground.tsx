import { useEffect, useRef } from "react";

const GAP = 34;
const REACH = 230; // how far the cursor's influence spreads, in px

type Pt = { ox: number; oy: number; x: number; y: number; ph: number };

function channels(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return (v || fallback).split(/\s+/).join(",");
}

/**
 * Full-page dot mesh. It breathes with a slow wave, and around the cursor the dots swell, drift apart and join up with
 * lines while a soft accent glow follows the pointer. A click sends a ripple through the grid. Without a pointer (touch,
 * idle) a glow wanders across it on its own; with reduced motion the mesh is drawn once and stays still. Colours come
 * from the active theme, so it follows the light and dark switch.
 */
export function MeshBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let pts: Pt[] = [];
    let ink = "15,18,24";
    let accent = "212,34,58";
    let dark = false;

    const mouse = { x: -9999, y: -9999, on: false };
    const glow = { x: 0, y: 0 };
    let lastMove = -1e9;
    const ripples: { x: number; y: number; t0: number }[] = [];

    const readTheme = () => {
      ink = channels("--ink", "15 18 24");
      accent = channels("--accent", "212 34 58");
      dark = document.documentElement.getAttribute("data-theme") === "dark" || (!document.documentElement.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / GAP) + 2;
      rows = Math.ceil(H / GAP) + 2;
      pts = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = (c - 0.5) * GAP;
          const oy = (r - 0.5) * GAP;
          pts.push({ ox, oy, x: ox, y: oy, ph: (c * 0.37 + r * 0.53) % (Math.PI * 2) });
        }
      }
    };

    const draw = (now: number) => {
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      // The glow follows the real pointer, or wanders when there is none.
      const idle = now - lastMove > 2800 || !mouse.on;
      const tx = idle ? W * (0.5 + 0.32 * Math.sin(t * 0.21)) : mouse.x;
      const ty = idle ? H * (0.45 + 0.28 * Math.cos(t * 0.17)) : mouse.y;
      glow.x += (tx - glow.x) * 0.08;
      glow.y += (ty - glow.y) * 0.08;
      const cx = idle ? glow.x : mouse.x;
      const cy = idle ? glow.y : mouse.y;

      const g = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, 360);
      g.addColorStop(0, `rgba(${accent},${dark ? 0.2 : 0.13})`);
      g.addColorStop(1, `rgba(${accent},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (let i = ripples.length - 1; i >= 0; i--) if (t - ripples[i].t0 > 1.6) ripples.splice(i, 1);

      const near: number[] = new Array(pts.length);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const wave = reduced ? 0 : 1;
        const bx = p.ox + Math.sin(t * 0.7 + p.ph) * 2.6 * wave;
        const by = p.oy + Math.cos(t * 0.6 + p.ph * 1.3) * 2.6 * wave;
        const dx = bx - cx;
        const dy = by - cy;
        const d = Math.hypot(dx, dy);
        const n = Math.max(0, 1 - d / REACH);
        near[i] = n;
        const push = n * n * 22;
        p.x = bx + (dx / (d + 1)) * push;
        p.y = by + (dy / (d + 1)) * push;
        // Ripples lift the dots along an expanding ring.
        let rip = 0;
        for (const r of ripples) {
          const age = t - r.t0;
          const ring = age * 520;
          const dr = Math.abs(Math.hypot(bx - r.x, by - r.y) - ring);
          if (dr < 60) rip = Math.max(rip, (1 - dr / 60) * (1 - age / 1.6));
        }
        near[i] = Math.min(1, near[i] + rip * 0.9);
      }

      // Lines between neighbours that are both close to the cursor.
      ctx.lineWidth = 0.8;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const a = pts[i];
          if (c < cols - 1) {
            const m = (near[i] + near[i + 1]) / 2;
            if (m > 0.06) {
              ctx.strokeStyle = `rgba(${ink},${m * (dark ? 0.34 : 0.3)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
              ctx.stroke();
            }
          }
          if (r < rows - 1) {
            const m = (near[i] + near[i + cols]) / 2;
            if (m > 0.06) {
              ctx.strokeStyle = `rgba(${ink},${m * (dark ? 0.34 : 0.3)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(pts[i + cols].x, pts[i + cols].y);
              ctx.stroke();
            }
          }
        }
      }

      // Dots: faint everywhere, brighter and larger near the cursor, accent-tinted at the very centre.
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const n = near[i];
        const a = (dark ? 0.16 : 0.15) + n * (dark ? 0.62 : 0.6);
        ctx.fillStyle = n > 0.72 ? `rgba(${accent},${Math.min(1, a + 0.15)})` : `rgba(${ink},${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1 + n * 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf = 0;
    let running = false;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    readTheme();
    build();
    draw(performance.now());
    start();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.on = true;
      lastMove = performance.now();
      if (reduced) draw(performance.now());
    };
    const onDown = (e: PointerEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() / 1000 });
      if (ripples.length > 4) ripples.shift();
    };
    const onLeave = () => {
      mouse.on = false;
    };
    const onResize = () => {
      build();
      draw(performance.now());
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const mo = new MutationObserver(() => {
      readTheme();
      draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      readTheme();
      draw(performance.now());
    };
    mq.addEventListener("change", onScheme);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      mo.disconnect();
      mq.removeEventListener("change", onScheme);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" />;
}
