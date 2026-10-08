import { useMemo } from "react";
import * as THREE from "three";

/** Procedural "code editor" screen so monitors and laptops show something real. */
export function useScreenTexture(seed = 1, accent = "#38bdf8") {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 320;
    const g = c.getContext("2d")!;
    g.fillStyle = "#0b1220";
    g.fillRect(0, 0, 512, 320);
    g.fillStyle = "#131d33";
    g.fillRect(0, 0, 512, 28);
    ["#f87171", "#fbbf24", "#34d399"].forEach((col, i) => {
      g.fillStyle = col;
      g.beginPath();
      g.arc(18 + i * 18, 14, 5, 0, Math.PI * 2);
      g.fill();
    });
    const rng = [seed * 9301 + 49297];
    const r = () => {
      rng[0] = (rng[0] * 16807) % 2147483647;
      return rng[0] / 2147483647;
    };
    const cols = [accent, "#a78bfa", "#94a3b8", "#34d399", "#fbbf24"];
    for (let i = 0; i < 14; i++) {
      let x = 24 + Math.floor(r() * 3) * 24;
      const parts = 2 + Math.floor(r() * 3);
      for (let p = 0; p < parts; p++) {
        const w = 30 + r() * 90;
        g.globalAlpha = 0.9;
        g.fillStyle = cols[Math.floor(r() * cols.length)];
        g.fillRect(x, 48 + i * 19, w, 8);
        x += w + 10;
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [seed, accent]);
}

