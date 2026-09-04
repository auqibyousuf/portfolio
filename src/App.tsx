import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

// ─── Lenis smooth scroll ────────────────────────────────────────────────────
let lenis: Lenis | null = null;
function initLenis() {
  lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (t: number) => { lenis?.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  gsap.ticker.lagSmoothing(0);
}

// ─── SVG Filters ───────────────────────────────────────────────────────────
function SvgFilters() {
  return (
    <svg className="svg-filters" aria-hidden>
      <defs>
        <filter id="noise-distort">
          <feTurbulence type="turbulence" baseFrequency="0.025 0.05" numOctaves="2" seed="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    </svg>
  );
}

// ─── Grain overlay ──────────────────────────────────────────────────────────
const GrainOverlay = () => <div className="grain-overlay" aria-hidden />;

// ─── Ambient cursor glow ────────────────────────────────────────────────────
function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX - 300}px,${e.clientY - 300}px)`;
    };
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden />;
}

// ─── Gradient orbs ─────────────────────────────────────────────────────────
const GradientOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
  </div>
);

// ─── Click ripple ───────────────────────────────────────────────────────────
function ClickRipple() {
  const next = useRef(0);
  useEffect(() => {
    const click = (e: MouseEvent) => {
      next.current++;
      const size = 180 + Math.random() * 80;
      // create imperatively so we can vary size without state complexity
      const el = document.createElement("div");
      el.className = "click-ripple";
      el.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 950);
    };
    window.addEventListener("click", click, { passive: true });
    return () => window.removeEventListener("click", click);
  }, []);
  return null;
}

// ─── Interactive canvas mesh (hero bg) ─────────────────────────────────────
function CanvasMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    const SPACING = 52;
    const COLS = Math.ceil(W / SPACING) + 1;
    const ROWS = Math.ceil(H / SPACING) + 1;

    type Pt = { ox: number; oy: number; x: number; y: number; phase: number };
    const pts: Pt[] = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        pts.push({ ox: c * SPACING, oy: r * SPACING, x: c * SPACING, y: r * SPACING, phase: Math.random() * Math.PI * 2 });

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove, { passive: true });

    let t = 0, raf: number;
    const draw = () => {
      t += 0.007;
      ctx.clearRect(0, 0, W, H);

      for (const p of pts) {
        const fx = Math.sin(t + p.phase) * 4;
        const fy = Math.cos(t * 0.65 + p.phase) * 4;
        const tx = p.ox + fx, ty = p.oy + fy;
        const dx = tx - mouse.current.x, dy = ty - mouse.current.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const repel = d < 130 ? ((130 - d) / 130) * 48 : 0;
        p.x = tx + (dx / (d + 1)) * repel;
        p.y = ty + (dy / (d + 1)) * repel;
      }

      ctx.lineWidth = 0.7;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const p = pts[r * COLS + c];
          const dx = p.x - mouse.current.x, dy = p.y - mouse.current.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const near = Math.max(0, 1 - d / 320);
          const lineA = 0.10 + near * 0.22;
          const dotA = 0.14 + near * 0.40;
          const dotR = 1.2 + near * 2.8;

          if (c < COLS - 1) {
            const n = pts[r * COLS + c + 1];
            ctx.beginPath();
            ctx.strokeStyle = `rgba(137,170,204,${lineA})`;
            ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          }
          if (r < ROWS - 1) {
            const n = pts[(r + 1) * COLS + c];
            ctx.beginPath();
            ctx.strokeStyle = `rgba(137,170,204,${lineA})`;
            ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          }
          ctx.beginPath();
          ctx.fillStyle = `rgba(137,170,204,${dotA})`;
          ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden />;
}

// ─── Custom cursor ──────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX - 2.5}px,${e.clientY - 2.5}px)`;
    };
    let raf: number;
    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12;
      if (ringRef.current) ringRef.current.style.transform = `translate(${pos.current.x - 16}px,${pos.current.y - 16}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    const over = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,[data-hover]")) ringRef.current?.classList.add("hover");
      else ringRef.current?.classList.remove("hover");
    };
    const down = () => ringRef.current?.classList.add("click");
    const up = () => ringRef.current?.classList.remove("click");
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// ─── Scroll progress bar ────────────────────────────────────────────────────
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="scroll-progress-bar" style={{ scaleX }} />;
}

// ─── Magnetic wrap ──────────────────────────────────────────────────────────
function Mag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.38, y: (e.clientY - r.top - r.height / 2) * 0.38, duration: 0.35, ease: "power2.out" });
  }, []);
  const leave = useCallback(() => { gsap.to(ref.current, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1,0.4)" }); }, []);
  return <div ref={ref} className={`magnetic-wrap ${className}`} onMouseMove={move} onMouseLeave={leave}>{children}</div>;
}

// ─── Text scramble ──────────────────────────────────────────────────────────
const SC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
function useScramble(el: React.RefObject<HTMLElement | null>, go: boolean, final: string) {
  useEffect(() => {
    if (!go || !el.current) return;
    const node = el.current;
    const arr = final.split("");
    const done = new Array(arr.length).fill(false);
    let idx = 0, frame = 0, raf: number;
    const step = () => {
      node.textContent = arr.map((c, i) => { if (c === " ") return " "; if (done[i]) return c; return SC[Math.floor(Math.random() * SC.length)]; }).join("");
      if (++frame % 2 === 0 && idx < arr.length) { done[idx] = true; idx++; }
      if (idx < arr.length) raf = requestAnimationFrame(step);
      else node.textContent = final;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [go, final, el]);
}

// ─── Kinetic word reveal ────────────────────────────────────────────────────
type HTag = "h1"|"h2"|"h3"|"p"|"span"|"div";
function KW({ text, className = "", delay = 0, tag = "span" }: { text: string; className?: string; delay?: number; tag?: HTag }) {
  const Tag = tag as HTag;
  return (
    <Tag className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="word-wrap" style={{ marginRight: "0.2em" }}>
          <motion.span className="word-inner" initial={{ y: "115%" }} whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: delay + i * 0.065, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "inline-block" }}>
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// ─── Slot counter ───────────────────────────────────────────────────────────
function SlotCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now();
      const run = (now: number) => {
        const p = Math.min((now - t0) / 1600, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        setVal(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }, { threshold: 0.5 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── 3D Tilt card ───────────────────────────────────────────────────────────
function Tilt({ children, className = "", strength = 14 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotateY: x * strength, rotateX: -y * strength, transformPerspective: 900, scale: 1.025, duration: 0.3, ease: "power2.out" });
  };
  const leave = () => { gsap.to(ref.current, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "elastic.out(1,0.4)" }); };
  return <div ref={ref} className={`card-3d ${className}`} onMouseMove={move} onMouseLeave={leave}>{children}</div>;
}

// ─── Rotating badge ─────────────────────────────────────────────────────────
function RotatingBadge() {
  const text = "SENIOR FRONTEND ENGINEER • REACT • DRUPAL • ";
  const r = 52;
  return (
    <div className="relative w-28 h-28 select-none" data-hover>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-[hsl(var(--muted))] tracking-widest flex flex-col items-center gap-0.5">
          <span className="text-[hsl(var(--text))] font-display italic text-sm">6+</span>
          <span className="text-[9px] uppercase tracking-[0.15em]">yrs</span>
        </span>
      </div>
      <svg className="absolute inset-0 spin-slow" viewBox="0 0 120 120" fill="none">
        <path id="circle-path" d={`M 60 60 m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0`} />
        <text className="text-[9px]" fill="rgba(255,255,255,0.35)" fontSize="9" letterSpacing="3.2">
          <textPath href="#circle-path">{text}</textPath>
        </text>
      </svg>
    </div>
  );
}

// ─── Parallax image (inner moves slower than card) ──────────────────────────
function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!ref.current || !imgRef.current) return;
    gsap.fromTo(imgRef.current,
      { yPercent: -8 },
      { yPercent: 8, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.8 } }
    );
  }, []);
  return (
    <div ref={ref} className={`img-parallax-wrap ${className}`}>
      <img ref={imgRef} src={src} alt={alt} className="img-parallax-inner w-full h-[115%] object-cover -mt-[7.5%] select-none pointer-events-none" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 1. LOADING SCREEN
// ════════════════════════════════════════════════════════════════════════════
export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let id: number, start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(((ts - start) / 2400) * 100, 100);
      setCount(Math.floor(p));
      if (p < 100) id = requestAnimationFrame(step);
      else setTimeout(onComplete, 300);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [onComplete]);

  const words = ["Design", "Engineer", "Build"];
  const wi = Math.min(Math.floor((count / 101) * words.length), words.length - 1);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[hsl(var(--bg))] flex flex-col justify-between p-8 sm:p-12 select-none overflow-hidden"
      exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="text-[9px] text-[hsl(var(--muted))] uppercase tracking-[0.4em]">
        auqib.dev — 2026
      </motion.div>

      <div className="flex items-center justify-center h-16">
        <AnimatePresence mode="wait">
          <motion.span key={words[wi]}
            initial={{ clipPath: "inset(0 0 100% 0)", y: 16 }}
            animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
            exit={{ clipPath: "inset(100% 0 0 0)", y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl font-display italic text-[hsl(var(--text))]/75">
            {words[wi]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <span className="text-[9px] text-[hsl(var(--muted))] uppercase tracking-[0.25em]">Initialising</span>
          <span className="text-6xl md:text-8xl font-display leading-none tabular-nums">{String(count).padStart(3, "0")}</span>
        </div>
        <div className="h-[1.5px] bg-[hsl(var(--stroke))]/40 overflow-hidden">
          <div className="accent-gradient h-full origin-left"
            style={{ transform: `scaleX(${count / 100})`, transition: "transform 80ms linear", boxShadow: "0 0 12px rgba(137,170,204,.5)" }} />
        </div>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. HERO
// ════════════════════════════════════════════════════════════════════════════
export function HeroSection() {
  const [tab, setTab] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [ri, setRi] = useState(0);
  const roles = ["Frontend", "React", "Drupal", "Next.js"];
  const navs = ["Home", "Work", "About", "Experience"];
  const { scrollY } = useScroll();
  const hy = useTransform(scrollY, [0, 900], [0, 60]);
  const ho = useTransform(scrollY, [600, 950], [1, 0]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setRi(p => (p + 1) % roles.length), 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    gsap.fromTo(".hw", { y: "120%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1, stagger: 0.08, ease: "expo.out", delay: 0.05 });
    gsap.fromTo(".hs", { opacity: 0, y: 20, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.09, ease: "power3.out", delay: 0.4 });
  }, []);

  const go = (t: string) => {
    setTab(t);
    const m: Record<string, string> = { Work: "work", About: "about", Experience: "experience" };
    if (m[t]) document.getElementById(m[t])?.scrollIntoView({ behavior: "smooth" });
    else lenis?.scrollTo(0);
  };

  return (
    <section className="h-screen w-full flex flex-col justify-between relative overflow-hidden select-none">
      {/* Interactive canvas mesh + gradient orbs replace the dead video */}
      <CanvasMesh />
      <GradientOrbs />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[hsl(var(--bg))] to-transparent z-[1]" />

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-4" style={{ isolation: "isolate" }}>
        <motion.div initial={{ y: -36, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.8, ease: "easeOut" }}
          className={`inline-flex items-center rounded-full backdrop-blur-xl border bg-[hsl(var(--surface))]/80 px-2 py-1.5 transition-all duration-500 ${scrolled ? "shadow-2xl shadow-black/50 border-white/15" : "border-white/8"}`}>
          <Mag>
            <div className="w-8 h-8 rounded-full relative flex items-center justify-center p-[1px] group overflow-hidden cursor-pointer">
              <div className="absolute inset-0 accent-gradient group-hover:rotate-180 transition-transform duration-700 rounded-full" />
              <div className="w-full h-full bg-[hsl(var(--bg))] rounded-full flex items-center justify-center z-10 relative">
                <span className="font-display italic text-[12px]">AY</span>
              </div>
            </div>
          </Mag>
          <div className="w-px h-4 bg-[hsl(var(--stroke))] mx-2 hidden sm:block" />
          <nav className="flex gap-0.5">
            {navs.map(n => (
              <button key={n} onClick={() => go(n)}
                className={`text-[10px] sm:text-[11px] rounded-full px-2 sm:px-3 py-1.5 font-medium transition-all cursor-pointer ${n === "Experience" ? "hidden sm:block" : ""} ${tab === n ? "text-[hsl(var(--text))] bg-[hsl(var(--stroke))]/60" : "text-[hsl(var(--muted))] hover:text-[hsl(var(--text))] hover:bg-[hsl(var(--stroke))]/30"}`}>
                {n}
              </button>
            ))}
          </nav>
          <div className="hidden sm:flex items-center gap-0">
            <div className="w-px h-4 bg-[hsl(var(--stroke))] mx-2" />
            <Mag>
              <a href="#contact" onClick={e => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="relative rounded-full p-[1px] group overflow-hidden">
                <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <div className="bg-[hsl(var(--surface))] rounded-full px-3 py-1.5 text-[11px] flex items-center gap-1 z-10 relative border border-white/5 group-hover:border-transparent transition-colors">
                  Say hi <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform inline-block">↗</span>
                </div>
              </a>
            </Mag>
          </div>
        </motion.div>
      </header>

      {/* Content */}
      <motion.div style={{ y: hy, opacity: ho }} className="flex-grow flex flex-col justify-center items-center text-center px-6 z-[2] gap-0 -mt-8 sm:-mt-14 lg:-mt-20">
        <span className="hs text-[9px] text-[hsl(var(--muted))] uppercase tracking-[0.4em] mb-2 block">
          Senior Frontend Engineer · Srinagar, India
        </span>

        <div className="flex items-end gap-6 mb-1.5">
          <h1 className="flex flex-wrap justify-center gap-x-[0.18em] text-[clamp(3.5rem,12vw,9rem)] font-display italic leading-[0.88] tracking-tight" aria-label="Auqib Ahangar">
            {["Auqib", "Ahangar"].map((w, i) => (
              <span key={i} className="overflow-hidden inline-block">
                <span className="hw inline-block">{w}</span>
              </span>
            ))}
          </h1>
          <div className="hidden lg:block mb-3 opacity-70">
            <RotatingBadge />
          </div>
        </div>

        <div className="hs flex items-center gap-1.5 text-base md:text-lg text-[hsl(var(--text))]/60 mb-2 h-7 justify-center overflow-hidden">
          <span>A</span>
          <span className="min-w-[95px] inline-block font-display italic text-lg md:text-xl text-[hsl(var(--text))] leading-none">
            <AnimatePresence mode="wait">
              <motion.span key={ri}
                initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block accent-gradient-text">{roles[ri]}</motion.span>
            </AnimatePresence>
          </span>
          <span>developer.</span>
        </div>

        <p className="hs text-sm text-[hsl(var(--muted))] max-w-sm mb-4 leading-relaxed">
          6+ years crafting performant, accessible web experiences with React, Next.js, TypeScript & Drupal.
        </p>

        <div className="hs inline-flex gap-3">
          <Mag>
            <button onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full text-xs font-semibold relative overflow-hidden group p-[1.5px] cursor-pointer">
              <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              <span className="relative z-10 bg-[hsl(var(--text))] text-[hsl(var(--bg))] rounded-full px-6 py-3 group-hover:bg-[hsl(var(--bg))] group-hover:text-[hsl(var(--text))] transition-colors flex items-center font-semibold">
                See Work
              </span>
            </button>
          </Mag>
          <Mag>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full text-xs font-semibold relative overflow-hidden group p-[1.5px] cursor-pointer">
              <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              <span className="relative z-10 bg-[hsl(var(--bg))] rounded-full px-6 py-3 group-hover:bg-transparent border border-[hsl(var(--stroke))] group-hover:border-transparent transition-all flex items-center">
                Contact
              </span>
            </button>
          </Mag>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.1, duration: 1 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-[2]">
        <span className="text-[8px] text-[hsl(var(--muted))] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-8 bg-[hsl(var(--stroke))] relative overflow-hidden">
          <div className="w-full h-1/2 bg-white/50 absolute top-0 animate-scroll-down" />
        </div>
      </motion.div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. ABOUT
// ════════════════════════════════════════════════════════════════════════════
export function AboutSection() {
  const headRef = useRef<HTMLHeadingElement>(null);
  const [go, setGo] = useState(false);
  useScramble(headRef, go, "Bridging design & engineering");

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); obs.disconnect(); } }, { threshold: 0.4 });
    if (headRef.current) obs.observe(headRef.current);
    return () => obs.disconnect();
  }, []);

  // Stagger text paragraphs with ScrollTrigger.batch
  useEffect(() => {
    ScrollTrigger.batch(".about-para", {
      onEnter: els => gsap.fromTo(els, { opacity: 0, y: 24, x: -16 }, { opacity: 1, y: 0, x: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }),
      start: "top 88%",
    });
    ScrollTrigger.batch(".cert-item", {
      onEnter: els => gsap.fromTo(els, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }),
      start: "top 90%",
    });
  }, []);

  const stack = ["React.js","Next.js","TypeScript","Drupal 10/11","Tailwind CSS","GSAP","Framer Motion","SCSS/BEM","Storybook","REST APIs","Node.js","Git/CI-CD","Core Web Vitals","WCAG A11y"];

  return (
    <section id="about" className="bg-[hsl(var(--bg))] py-10 md:py-14 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div>
            <KW text="About" tag="div" className="text-[9px] text-[hsl(var(--muted))] uppercase tracking-[0.38em] mb-4 font-semibold flex items-center gap-2 overflow-hidden" />
            <h2 ref={headRef} className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display italic text-[hsl(var(--text))] leading-tight mb-4 font-mono tracking-tight min-h-[2.5em]">
              Bridging design & engineering
            </h2>
            <div className="space-y-3 text-[hsl(var(--muted))] text-sm leading-relaxed">
              {[
                <><span className="text-[hsl(var(--text))] font-medium">Auqib Yousuf Ahangar</span> — Senior Frontend Engineer based in Srinagar, India. 6+ years building scalable, accessible web apps.</>,
                <>Currently at <span className="text-[hsl(var(--text))] font-medium">Specbee Consulting</span> on React + Drupal 10/11, decoupled Next.js architectures, and Core Web Vitals optimisation.</>,
                <>I live at the intersection of <span className="text-[hsl(var(--text))] font-medium">performance, accessibility, and craft</span> — making things that feel as good as they work.</>,
              ].map((t, i) => (
                <p key={i} className="about-para">{t}</p>
              ))}
            </div>
            <div className="mt-6 space-y-1.5">
              {["Meta Front-End Developer Specialisation","Acquia Site Studio Certified","JavaScript & TypeScript — Udemy"].map(c => (
                <div key={c} className="cert-item flex items-center gap-2.5 text-[11px] text-[hsl(var(--muted))]">
                  <span className="w-1.5 h-1.5 rounded-full accent-gradient flex-shrink-0" />{c}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Float + tilt avatar card */}
            <Tilt className="w-full max-w-xs mx-auto md:max-w-none aspect-[3/2] rounded-2xl overflow-hidden border border-[hsl(var(--stroke))]/50 cursor-pointer animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-[#89AACC]/12 via-[hsl(var(--surface))] to-[#4E85BF]/8" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
                <div className="w-16 h-16 rounded-full p-[2px] relative overflow-hidden">
                  <div className="absolute inset-0 accent-gradient rounded-full" />
                  <div className="w-full h-full rounded-full bg-[hsl(var(--surface))] flex items-center justify-center z-10 relative">
                    <span className="font-display italic text-2xl">AY</span>
                  </div>
                </div>
                <span className="text-sm font-medium">Auqib Yousuf Ahangar</span>
                <span className="text-[11px] text-[hsl(var(--muted))]">Senior Frontend Engineer</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[8px] text-[hsl(var(--muted))] uppercase tracking-widest">Available</span>
                </div>
              </div>
              <div className="halftone-overlay absolute inset-0 opacity-[0.07] pointer-events-none" />
            </Tilt>

            {/* Skill tags — staggered on appear */}
            <motion.div className="flex flex-wrap gap-1.5"
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
              variants={{ show: { transition: { staggerChildren: 0.035 } } }}>
              {stack.map(s => (
                <motion.span key={s} variants={{ hidden: { opacity: 0, y: 10, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.34,1.56,0.64,1] } } }}
                  className="skill-tag text-[10px] font-medium px-2.5 py-1 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] text-[hsl(var(--muted))] hover:text-[hsl(var(--text))] hover:border-white/20 cursor-default" data-hover>
                  {s}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. WORKS — 3D tilt + inner parallax
// ════════════════════════════════════════════════════════════════════════════
export function WorksSection() {
  const projects = [
    { title: "Decoupled Drupal Platform", cat: "Next.js + Drupal Architecture", img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop", span: "md:col-span-7" },
    { title: "Healthcare Learning App",   cat: "React + Tailwind CSS",          img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop", span: "md:col-span-5" },
    { title: "Design System Library",     cat: "Storybook + Components",        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop", span: "md:col-span-5" },
    { title: "Enterprise Web Platform",   cat: "Drupal 10 + WCAG",              img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1200&auto=format&fit=crop", span: "md:col-span-7" },
  ];

  return (
    <section id="work" className="bg-[hsl(var(--bg))] py-10 md:py-14">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex justify-between items-end mb-7 w-full">
          <div>
            <div className="overflow-hidden mb-2">
              <KW text="Selected Work" tag="div" className="text-[9px] text-[hsl(var(--muted))] uppercase tracking-[0.38em] font-semibold" />
            </div>
            <div className="overflow-hidden">
              <KW text="Featured projects" tag="h2" delay={0.04} className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-none" />
            </div>
          </div>
          <Mag className="hidden sm:inline-flex">
            <button onClick={() => document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" })}
              className="underline-draw rounded-full text-[11px] font-semibold relative overflow-hidden group p-[1.5px] cursor-pointer">
              <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              <span className="relative z-10 bg-[hsl(var(--bg))] rounded-full px-4 py-2 group-hover:bg-transparent border border-[hsl(var(--stroke))] group-hover:border-transparent transition-all flex items-center gap-1.5">
                View experience ↗
              </span>
            </button>
          </Mag>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {projects.map((p, i) => (
            <motion.div key={p.title} className={p.span}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
              <Tilt className="rounded-2xl overflow-hidden relative aspect-[4/3] md:aspect-auto md:h-[320px] group cursor-pointer shadow-xl shadow-black/20 border border-[hsl(var(--stroke))]/50" strength={10}>
                <ParallaxImage src={p.img} alt={p.title} className="absolute inset-0 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 halftone-overlay opacity-15 mix-blend-multiply pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                {/* Bottom label — slides up on hover */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-10 translate-y-0 group-hover:translate-y-2 transition-transform duration-400">
                  <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold block mb-0.5">{p.cat}</span>
                  <h3 className="text-lg md:text-xl font-display italic text-white group-hover:opacity-0 transition-opacity duration-300">{p.title}</h3>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[hsl(var(--bg))]/80 opacity-0 group-hover:opacity-100 backdrop-blur-md transition-all duration-400 flex items-center justify-center z-20 pointer-events-none">
                  <div className="rounded-full p-[1.5px] relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 accent-gradient animate-gradient-shift rounded-full" />
                    <div className="bg-[hsl(var(--bg))] px-5 py-2 rounded-full z-10 relative text-[11px] font-semibold tracking-wider flex items-center gap-1">
                      View — <span className="font-display italic text-sm">{p.title}</span>
                    </div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. SKILLS — velocity-aware marquee
// ════════════════════════════════════════════════════════════════════════════
export function SkillsMarquee() {
  const t1 = useRef<HTMLDivElement>(null);
  const t2 = useRef<HTMLDivElement>(null);
  const a1 = useRef<gsap.core.Tween | null>(null);
  const a2 = useRef<gsap.core.Tween | null>(null);
  const lastY = useRef(0), vel = useRef(0);

  const r1 = ["React.js","Next.js","TypeScript","JavaScript ES6+","Drupal 10/11","Tailwind CSS","SCSS/BEM","HTML5 CSS3"];
  const r2 = ["Framer Motion","GSAP","Storybook","REST APIs","Node.js","Core Web Vitals","WCAG A11y","Git/CI-CD"];

  useEffect(() => {
    a1.current = gsap.to(t1.current, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
    a2.current = gsap.to(t2.current, { xPercent: 50, ease: "none", duration: 32, repeat: -1 });
    const onScroll = () => {
      const now = window.scrollY;
      vel.current = now - lastY.current;
      lastY.current = now;
      const f = Math.max(0.3, Math.min(3.5, 1 + Math.abs(vel.current) * 0.05));
      const d = vel.current > 0 ? 1 : -1;
      a1.current?.timeScale(f * d);
      a2.current?.timeScale(f * -d);
    };
    const ease = setInterval(() => {
      vel.current *= 0.8;
      const f = Math.max(0.8, 1 + Math.abs(vel.current) * 0.04);
      const d = vel.current > 0 ? 1 : -1;
      a1.current?.timeScale(f * (d || 1));
      a2.current?.timeScale(f * -(d || 1));
    }, 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { a1.current?.kill(); a2.current?.kill(); clearInterval(ease); window.removeEventListener("scroll", onScroll); };
  }, []);

  const Pill = ({ text }: { text: string }) => (
    <span className="skill-tag text-[10px] font-medium px-3.5 py-1.5 rounded-full border border-[hsl(var(--stroke))] bg-[hsl(var(--surface))] text-[hsl(var(--muted))] hover:text-[hsl(var(--text))] hover:border-white/20 inline-flex items-center gap-2 cursor-default flex-shrink-0" data-hover>
      <span className="w-1 h-1 rounded-full accent-gradient" />{text}
    </span>
  );

  return (
    <section className="bg-[hsl(var(--surface))]/15 border-y border-[hsl(var(--stroke))]/40 py-8 overflow-hidden">
      <p className="text-center text-[8px] text-[hsl(var(--muted))] uppercase tracking-[0.38em] mb-5">Tech Stack</p>
      <div className="overflow-hidden mb-2.5">
        <div ref={t1} className="flex whitespace-nowrap gap-2.5" style={{ width: "200%" }}>
          {[...r1,...r1].map((s, i) => <Pill key={i} text={s} />)}
        </div>
      </div>
      <div className="overflow-hidden">
        <div ref={t2} className="flex whitespace-nowrap gap-2.5" style={{ width: "200%", transform: "translateX(-50%)" }}>
          {[...r2,...r2].map((s, i) => <Pill key={i} text={s} />)}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. EXPERIENCE
// ════════════════════════════════════════════════════════════════════════════
export function ExperienceSection() {
  const secRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const exp = [
    { role: "React Developer / Drupal Frontend Dev", company: "Specbee Consulting", period: "Feb 2026 – Present", current: true,
      bullets: ["Drupal 10/11 themes with Twig, SCSS, SDC component architecture","Decoupled Drupal + Next.js for data-driven applications","Core Web Vitals optimisation — lazy loading, code splitting, caching"] },
    { role: "Frontend Developer / Software Engineer", company: "Learntastic (American Healthcare Academy)", period: "Dec 2024 – Feb 2026",
      bullets: ["Led frontend with React, Tailwind CSS and Laravel","Reusable component library and scalable design patterns","Laravel, ASP.NET Core, Node.js API integration"] },
    { role: "Frontend Developer / Software Engineer", company: "Axelerant Technologies", period: "Dec 2021 – Nov 2024",
      bullets: ["WordPress → Drupal platform migrations at scale","UI libraries with Storybook and Acquia Site Studio","WCAG-compliant accessible interfaces (semantic HTML + ARIA)","Core Web Vitals improvements (LCP, CLS, INP)"] },
    { role: "Web Developer / Academic Assistant", company: "CSIR-Indian Institute of Integrative Medicine", period: "Oct 2020 – Dec 2021",
      bullets: ["Academic web platforms and PHP-MySQL management systems"] },
  ];

  useEffect(() => {
    if (!secRef.current || !lineRef.current) return;
    gsap.fromTo(lineRef.current, { scaleY: 0, transformOrigin: "top" },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: secRef.current, start: "top 70%", end: "bottom 80%", scrub: 1 } });
    gsap.utils.toArray<HTMLElement>(".exp-item").forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, x: -40, filter: "blur(6px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 87%" }, delay: i * 0.04 });
    });
  }, []);

  return (
    <section ref={secRef} id="experience" className="bg-[hsl(var(--bg))] py-10 md:py-14">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-8">
          <div className="overflow-hidden mb-2">
            <KW text="Career" tag="div" className="text-[9px] text-[hsl(var(--muted))] uppercase tracking-[0.38em] font-semibold" />
          </div>
          <div className="overflow-hidden">
            <KW text="Work experience" tag="h2" delay={0.04} className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-none" />
          </div>
        </div>

        <div className="relative">
          <div ref={lineRef} className="absolute left-0 md:left-7 top-0 bottom-0 w-px bg-[hsl(var(--stroke))]/60" />
          <div className="space-y-7 pl-6 md:pl-20">
            {exp.map((e, i) => (
              <div key={i} className="exp-item relative">
                <div className={`absolute -left-6 md:-left-20 top-1.5 w-2.5 h-2.5 rounded-full border-2 ${e.current ? "border-[#89AACC] bg-[#4E85BF] dot-glow" : "border-[hsl(var(--stroke))] bg-[hsl(var(--bg))]"}`} />
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 mb-3">
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-[hsl(var(--text))] leading-snug">{e.role}</h3>
                    <p className="text-xs text-[hsl(var(--muted))] mt-0.5">{e.company}</p>
                  </div>
                  <span className={`text-[9px] font-medium px-2.5 py-1 rounded-full border flex-shrink-0 self-start ${e.current ? "border-[#4E85BF]/40 text-[#89AACC] bg-[#4E85BF]/10" : "border-[hsl(var(--stroke))] text-[hsl(var(--muted))]"}`}>
                    {e.period}
                  </span>
                </div>
                <ul className="space-y-1">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs text-[hsl(var(--muted))] leading-relaxed">
                      <span className="w-1 h-1 rounded-full bg-[hsl(var(--stroke))]/70 flex-shrink-0 mt-1.5" />{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. STATS
// ════════════════════════════════════════════════════════════════════════════
export function StatsSection() {
  const stats = [
    { n: 6, s: "+", l: "Years Experience" },
    { n: 50, s: "+", l: "Projects Shipped" },
    { n: 3, s: "", l: "Certifications" },
  ];
  return (
    <section className="bg-[hsl(var(--bg))] py-10 border-y border-[hsl(var(--stroke))]/30">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16,1,0.3,1] }}
              className="p-4 md:p-6 bg-[hsl(var(--surface))]/10 rounded-xl border border-[hsl(var(--stroke))]/20 text-center md:text-left">
              <div className="text-4xl md:text-6xl font-display font-bold leading-none mb-1.5 accent-gradient-text">
                <SlotCount target={s.n} suffix={s.s} />
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[hsl(var(--muted))] font-semibold">{s.l}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 8. EXPLORATIONS — parallax gallery
// ════════════════════════════════════════════════════════════════════════════
export function ExplorationsSection() {
  const [active, setActive] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const imgs = [
    { url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800", r: "rotate-[-2deg]" },
    { url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800", r: "rotate-[1.5deg]" },
    { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", r: "rotate-[-1deg]" },
    { url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800", r: "rotate-[2deg]" },
    { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800", r: "rotate-[-1.5deg]" },
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800", r: "rotate-[1deg]" },
  ];

  useEffect(() => {
    ScrollTrigger.batch(".exp-card", {
      onEnter: els => gsap.fromTo(els,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.08, ease: "power3.out" }),
      start: "top 88%",
    });
  }, []);

  return (
    <section ref={sectionRef} id="explorations" className="relative bg-[hsl(var(--bg))] w-full select-none py-10 md:py-14">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-10">
          <div>
            <div className="overflow-hidden mb-1">
              <KW text="Explorations" tag="div" className="text-[9px] text-[hsl(var(--muted))] uppercase tracking-[0.38em] font-semibold" />
            </div>
            <div className="overflow-hidden">
              <KW text="Visual playground" tag="h2" delay={0.04} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-none" />
            </div>
          </div>
          <p className="text-xs text-[hsl(var(--muted))] max-w-[200px] sm:text-right leading-relaxed">
            Design experiments and side-project explorations.
          </p>
        </div>

        {/* Grid — 2 cols mobile, 3 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {imgs.map((img, i) => (
            <div key={i} className="exp-card opacity-0">
              <Tilt strength={8} className={`aspect-square w-full rounded-xl md:rounded-2xl border border-[hsl(var(--stroke))]/60 bg-[hsl(var(--surface))]/50 overflow-hidden relative cursor-pointer group shadow-lg ${img.r}`}>
                <img src={img.url} loading="lazy" alt=""
                  className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  onClick={() => setActive(img.url)}>
                  <span className="text-[9px] uppercase tracking-widest text-white/90 font-bold bg-black/50 px-3 py-1.5 rounded-full border border-white/15 pointer-events-none">
                    Preview
                  </span>
                </div>
                <div className="absolute inset-0" onClick={() => setActive(img.url)} />
              </Tilt>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 bg-black/92 backdrop-blur-xl z-[99999] flex items-center justify-center p-4 cursor-zoom-out">
            <motion.div
              initial={{ scale: 0.88, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.9, opacity: 0, filter: "blur(16px)" }}
              transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
              className="relative w-full max-w-4xl rounded-2xl border border-white/10 overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <img src={active} alt="Preview" className="w-full h-auto object-contain max-h-[85vh]" />
              <button onClick={() => setActive(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 border border-white/10 text-white rounded-full w-8 h-8 flex items-center justify-center text-[10px] cursor-pointer transition-colors">✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 9. CONTACT FOOTER
// ════════════════════════════════════════════════════════════════════════════
export function ContactFooter() {
  const mRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mRef.current) return;
    const a = gsap.to(mRef.current, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
    return () => { a.kill(); };
  }, []);

  // Clip-path reveal on CTA
  const ctaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ctaRef.current) return;
    gsap.fromTo(ctaRef.current,
      { clipPath: "inset(0 100% 0 0)", opacity: 0 },
      { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1.2, ease: "power4.out",
        scrollTrigger: { trigger: ctaRef.current, start: "top 85%" } }
    );
  }, []);

  const txt = "OPEN TO OPPORTUNITIES • LET'S BUILD TOGETHER • ";

  return (
    <section id="contact" className="relative bg-[hsl(var(--bg))] pt-10 pb-6 overflow-hidden border-t border-[hsl(var(--stroke))]/30">
      <GradientOrbs />

      <div className="w-full overflow-hidden border-y border-[hsl(var(--stroke))]/60 bg-[hsl(var(--bg))]/80 backdrop-blur-sm py-3 mb-8">
        <div ref={mRef} className="flex whitespace-nowrap font-display italic text-xl sm:text-3xl text-[hsl(var(--text))]/55 uppercase">
          {Array(14).fill(txt).concat(Array(14).fill(txt)).map((s, i) => <span key={i} className="inline-block px-1">{s}</span>)}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center text-center relative z-10">
        <div ref={ctaRef}>
          <div className="overflow-hidden">
            <KW text="Let's build" tag="h2" className="text-3xl sm:text-5xl md:text-7xl font-display font-bold leading-none" />
          </div>
          <div className="overflow-hidden">
            <KW text="together." tag="h2" delay={0.08} className="text-3xl sm:text-5xl md:text-7xl font-display italic leading-none" />
          </div>
        </div>
        <p className="text-xs text-[hsl(var(--muted))] max-w-xs mt-4 mb-8 leading-relaxed">
          Available for frontend contracts, React/Drupal work, and full-time roles.
        </p>

        <Mag>
          <a href="mailto:aakkiibb@live.com"
            className="inline-flex rounded-full p-[1.5px] relative overflow-hidden group cursor-pointer mb-8 shadow-2xl">
            <div className="absolute inset-0 accent-gradient animate-gradient-shift rounded-full" />
            <div className="bg-[hsl(var(--bg))] px-7 py-3.5 rounded-full relative z-10 text-sm font-semibold tracking-wide flex items-center gap-2 group-hover:bg-transparent transition-colors">
              aakkiibb@live.com
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform inline-block">↗</span>
            </div>
          </a>
        </Mag>

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-[hsl(var(--stroke))]/20">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-[hsl(var(--muted))] font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            Available for projects
          </div>
          <div className="flex gap-5 text-[11px] text-[hsl(var(--muted))]">
            {[{ l:"LinkedIn", h:"https://linkedin.com/in/aakkiibb" },{ l:"GitHub", h:"https://github.com/auqibyousuf" }].map(lk => (
              <a key={lk.l} href={lk.h} target="_blank" rel="noopener noreferrer"
                className="underline-draw hover:text-[hsl(var(--text))] transition-colors">{lk.l}</a>
            ))}
          </div>
          <div className="text-[8px] text-[hsl(var(--muted))] uppercase tracking-widest opacity-40">© 2026 Auqib Yousuf Ahangar</div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!loading) setTimeout(initLenis, 80); }, [loading]);

  return (
    <div className="bg-[hsl(var(--bg))] text-[hsl(var(--text))] font-sans antialiased min-h-screen relative w-full">
      <SvgFilters />
      <GrainOverlay />
      <AmbientGlow />
      <CustomCursor />
      <ScrollBar />
      <ClickRipple />

      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative w-full">
          <HeroSection />
          <AboutSection />
          <WorksSection />
          <SkillsMarquee />
          <ExperienceSection />
          <ExplorationsSection />
          <StatsSection />
          <ContactFooter />
        </motion.div>
      )}
    </div>
  );
}
