import * as THREE from "three";
import type { ProjectItem } from "../../data/portfolioData";

const cache = new Map<string, THREE.CanvasTexture>();

function finish(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function wrap(g: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (g.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + "…";
  }
  return lines;
}

/** Rounded app-icon style tile with a label, used for tech and skill chips. */
export function tileTexture(label: string, color: string) {
  const key = `tile:${label}:${color}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "#0b1020");
  g.shadowColor = "rgba(0,0,0,0.35)";
  g.shadowBlur = 18;
  g.shadowOffsetY = 8;
  roundRect(g, 16, 12, 224, 224, 52);
  g.fillStyle = grad;
  g.fill();
  g.shadowColor = "transparent";
  const hi = g.createLinearGradient(0, 12, 0, 130);
  hi.addColorStop(0, "rgba(255,255,255,0.35)");
  hi.addColorStop(1, "rgba(255,255,255,0)");
  roundRect(g, 16, 12, 224, 224, 52);
  g.fillStyle = hi;
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.35)";
  g.lineWidth = 3;
  roundRect(g, 16, 12, 224, 224, 52);
  g.stroke();
  let size = 54;
  g.font = `700 ${size}px ui-monospace, Menlo, Consolas, monospace`;
  while (g.measureText(label).width > 180 && size > 22) {
    size -= 2;
    g.font = `700 ${size}px ui-monospace, Menlo, Consolas, monospace`;
  }
  g.fillStyle = "#fff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(label, 128, 124);
  const t = finish(c);
  cache.set(key, t);
  return t;
}

export const CARD_PALETTE: [string, string][] = [
  ["#0ea5e9", "#4338ca"],
  ["#f97316", "#be185d"],
  ["#10b981", "#0e7490"],
  ["#8b5cf6", "#db2777"],
  ["#f59e0b", "#dc2626"],
];

/** Poster-style project card: index, category, title and headline stats. */
export function cardTexture(p: ProjectItem, index: number) {
  const key = `card:${p.id}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const [c1, c2] = CARD_PALETTE[index % CARD_PALETTE.length];
  const W = 1024;
  const H = 640;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  // soft decorative shapes
  g.globalAlpha = 0.16;
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(W - 120, 120, 260, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 0.1;
  g.beginPath();
  g.arc(160, H + 40, 240, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 0.14;
  g.font = "800 340px ui-monospace, Menlo, Consolas, monospace";
  g.textAlign = "right";
  g.textBaseline = "alphabetic";
  g.fillText(String(index + 1).padStart(2, "0"), W - 30, H - 120);
  g.globalAlpha = 1;
  // header
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.textAlign = "left";
  g.font = "600 24px ui-monospace, Menlo, Consolas, monospace";
  g.fillText(`SYS.${String(index + 1).padStart(2, "0")}`, 56, 70);
  g.font = "500 22px ui-monospace, Menlo, Consolas, monospace";
  const cat = wrap(g, p.category.toUpperCase(), 560, 2);
  cat.forEach((l, i) => g.fillText(l, 56, 112 + i * 30));
  // title
  g.fillStyle = "#fff";
  g.font = "800 62px ui-monospace, Menlo, Consolas, monospace";
  const title = wrap(g, p.title, 860, 3);
  title.forEach((l, i) => g.fillText(l, 56, 250 + i * 74));
  // stats
  const stats = p.stats.slice(0, 3);
  const bw = (W - 112 - (stats.length - 1) * 20) / Math.max(stats.length, 1);
  stats.forEach((s, i) => {
    const x = 56 + i * (bw + 20);
    g.fillStyle = "rgba(255,255,255,0.18)";
    roundRect(g, x, H - 150, bw, 104, 22);
    g.fill();
    g.fillStyle = "#fff";
    g.font = "800 30px ui-monospace, Menlo, Consolas, monospace";
    wrap(g, s.value, bw - 36, 1).forEach((l) => g.fillText(l, x + 18, H - 100));
    g.fillStyle = "rgba(255,255,255,0.75)";
    g.font = "500 18px ui-monospace, Menlo, Consolas, monospace";
    wrap(g, s.label.toUpperCase(), bw - 36, 1).forEach((l) => g.fillText(l, x + 18, H - 68));
  });
  const t = finish(c);
  cache.set(key, t);
  return t;
}
