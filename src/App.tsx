import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import {
  PORTFOLIO_DATA,
  type ProjectItem,
} from "./data/portfolioData";
import {
  CinematicBackground,
  type BackgroundMode,
} from "./components/CinematicBackground";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { ThemeToggle } from "./components/ThemeToggle";
import { ProjectModal } from "./components/ProjectModal";
import { DecoupledVisualizer } from "./components/DecoupledVisualizer";
import {
  ArrowUpRight,
  Sparkles,
  MapPin,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  Copy,
  Code2,
  GraduationCap,
  Layers,
  Cpu,
  Cloud,
  Activity,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── SVG Icons for GitHub & LinkedIn ─────────────────────────────────────────
function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

// ─── Smooth Lenis Scroll Initialization ─────────────────────────────────────
let lenisInstance: Lenis | null = null;
function initSmoothScroll() {
  lenisInstance = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenisInstance.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  gsap.ticker.lagSmoothing(0);
}

// ─── Floating Top Pill Navigation ───────────────────────────────────────────
function TopNavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none font-mono">
      <nav aria-label="Main Navigation"
        className={`pointer-events-auto inline-flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full backdrop-blur-2xl border transition-all duration-300 shadow-xl ${
          scrolled
            ? "bg-[hsl(var(--surface))]/90 border-[hsl(var(--stroke))]"
            : "bg-[hsl(var(--surface))]/70 border-[hsl(var(--stroke))]/60"
        }`}
      >
        <button
          onClick={() => lenisInstance?.scrollTo(0)}
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full text-xs font-bold text-[hsl(var(--text))] hover:text-blue-500 transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>AY</span>
        </button>

        <div className="w-px h-3.5 bg-[hsl(var(--stroke))]" />

        <button
          onClick={() => scrollTo("works")}
          className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[hsl(var(--muted))] hover:text-[hsl(var(--text))] transition-colors cursor-pointer"
        >
          Works
        </button>

        <button
          onClick={() => scrollTo("architecture")}
          className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[hsl(var(--muted))] hover:text-[hsl(var(--text))] transition-colors cursor-pointer"
        >
          Architecture
        </button>

        <button
          onClick={() => scrollTo("skills")}
          className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[hsl(var(--muted))] hover:text-[hsl(var(--text))] transition-colors cursor-pointer hidden sm:inline-block"
        >
          Stack
        </button>

        <button
          onClick={() => scrollTo("experience")}
          className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[hsl(var(--muted))] hover:text-[hsl(var(--text))] transition-colors cursor-pointer hidden sm:inline-block"
        >
          Experience
        </button>

        <button
          onClick={() => scrollTo("certifications")}
          className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[hsl(var(--muted))] hover:text-[hsl(var(--text))] transition-colors cursor-pointer"
        >
          Certs
        </button>

        <div className="w-px h-3.5 bg-[hsl(var(--stroke))]" />

        <ThemeToggle />

        <button
          onClick={() => scrollTo("contact")}
          className="px-4 py-1.5 rounded-full bg-[hsl(var(--text))] text-[hsl(var(--bg))] font-bold text-[11px] hover:opacity-85 transition-opacity cursor-pointer"
        >
          Connect
        </button>
      </nav>
    </header>
  );
}

// ─── Custom Magnetic Pointer Component ──────────────────────────────────────
function CustomPointer() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 2.5}px, ${e.clientY - 2.5}px, 0)`;
      }
    };

    let animId: number;
    const render = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.16;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.16;
      if (ringRef.current) {
        const half = ringRef.current.offsetWidth / 2;
        ringRef.current.style.transform = `translate3d(${pos.current.x - half}px, ${pos.current.y - half}px, 0)`;
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    const handleOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-hover]")) {
        ringRef.current?.classList.add("hover");
      } else {
        ringRef.current?.classList.remove("hover");
      }
    };
    const handleDown = () => ringRef.current?.classList.add("click");
    const handleUp = () => ringRef.current?.classList.remove("click");

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}

// ─── Magnetic Wrap Utility ──────────────────────────────────────────────────
function MagneticWrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    gsap.to(el, { x, y, duration: 0.3, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      gsap.to(ref.current, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1, 0.4)" });
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`inline-flex ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// ─── 3D Tilt Card ───────────────────────────────────────────────────────────
function TiltCard({
  children,
  className = "",
  strength = 10,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: x * strength,
      rotateX: -y * strength,
      transformPerspective: 950,
      scale: 1.015,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    if (ref.current) {
      gsap.to(ref.current, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    }
  };

  return (
    <div
      ref={ref}
      className={`card-3d ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 1. INTRO PRELOADER
// ════════════════════════════════════════════════════════════════════════════
function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let animId: number;
    let start: number | null = null;
    const duration = 1400;

    const step = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(((now - start) / duration) * 100, 100);
      setPercent(Math.floor(progress));
      if (progress < 100) {
        animId = requestAnimationFrame(step);
      } else {
        setTimeout(onComplete, 180);
      }
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <motion.aside
      aria-label="Portfolio loader"
      className="fixed inset-0 z-[99999] bg-[hsl(var(--bg))] flex flex-col justify-between p-8 sm:p-14 select-none overflow-hidden font-mono"
      exit={{
        clipPath: "inset(0 0 100% 0)",
        transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--muted))]">
        <span>auqib.dev</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>System Environment Ready</span>
        </span>
      </div>

      <div className="text-center">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-[hsl(var(--text))]">
          Auqib Yousuf Ahangar
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-blue-500 mt-4">
          Senior Frontend & DevOps Engineer • 7+ Years Experience
        </p>
      </div>

      <div className="space-y-3 max-w-xl mx-auto w-full">
        <div className="flex justify-between items-end text-xs text-[hsl(var(--muted))]">
          <span>INITIALIZING JETBRAINS MONO RUNTIME</span>
          <span className="text-[hsl(var(--text))] text-base font-bold">{percent}%</span>
        </div>
        <div className="h-[2px] w-full bg-[hsl(var(--stroke))] overflow-hidden rounded-full">
          <div
            className="h-full bg-blue-500 origin-left transition-transform duration-75"
            style={{ transform: `scaleX(${percent / 100})` }}
          />
        </div>
      </div>
    </motion.aside>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. HERO SECTION
// ════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  const [localTime, setLocalTime] = useState("");
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 60]);
  const heroOpacity = useTransform(scrollY, [450, 800], [1, 0]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen w-full flex flex-col justify-between relative pt-32 pb-12 px-6 sm:px-12 max-w-[1300px] mx-auto z-10 select-none font-mono">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted))]"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[hsl(var(--text))] font-semibold">
            {PORTFOLIO_DATA.profile.availability}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-blue-500" />
            <span>Bangalore / Srinagar, IN</span>
          </span>
          <span className="flex items-center gap-1.5 text-[hsl(var(--text))] font-bold">
            <Clock className="w-3 h-3 text-sky-500" />
            <span>{localTime || "IST"}</span>
          </span>
        </div>
      </motion.div>

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="my-auto py-10 flex flex-col items-start"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] text-[11px] text-blue-500 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>7 Years • Frontend Architecture & Cloud DevOps</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[hsl(var(--text))] leading-[1.02] mb-6">
          Auqib Yousuf Ahangar.
        </h1>

        <p className="text-base sm:text-xl text-[hsl(var(--muted))] font-normal max-w-3xl leading-relaxed mb-10 font-sans">
          Frontend Engineer with 7 years of experience building scalable, high-performance web applications across{" "}
          <span className="text-[hsl(var(--text))] font-semibold underline decoration-blue-500/50 underline-offset-4">
            React, Next.js, and Headless CMS Ecosystems
          </span>
          , paired with 3+ years of cloud infrastructure, Kubernetes containerization, Terraform & Ansible IaC, and GitOps CI/CD delivery.
        </p>

        <div className="flex flex-wrap items-center gap-4 font-mono">
          <MagneticWrap>
            <button
              onClick={() =>
                document.getElementById("works")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-7 py-3.5 rounded-full bg-[hsl(var(--text))] text-[hsl(var(--bg))] font-bold text-xs tracking-wider uppercase hover:opacity-85 transition-opacity flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <span>View Case Studies</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </MagneticWrap>

          <MagneticWrap>
            <button
              onClick={() =>
                document.getElementById("architecture")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-7 py-3.5 rounded-full bg-[hsl(var(--surface))] hover:opacity-80 border border-[hsl(var(--stroke))] text-[hsl(var(--text))] font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <span>Architecture Sandbox</span>
              <Code2 className="w-4 h-4 text-blue-500" />
            </button>
          </MagneticWrap>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[hsl(var(--stroke))] font-mono"
      >
        {PORTFOLIO_DATA.stats.map((s, i) => (
          <div key={i} className="flex flex-col">
            <div className="text-2xl sm:text-3xl font-bold text-[hsl(var(--text))] mb-1">
              <span>{s.number}</span>
              <span className="text-blue-500">{s.suffix}</span>
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[hsl(var(--text))]">
              {s.label}
            </div>
            <div className="text-[11px] text-[hsl(var(--muted))] mt-0.5 hidden sm:block font-sans">
              {s.description}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. FEATURED PROJECTS (3-COLUMN RESPONSIVE GRID)
// ════════════════════════════════════════════════════════════════════════════
function WorksShowcase({ onSelectProject }: { onSelectProject: (p: ProjectItem) => void }) {
  return (
    <section id="works" className="py-24 px-6 sm:px-12 max-w-[1300px] mx-auto z-10 relative font-mono">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-blue-500 mb-2">
            Production Portfolio
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[hsl(var(--text))] leading-tight">
            Featured Projects
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[hsl(var(--muted))] max-w-md leading-relaxed font-sans">
          Key enterprise platforms and digital products delivered across client accounts and organizational teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {PORTFOLIO_DATA.projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: idx * 0.08 }}
          >
            <TiltCard
              strength={5}
              className="group relative rounded-2xl overflow-hidden bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] p-5 sm:p-6 flex flex-col justify-between min-h-[460px] cursor-pointer shadow-lg hover:border-blue-500/80 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              {/* Subtle visual backdrop */}
              <div
                className="absolute inset-0 z-0 opacity-10 dark:opacity-20 group-hover:opacity-30 transition-opacity duration-700 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${project.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface))] via-[hsl(var(--surface))]/95 to-[hsl(var(--surface))]/70 z-0" />
              
              {/* Corner accent glow on hover */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />

              {/* Card Header: Tech metadata & index bar */}
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[hsl(var(--stroke))]/60">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-[hsl(var(--muted))] tracking-widest uppercase">
                      SYS.{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <span
                    className={`text-[8.5px] uppercase font-mono font-semibold px-2 py-0.5 rounded-md border tracking-wider ${
                      project.companyContext.includes("GitHub")
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : project.companyContext.includes("Platform") || project.companyContext.includes("Client")
                        ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                    }`}
                  >
                    {project.companyContext.includes("GitHub")
                      ? "Open Source"
                      : project.companyContext.includes("Platform") || project.companyContext.includes("Client")
                      ? "Production"
                      : "Enterprise"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-blue-600 dark:text-[#89AACC]">
                      {project.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[hsl(var(--text))] mt-1 leading-snug group-hover:text-blue-500 transition-colors">
                      {project.title}
                    </h3>
                    <div className="text-[10.5px] text-[hsl(var(--muted))] mt-0.5 font-mono">
                      {project.clientOrProduct}
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--bg))] group-hover:bg-blue-500 group-hover:text-white text-[hsl(var(--text))] border border-[hsl(var(--stroke))] flex items-center justify-center transition-all duration-300 shadow-sm flex-shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Footer: Tagline, Metrics & Specs */}
              <div className="relative z-10 mt-auto pt-4">
                <p className="text-xs text-[hsl(var(--muted))] mb-4 line-clamp-3 leading-relaxed font-sans">
                  {project.tagline}
                </p>

                {/* Metrics ribbon */}
                <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded-xl bg-[hsl(var(--bg))]/90 backdrop-blur-sm border border-[hsl(var(--stroke))] mb-3.5 shadow-inner">
                  {project.stats.map((st) => (
                    <div key={st.label} className="text-center sm:text-left">
                      <div className="text-xs sm:text-sm font-bold text-[hsl(var(--text))] font-mono truncate">
                        {st.value}
                      </div>
                      <div className="text-[7.5px] uppercase tracking-wider text-[hsl(var(--muted))] font-mono truncate">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags and CTA */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[hsl(var(--stroke))]/40">
                  <div className="flex flex-wrap gap-1">
                    {project.stack.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] text-[hsl(var(--text))]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onSelectProject(project)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    <span>View Specs</span>
                    <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. DECOUPLED ARCHITECTURE & DEVOPS SANDBOX
// ════════════════════════════════════════════════════════════════════════════
function ArchitectureSection() {
  return (
    <section id="architecture" className="py-20 px-6 sm:px-12 max-w-[1300px] mx-auto z-10 relative font-mono">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-blue-500 block mb-2">
          Engineering Sandbox
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold text-[hsl(var(--text))] mb-3">
          Headless CMS to Cloud Delivery Pipeline
        </h2>
        <p className="text-xs sm:text-sm text-[hsl(var(--muted))] font-sans">
          Explore how modern React & Next.js frontends integrate with any backend CMS, automated Terraform & Ansible IaC, Jenkins CI/CD, AWS EKS Kubernetes GitOps, and ELK observability.
        </p>
      </div>

      <DecoupledVisualizer />
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. VELOCITY SKILLS MARQUEE & COMPREHENSIVE TOOLKIT
// ════════════════════════════════════════════════════════════════════════════
function SkillsSection() {
  const marquee1 = useRef<HTMLDivElement>(null);
  const marquee2 = useRef<HTMLDivElement>(null);

  const row1 = [
    "React.js",
    "Next.js",
    "TypeScript",
    "Drupal 10/11",
    "SDC & Twig",
    "Tailwind CSS",
    "Core Web Vitals",
    "WCAG Compliance",
  ];
  const row2 = [
    "AWS EKS / EC2",
    "Kubernetes & Helm",
    "Docker Containerization",
    "Terraform & Ansible",
    "ArgoCD GitOps",
    "Jenkins & GitHub Actions",
    "ELK Stack & DataDog",
    "Apache Kafka",
  ];

  useEffect(() => {
    const t1 = gsap.to(marquee1.current, {
      xPercent: -50,
      ease: "none",
      duration: 32,
      repeat: -1,
    });
    const t2 = gsap.to(marquee2.current, {
      xPercent: 50,
      ease: "none",
      duration: 36,
      repeat: -1,
    });
    return () => {
      t1.kill();
      t2.kill();
    };
  }, []);

  return (
    <section id="skills" className="py-20 border-y border-[hsl(var(--stroke))] bg-[hsl(var(--surface))]/40 overflow-hidden relative z-10 font-mono">
      <div className="max-w-[1300px] mx-auto px-6 mb-8 text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--muted))] font-bold">
          Technical Toolkit • Frontend & DevOps Synthesis
        </span>
      </div>

      <div className="overflow-hidden mb-3">
        <div ref={marquee1} className="flex whitespace-nowrap gap-3" style={{ width: "200%" }}>
          {[...row1, ...row1].map((skill, i) => (
            <div
              key={i}
              className="px-5 py-2 rounded-full bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] text-xs font-medium text-[hsl(var(--text))] flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden mb-12">
        <div
          ref={marquee2}
          className="flex whitespace-nowrap gap-3"
          style={{ width: "200%", transform: "translateX(-50%)" }}
        >
          {[...row2, ...row2].map((skill, i) => (
            <div
              key={i}
              className="px-5 py-2 rounded-full bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] text-xs font-medium text-[hsl(var(--text))] flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modern 2026 Structured Category Matrix */}
      <div className="max-w-[1300px] mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {Object.entries(PORTFOLIO_DATA.skillsMatrix).map(([category, items], catIdx) => {
          const catMeta = [
            {
              icon: <Layers className="w-4 h-4 text-blue-500" />,
              code: "STACK.01",
              accent: "from-blue-500/10 via-transparent to-transparent",
              badge: "Frontend UI",
            },
            {
              icon: <Cpu className="w-4 h-4 text-cyan-500" />,
              code: "STACK.02",
              accent: "from-cyan-500/10 via-transparent to-transparent",
              badge: "Headless CMS",
            },
            {
              icon: <Cloud className="w-4 h-4 text-indigo-500" />,
              code: "STACK.03",
              accent: "from-indigo-500/10 via-transparent to-transparent",
              badge: "Cloud / AWS",
            },
            {
              icon: <Activity className="w-4 h-4 text-rose-500" />,
              code: "STACK.04",
              accent: "from-rose-500/10 via-transparent to-transparent",
              badge: "Observability",
            },
          ][catIdx] || {
            icon: <Code2 className="w-4 h-4 text-blue-500" />,
            code: `STACK.0${catIdx + 1}`,
            accent: "from-blue-500/10 via-transparent to-transparent",
            badge: "Core Stack",
          };

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            >
              <TiltCard
                strength={6}
                className="group relative h-full rounded-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] p-5 sm:p-6 flex flex-col justify-between overflow-hidden shadow-lg hover:border-blue-500/70 hover:shadow-xl transition-all duration-300"
              >
                {/* Ambient top corner glow */}
                <div
                  className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${catMeta.accent} opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Category Header Bar */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[hsl(var(--stroke))]/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] flex items-center justify-center group-hover:scale-110 transition-transform">
                        {catMeta.icon}
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider text-[hsl(var(--muted))] uppercase">
                        {catMeta.code}
                      </span>
                    </div>

                    <span className="text-[8.5px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] text-[hsl(var(--text))]">
                      {catMeta.badge}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm uppercase font-bold text-[hsl(var(--text))] mb-3.5 tracking-wider group-hover:text-blue-500 transition-colors">
                    {category}
                  </h4>

                  {/* Interactive Tech Badge Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((it) => (
                      <span
                        key={it}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[hsl(var(--bg))]/90 border border-[hsl(var(--stroke))] text-[hsl(var(--text))] hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500 transition-all cursor-default select-none shadow-xs"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-4 mt-4 border-t border-[hsl(var(--stroke))]/40 flex items-center justify-between text-[9px] text-[hsl(var(--muted))] font-mono">
                  <span>{items.length} Production Skills</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. CAREER LASER TIMELINE
// ════════════════════════════════════════════════════════════════════════════
function CareerTimeline() {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 85%",
          scrub: 1.2,
        },
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      id="experience"
      className="py-24 px-6 sm:px-12 max-w-[1300px] mx-auto z-10 relative font-mono"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-blue-500 mb-2 block">
            Professional Experience
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-[hsl(var(--text))]">
            7 Years of Engineering Impact
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[hsl(var(--muted))] max-w-md font-sans">
          End-to-end ownership spanning React/Next.js frontend architectures, Drupal headless systems, and AWS Kubernetes infrastructure.
        </p>
      </div>

      <div className="relative pl-6 md:pl-16">
        <div
          ref={lineRef}
          className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-sky-500 to-indigo-500 laser-glow"
        />

        <div className="space-y-12">
          {PORTFOLIO_DATA.experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.65, delay: idx * 0.1 }}
              className="relative p-6 sm:p-8 rounded-3xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] hover:border-blue-500 transition-all shadow-xl"
            >
              <div
                className={`absolute -left-[31px] md:-left-[71px] top-8 w-4 h-4 rounded-full border-2 ${
                  exp.current
                    ? "bg-blue-500 border-white dot-glow"
                    : "bg-[hsl(var(--bg))] border-[hsl(var(--stroke))]"
                }`}
              />

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[hsl(var(--text))]">
                    {exp.role}
                  </h3>
                  <div className="text-xs font-semibold text-blue-500 mt-0.5">
                    {exp.company} • {exp.location}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-3 py-1 rounded-full border self-start ${
                    exp.current
                      ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                      : "border-[hsl(var(--stroke))] text-[hsl(var(--muted))] bg-[hsl(var(--bg))]"
                  }`}
                >
                  {exp.period}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] text-xs font-medium text-emerald-600 dark:text-emerald-300 mb-4">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Impact: {exp.metrics}</span>
              </div>

              <ul className="space-y-2 mb-6 font-sans">
                {exp.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="text-xs sm:text-sm text-[hsl(var(--muted))] leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[hsl(var(--stroke))]">
                {exp.skills.map((sk) => (
                  <span
                    key={sk}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] text-[hsl(var(--text))]"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. VERIFIED CERTIFICATIONS & ACCREDITATIONS
// ════════════════════════════════════════════════════════════════════════════
function CertificationsSection() {
  return (
    <section id="certifications" className="py-20 px-6 sm:px-12 max-w-[1300px] mx-auto z-10 relative font-mono">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-blue-500 mb-2 block">
            Verified Credentials & Accreditations
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-[hsl(var(--text))]">
            Certifications
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[hsl(var(--muted))] max-w-md font-sans">
          Industry-recognized certifications in frontend engineering, cloud content management, and modern typed architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PORTFOLIO_DATA.certifications.map((cert) => (
          <div
            key={cert.name}
            className="p-6 rounded-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] hover:border-blue-500/80 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  {cert.year}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[hsl(var(--text))] leading-snug group-hover:text-blue-500 transition-colors">
                {cert.name}
              </h3>
            </div>

            <div className="pt-4 mt-4 border-t border-[hsl(var(--stroke))]/60 text-xs text-[hsl(var(--muted))] flex items-center justify-between">
              <span>{cert.issuer}</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 8. HIGH-CONVERTING MAGNETIC FOOTER
// ════════════════════════════════════════════════════════════════════════════
function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <footer id="contact" className="pt-24 pb-12 px-6 sm:px-12 max-w-[1300px] mx-auto z-10 relative font-mono">
      <div className="rounded-3xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-blue-500 mb-4">
          Direct Contact & Engagements
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-[hsl(var(--text))] mb-6 leading-tight">
          Let’s build resilient platforms.
        </h2>

        <p className="text-xs sm:text-sm text-[hsl(var(--muted))] max-w-xl mx-auto mb-10 leading-relaxed font-sans">
          Available for senior frontend consulting, decoupled React + Next.js Drupal architecture, and cloud DevOps engineering.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <MagneticWrap>
            <a
              href={`mailto:${PORTFOLIO_DATA.profile.email}`}
              className="px-7 py-3.5 rounded-full bg-[hsl(var(--text))] text-[hsl(var(--bg))] font-bold text-xs uppercase tracking-wider hover:opacity-85 transition-opacity flex items-center gap-2 shadow-2xl cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>{PORTFOLIO_DATA.profile.email}</span>
            </a>
          </MagneticWrap>

          <MagneticWrap>
            <a
              href={`tel:${PORTFOLIO_DATA.profile.phone}`}
              className="px-6 py-3.5 rounded-full bg-[hsl(var(--bg))] hover:opacity-80 border border-[hsl(var(--stroke))] text-[hsl(var(--text))] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>{PORTFOLIO_DATA.profile.phone}</span>
            </a>
          </MagneticWrap>

          <MagneticWrap>
            <button
              onClick={copyEmail}
              className="px-6 py-3.5 rounded-full bg-[hsl(var(--bg))] hover:opacity-80 border border-[hsl(var(--stroke))] text-[hsl(var(--text))] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Email"}</span>
            </button>
          </MagneticWrap>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-[hsl(var(--stroke))] text-xs text-[hsl(var(--muted))]">
          <div className="flex items-center gap-6">
            <a
              href={PORTFOLIO_DATA.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[hsl(var(--text))] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href={PORTFOLIO_DATA.profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[hsl(var(--text))] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>

          <div>
            © {new Date().getFullYear()} {PORTFOLIO_DATA.profile.name} • {PORTFOLIO_DATA.profile.education.degree} ({PORTFOLIO_DATA.profile.education.years})
          </div>
        </div>
      </div>
    </footer>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN ROOT APP
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [bgMode, setBgMode] = useState<BackgroundMode>("cinematic-video");

  useEffect(() => {
    if (!loading) {
      setTimeout(initSmoothScroll, 80);
    }
  }, [loading]);

  return (
    <div className="bg-[hsl(var(--bg))] text-[hsl(var(--text))] min-h-screen relative w-full overflow-x-hidden transition-colors duration-300">
      <CinematicBackground mode={bgMode} />
      <TopNavBar />
      <CustomPointer />
      <ModeSwitcher currentMode={bgMode} onModeChange={setBgMode} />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <AnimatePresence>
        {loading && <IntroLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <main className="relative z-10">
          <HeroSection />
          <WorksShowcase onSelectProject={setSelectedProject} />
          <ArchitectureSection />
          <SkillsSection />
          <CareerTimeline />
          <CertificationsSection />
          <ContactSection />
        </main>
      )}
    </div>
  );
}
