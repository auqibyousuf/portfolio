import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { SITE } from "../data/site";
import type { ProjectItem } from "../data/portfolioData";
import { Character } from "../components/Character";
import { Ticker } from "../components/Ticker";

/** Streaming-style rail of project cards: scroll-snap, drag-free, with arrow controls. */
export function Projects({ onSelect }: { onSelect: (p: ProjectItem) => void }) {
  const rail = useRef<HTMLUListElement>(null);
  const { projects } = SITE;

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 760), behavior: "smooth" });
  };

  return (
    <section id="projects" className="relative overflow-hidden bg-white py-24 sm:py-32">
      {/* watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.05em]"
        style={{ fontSize: "clamp(8rem, 26vw, 24rem)", color: "transparent", WebkitTextStroke: "2px rgba(15,18,24,0.06)" }}
      >
        WORK
      </span>

      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="section-no mb-5">03 &nbsp;/&nbsp; PROJECTS</p>
            <h2 className="h-display text-[clamp(2.2rem,5vw,4rem)]">{projects.title}</h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-mute">{projects.intro}</p>
        </div>

        {/* banner with a fast ticker */}
        <div className="relative mt-10 overflow-hidden rounded-card bg-ink py-4 text-white shadow-lift">
          <Ticker items={projects.ticker} fast className="text-white" />
        </div>
      </div>

      <div className="relative mt-12">
        {/* pointing character */}
        <div className="pointer-events-none absolute -top-9 left-6 z-10 hidden xl:block" aria-hidden="true">
          <Character pose="point-right" className="h-[250px] w-auto drop-shadow-[0_20px_24px_rgba(15,18,24,0.16)]" />
        </div>

        <ul ref={rail} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-10 pt-6" aria-label="Projects">
          <li aria-hidden="true" className="hidden w-[170px] shrink-0 snap-start xl:block" />
          {projects.items.map((p, i) => (
            <li key={p.id} className="w-[84vw] max-w-[400px] shrink-0 snap-start sm:w-[360px]">
              <button
                type="button"
                onClick={() => onSelect(p)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-card border border-line/60 bg-paper text-left shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-lift cursor-pointer"
              >
                <span className="relative block aspect-[16/11] overflow-hidden bg-soft">
                  <img src={p.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.demoUrl && (
                    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
                    </span>
                  )}
                </span>

                <span className="flex flex-1 flex-col p-6">
                  <span className="label !text-accent">{p.category}</span>
                  <span className="mt-2 font-display text-xl font-semibold leading-tight tracking-tight text-ink">{p.title}</span>
                  <span className="mt-3 text-sm leading-relaxed text-mute">{p.tagline}</span>

                  <span className="mt-5 flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 3).map((t) => (
                      <span key={t} className="tag !bg-white">{t}</span>
                    ))}
                  </span>

                  <span className="mt-auto grid grid-cols-2 gap-2 pt-6">
                    {p.stats.slice(0, 2).map((s) => (
                      <span key={s.label} className="rounded-2xl bg-white px-3 py-2.5">
                        <span className="block text-[13px] font-bold leading-tight text-ink">{s.value}</span>
                        <span className="label mt-0.5 block !text-[9px]">{s.label}</span>
                      </span>
                    ))}
                  </span>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-accent">
                    Read case study <ArrowUpRight className="h-4 w-4" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-2 flex max-w-[1280px] justify-end gap-2 px-6">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll projects left" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white shadow-card transition-colors hover:bg-ink hover:text-white cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll projects right" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white shadow-card transition-colors hover:bg-ink hover:text-white cursor-pointer">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
