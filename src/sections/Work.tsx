import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PORTFOLIO_DATA, type ProjectItem } from "../data/portfolioData";
import { Reveal } from "../components/Reveal";

export function Work({ onSelect }: { onSelect: (p: ProjectItem) => void }) {
  const projects = PORTFOLIO_DATA.projects;
  const [active, setActive] = useState(0);
  const current = projects[active];

  return (
    <section id="work" className="relative py-24 sm:py-32 px-6 sm:px-12">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mb-14 sm:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Selected work</p>
            <h2 className="section-title">Platforms in production</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Enterprise platforms and cloud infrastructure delivered across client accounts and product teams.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-16">
          {/* Sticky preview, desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-line bg-moss">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current.id}
                    src={current.image}
                    alt=""
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 0.85, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="eyebrow mb-2">{current.category}</p>
                  <p className="text-xl font-light text-ink">{current.title}</p>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-3">
                {current.stats.slice(0, 3).map((s) => (
                  <div key={s.label} className="rounded-2xl border border-line bg-white/[0.03] p-4">
                    <dd className="text-base text-ink font-normal leading-tight">{s.value}</dd>
                    <dt className="mt-1 text-[10px] uppercase tracking-widest text-mute">{s.label}</dt>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {current.stack.slice(0, 6).map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Project index */}
          <ul className="divide-y divide-line border-y border-line">
            {projects.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => onSelect(p)}
                  className="group w-full text-left py-6 sm:py-7 flex items-start gap-5 sm:gap-8 cursor-pointer"
                >
                  <span className="pt-1.5 text-xs tabular-nums text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-xl sm:text-2xl font-light tracking-tight transition-colors ${active === i ? "text-leaf" : "text-ink"} group-hover:text-leaf`}>
                      {p.title}
                    </span>
                    <span className="mt-2 block text-xs text-mute">{p.category}</span>
                    <span className="mt-3 block text-sm leading-relaxed text-mute lg:hidden">{p.tagline}</span>
                  </span>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-mute transition-all group-hover:text-leaf group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
