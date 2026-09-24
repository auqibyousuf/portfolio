import React, { useEffect, useRef } from "react";

export type BackgroundMode = "cinematic-video" | "interactive-mesh" | "aurora-particles";

interface CinematicBackgroundProps {
  mode: BackgroundMode;
  onModeChange?: (mode: BackgroundMode) => void;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const isDarkMode = () =>
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.getAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Initial commit base color: rgba(137,170,204)
    // Dark mode: luminous high-contrast slate-blue rgba(137, 170, 204)
    // Light mode: darker, high-contrast slate-navy rgba(15, 23, 42) so dots are never dull
    const getColorPrefix = () =>
      isDarkMode() ? "rgba(137, 170, 204, " : "rgba(15, 23, 42, ";

    let pts: Array<{
      ox: number;
      oy: number;
      x: number;
      y: number;
      vx?: number;
      vy?: number;
      phase: number;
      radius?: number;
      color?: string;
    }> = [];

    const init = () => {
      pts = [];
      const prefix = getColorPrefix();

      if (mode === "aurora-particles") {
        const count = Math.min(85, Math.floor((W * H) / 14000));
        const colors = [
          prefix,
          isDarkMode() ? "rgba(56, 189, 248, " : "rgba(2, 132, 199, ",
          isDarkMode() ? "rgba(129, 140, 248, " : "rgba(79, 70, 229, ",
        ];
        for (let i = 0; i < count; i++) {
          pts.push({
            ox: Math.random() * W,
            oy: Math.random() * H,
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            radius: Math.random() * 2.2 + 1.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            phase: Math.random() * Math.PI * 2,
          });
        }
      } else {
        // Grid spacing from original commit
        const SPACING = W < 768 ? 58 : 52;
        const COLS = Math.ceil(W / SPACING) + 1;
        const ROWS = Math.ceil(H / SPACING) + 1;
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            pts.push({
              ox: c * SPACING,
              oy: r * SPACING,
              x: c * SPACING,
              y: r * SPACING,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    init();

    let t = 0;
    let raf: number;

    const draw = () => {
      // MODE BEHAVIOR & VISUAL DISTINCTION:
      // Cinematic: Fluid harmonic undulating wave oscillations across the canvas
      // Mesh: Pure static geometric matrix responding only directly to mouse interaction
      const isCinematic = mode === "cinematic-video";

      t += isCinematic ? 0.012 : 0.007;
      ctx.clearRect(0, 0, W, H);
      const prefix = getColorPrefix();
      const dark = isDarkMode();

      if (mode === "aurora-particles") {
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          p.x += (p.vx || 0) + Math.sin(t + p.phase) * 0.35;
          p.y += (p.vy || 0) + Math.cos(t * 0.8 + p.phase) * 0.35;

          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;

          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 190) {
            const force = (190 - dist) / 190;
            p.x += (dx / dist) * force * 3.5;
            p.y += (dy / dist) * force * 3.5;
          }

          ctx.beginPath();
          ctx.fillStyle = `${p.color || prefix}0.85)`;
          ctx.arc(p.x, p.y, p.radius || 1.8, 0, Math.PI * 2);
          ctx.fill();

          for (let j = i + 1; j < pts.length; j++) {
            const p2 = pts[j];
            const djx = p.x - p2.x;
            const djy = p.y - p2.y;
            const d = Math.sqrt(djx * djx + djy * djy);
            if (d < 125) {
              const alpha = (1 - d / 125) * (dark ? 0.28 : 0.35);
              ctx.beginPath();
              ctx.strokeStyle = `${p.color || prefix}${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      } else {
        const SPACING = W < 768 ? 58 : 52;
        const COLS = Math.ceil(W / SPACING) + 1;
        const ROWS = Math.ceil(H / SPACING) + 1;

        for (const p of pts) {
          // Distinct physics:
          // In Cinematic mode: dynamic undulating wave flow
          // In Mesh mode: crisp geometric grid that only displaces when the mouse hovers
          const fx = isCinematic ? Math.sin(t * 1.2 + p.phase) * 6 : 0;
          const fy = isCinematic ? Math.cos(t * 0.9 + p.phase) * 6 : 0;
          const tx = p.ox + fx;
          const ty = p.oy + fy;

          const dx = tx - mouse.current.x;
          const dy = ty - mouse.current.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          const repelRadius = isCinematic ? 180 : 140;
          const repelForceFactor = isCinematic ? 55 : 45;
          const repel = d < repelRadius ? ((repelRadius - d) / repelRadius) * repelForceFactor : 0;

          p.x = tx + (dx / (d + 1)) * repel;
          p.y = ty + (dy / (d + 1)) * repel;
        }

        ctx.lineWidth = isCinematic ? 0.85 : 0.7;

        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const idx = r * COLS + c;
            if (idx >= pts.length) continue;
            const p = pts[idx];

            const dx = p.x - mouse.current.x;
            const dy = p.y - mouse.current.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            const near = Math.max(0, 1 - d / 280);

            // Normal background by default; grid & dark dots reveal interactively around cursor movement
            if (near <= 0.01) continue;

            const dotA = dark
              ? near * 0.65
              : near * 0.75;

            const dotR = isCinematic
              ? 1.5 + near * 2.8
              : 1.4 + near * 2.4;

            if (c < COLS - 1 && idx + 1 < pts.length) {
              const n = pts[idx + 1];
              const ndx = n.x - mouse.current.x;
              const ndy = n.y - mouse.current.y;
              const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
              const nNear = Math.max(0, 1 - ndist / 280);
              const combinedNear = (near + nNear) / 2;

              if (combinedNear > 0.05) {
                ctx.beginPath();
                ctx.strokeStyle = `${prefix}${combinedNear * (dark ? 0.38 : 0.48)})`;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(n.x, n.y);
                ctx.stroke();
              }
            }

            if (r < ROWS - 1 && idx + COLS < pts.length) {
              const n = pts[idx + COLS];
              const ndx = n.x - mouse.current.x;
              const ndy = n.y - mouse.current.y;
              const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
              const nNear = Math.max(0, 1 - ndist / 280);
              const combinedNear = (near + nNear) / 2;

              if (combinedNear > 0.05) {
                ctx.beginPath();
                ctx.strokeStyle = `${prefix}${combinedNear * (dark ? 0.38 : 0.48)})`;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(n.x, n.y);
                ctx.stroke();
              }
            }

            ctx.beginPath();
            ctx.fillStyle = `${prefix}${dotA})`;
            ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      init();
    };
    window.addEventListener("resize", resize);

    const observer = new MutationObserver(() => {
      init();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* 
        Original Commit Background:
        - Hero Canvas Mesh
        - Clean Volumetric Gradient Orbs (orb-1, orb-2, orb-3)
        - Clean Grain & Scanline Overlays
        - No artificial colored video or fake beam blocks
      */}
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

      {/* Volumetric Gradient Orbs from original initial commit */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700 ${
          mode === "interactive-mesh" ? "opacity-30" : "opacity-80"
        }`}
        aria-hidden="true"
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="grain-overlay" />
      <div className="scanline-overlay" />
      <div className="absolute inset-0 bg-radial-spotlight pointer-events-none" />
    </div>
  );
};
