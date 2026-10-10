import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { Reveal } from "../components/Reveal";

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <section id="experience" className="relative z-10 bg-bg/80 py-24 sm:py-32 px-6 sm:px-12 border-t border-line">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mb-14 sm:mb-20 max-w-3xl">
          <p className="eyebrow mb-4">Experience</p>
          <h2 className="section-title">Seven years of engineering impact</h2>
        </Reveal>

        <ol ref={ref} className="relative ml-3 sm:ml-0 sm:pl-10 border-l border-line">
          <motion.span aria-hidden="true" style={{ scaleY }} className="absolute -left-px top-0 h-full w-px origin-top bg-leaf" />
          {PORTFOLIO_DATA.experiences.map((e) => (
            <li key={`${e.company}-${e.period}`} className="relative pb-16 last:pb-0 pl-8 sm:pl-0">
              <span aria-hidden="true" className="absolute -left-[5px] sm:-left-[45px] top-2 h-2.5 w-2.5 rounded-full bg-leaf ring-4 ring-bg" />
              <Reveal>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-ink">{e.role}</h3>
                  <p className="text-xs tabular-nums text-mute">{e.period}</p>
                </div>
                <p className="mt-2 text-sm text-leaf">
                  {e.company} <span className="text-mute">· {e.location}</span>
                </p>
                <p className="mt-6 max-w-3xl rounded-2xl border border-line bg-white/[0.03] px-5 py-4 text-sm leading-relaxed text-ink">
                  {e.metrics}
                </p>
                <ul className="mt-6 max-w-3xl space-y-3">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed text-mute">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-leaf" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {e.skills.map((s) => (
                    <li key={s} className="chip">{s}</li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
