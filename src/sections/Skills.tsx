import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "../data/site";
import { Character } from "../components/Character";
import { Ticker } from "../components/Ticker";
import { Reveal } from "../components/Reveal";

/** Bento grid. The spotlight card shows the active category; the other categories are tiles that take over on click. */
export function Skills() {
  const { skills } = SITE;
  const names = Object.keys(skills.matrix);
  const [active, setActive] = useState(names[0]);
  const others = names.filter((n) => n !== active);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + names.length) % names.length;
    setActive(names[next]);
    tabs.current[next]?.focus();
  };

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <Reveal className="mb-10 flex items-end justify-between gap-8">
          <div className="max-w-3xl">
            <p className="section-no mb-5">04 &nbsp;/&nbsp; SKILLS</p>
            <h2 className="h-display text-[clamp(2.2rem,5vw,4rem)]">{skills.title}</h2>
          </div>
          <Character pose="point-left" className="float-slow -mb-2 hidden h-[230px] w-auto shrink-0 drop-shadow-[0_20px_24px_rgba(15,18,24,0.14)] md:block" />
        </Reveal>

        <div role="tablist" aria-label="Skill categories" className="mb-6 flex flex-wrap gap-2">
          {names.map((n, i) => (
            <button
              key={n}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`skill-tab-${i}`}
              aria-selected={active === n}
              aria-controls="skill-panel"
              tabIndex={active === n ? 0 : -1}
              onClick={() => setActive(n)}
              onKeyDown={(e) => onKey(e, i)}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                active === n ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/75 hover:border-ink/40"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
          {/* spotlight */}
          <div id="skill-panel" role="tabpanel" aria-labelledby={`skill-tab-${names.indexOf(active)}`} className="card relative overflow-hidden p-7 sm:p-10 lg:col-span-2 lg:row-span-2">
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-2xl" />
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="relative">
                <p className="label !text-accent">Spotlight</p>
                <h3 className="h-display mt-3 text-3xl sm:text-4xl">{active}</h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-mute">{skills.descriptions[active]}</p>
                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {skills.matrix[active as keyof typeof skills.matrix].map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.03 * i }}
                      whileHover={{ y: -3 }}
                      className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink"
                    >
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* character tile */}
          <div className="relative overflow-hidden rounded-card bg-accent p-6 text-white shadow-lift lg:col-span-1 lg:row-span-2">
            <p className="label !text-white/70">In the zone</p>
            <p className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight">Building across the stack.</p>
            <Character pose="code" className="float-slow mx-auto mt-6 h-[320px] w-auto drop-shadow-[0_24px_30px_rgba(0,0,0,0.28)]" title="Auqib coding on a laptop" />
          </div>

          {/* the other categories as tiles */}
          {others.map((n, i) => (
              <button key={n} type="button" onClick={() => setActive(n)} className={`card group p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lift cursor-pointer ${i === 2 ? "lg:col-span-2" : ""}`}>
                <p className="label">{skills.matrix[n as keyof typeof skills.matrix].length} skills</p>
                <p className="mt-2 font-display text-lg font-semibold leading-tight tracking-tight">{n}</p>
                <p className="mt-3 text-xs leading-relaxed text-mute">{skills.matrix[n as keyof typeof skills.matrix].slice(0, 3).join(" · ")}</p>
                <span className="mt-4 inline-block text-xs font-bold text-accent opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100">Spotlight &rarr;</span>
              </button>
          ))}
        </div>

        <Ticker items={skills.ticker} className="mt-8 rounded-full border border-line bg-white py-3 text-ink" />
      </div>
    </section>
  );
}
