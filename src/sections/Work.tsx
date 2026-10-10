import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PORTFOLIO_DATA, type ProjectItem } from "../data/portfolioData";

const projects = PORTFOLIO_DATA.projects;
const N = projects.length;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Pinned 3D gallery. Scrolling moves a coverflow of project cards through perspective space: the focused card
 * faces you and follows the pointer, neighbours turn away and recede. Cards are real DOM, so text stays crisp
 * and every card is a button.
 */
export function Work({ onSelect }: { onSelect: (p: ProjectItem) => void }) {
  const wrapper = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    let raf = 0;
    let current = 0;
    let visible = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    function tick() {
      if (!visible || !el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const target = span > 0 ? clamp(-r.top / span, 0, 1) * (N - 1) : 0;
      current = reduced ? target : current + (target - current) * 0.12;

      cards.current.forEach((c, i) => {
        if (!c) return;
        const d = i - current;
        const ad = Math.abs(d);
        const focus = Math.max(0, 1 - ad);
        c.style.visibility = ad > 3.3 ? "hidden" : "visible";
        if (ad > 3.3) return;
        const fade = 1 - clamp((ad - 2.4) / 0.9, 0, 1);
        const x = d * 62 + Math.tanh(d) * 16; // % of the card's own width
        const z = -Math.min(ad, 3) * 170 - (ad > 0.5 ? 40 : 0);
        const ry = -Math.tanh(d * 1.1) * 42 + pointer.current.x * 7 * focus;
        const rx = -pointer.current.y * 5 * focus;
        const s = 0.82 + focus * 0.2;
        c.style.transform = `translate(-50%,-50%) translate3d(${x}%,0,${z}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${s})`;
        c.style.opacity = String(fade);
        c.style.filter = `brightness(${(0.5 + focus * 0.5).toFixed(2)})`;
        c.style.zIndex = String(100 - Math.round(ad * 10));
        c.style.pointerEvents = ad < 2.6 ? "auto" : "none";
      });

      const i = Math.round(current);
      setIndex((prev) => (prev === i ? prev : i));
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const goTo = (i: number) => {
    const el = wrapper.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (N - 1)) * span, behavior: "smooth" });
  };

  const project = projects[index];

  return (
    <section id="work" ref={wrapper} className="relative" style={{ height: `${N * 55 + 100}vh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute left-6 sm:left-12 top-24 sm:top-28 right-6 z-30 pointer-events-none">
          <p className="eyebrow mb-3">Selected work</p>
          <h2 className="section-title">Platforms in production</h2>
        </div>

        {/* 3D stage */}
        <div className="absolute inset-x-0 top-[22%] bottom-[30%] sm:top-[24%] sm:bottom-[26%]" style={{ perspective: "1500px", perspectiveOrigin: "50% 45%" }}>
          <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
            {projects.map((p, i) => (
              <button
                key={p.id}
                ref={(node) => {
                  cards.current[i] = node;
                }}
                type="button"
                aria-label={`${p.title}. ${i === index ? "Open details" : "Bring into focus"}`}
                onClick={() => (i === index ? onSelect(p) : goTo(i))}
                className="absolute left-1/2 top-1/2 aspect-[4/3] w-[min(74vw,520px)] overflow-hidden rounded-3xl border border-white/15 bg-moss text-left shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] cursor-pointer will-change-transform"
                style={{ WebkitBoxReflect: "below 10px linear-gradient(transparent 72%, rgba(255,255,255,0.13))" } as React.CSSProperties}
              >
                <img src={p.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80" />
                <span className="absolute inset-0 bg-gradient-to-t from-bg via-bg/35 to-bg/10" />
                <span className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
                <span className="absolute left-5 right-5 top-5 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-ink/70">
                  <span>{String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}</span>
                  <span className="truncate pl-4 text-right">{p.clientOrProduct}</span>
                </span>
                <span className="absolute inset-x-5 bottom-5">
                  <span className="eyebrow mb-2 block !tracking-[0.2em]">{p.category}</span>
                  <span className="block text-xl sm:text-2xl font-light leading-tight tracking-tight text-ink">{p.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Details for the focused card */}
        <div className="absolute inset-x-6 sm:inset-x-12 bottom-6 sm:bottom-10 z-30 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div className="max-w-xl">
            <p className="text-sm leading-relaxed text-mute">{project.tagline}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stats.slice(0, 3).map((s) => (
                <li key={s.label} className="chip">{s.value} · {s.label}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onSelect(project)}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-bg transition-colors hover:bg-leaf cursor-pointer"
          >
            View case study <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute right-4 sm:right-8 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1.5 sm:flex" aria-hidden="true">
          {projects.map((p, i) => (
            <span key={p.id} className={`block w-1 rounded-full transition-all duration-300 ${i === index ? "h-6 bg-leaf" : "h-2 bg-line"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
