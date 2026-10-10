import { Award } from "lucide-react";
import { SITE } from "../data/site";
import { Character } from "../components/Character";
import { Ticker } from "../components/Ticker";
import { Reveal } from "../components/Reveal";

export function Achievements() {
  const { achievements: a } = SITE;
  return (
    <section id="achievements" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <Reveal className="mb-12 flex items-end justify-between gap-8 lg:mb-0">
          <div className="max-w-3xl lg:pb-12">
            <p className="section-no mb-5">05 &nbsp;/&nbsp; ACHIEVEMENTS</p>
            <h2 className="h-display text-[clamp(2.2rem,5vw,4rem)]">{a.title}</h2>
          </div>
          <Character pose="sit" className="float-slow -mb-3 mr-6 hidden h-[250px] w-auto shrink-0 drop-shadow-[0_18px_22px_rgba(15,18,24,0.14)] lg:block" />
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {a.highlights.map((h, i) => (
              <Reveal key={h.label} delay={i * 0.06}>
                <article className="card h-full p-6 transition-transform duration-300 hover:-translate-y-1">
                  <p className="font-display text-5xl font-semibold tracking-tight text-accent">{h.value}</p>
                  <p className="mt-3 font-display text-lg font-semibold leading-tight tracking-tight">{h.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{h.text}</p>
                  <p className="label mt-4 !text-[10px]">{h.source}</p>
                </article>
              </Reveal>
            ))}
            {a.certifications.map((c, i) => (
              <Reveal key={c.name} delay={0.2 + i * 0.06}>
                <article className="flex h-full items-start gap-4 rounded-card border border-line bg-white/70 p-6 backdrop-blur">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink text-white">
                    <Award className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display text-base font-semibold leading-snug tracking-tight">{c.name}</span>
                    <span className="label mt-1.5 block !text-[10px]">{c.issuer}</span>
                  </span>
                </article>
              </Reveal>
            ))}
          </div>

          {/* bold accent feature card */}
          <Reveal delay={0.1}>
            <article className="relative flex min-h-[480px] flex-col overflow-hidden rounded-card bg-accent p-8 text-white shadow-lift sm:p-10 lg:h-full">
              <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
              <p className="label !text-white/70">Feature</p>
              <p className="mt-3 font-display text-[clamp(5rem,12vw,9rem)] font-semibold leading-[0.9] tracking-[-0.05em]">{a.feature.value}</p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-tight">{a.feature.label}</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/85">{a.feature.text}</p>
              <p className="label mt-auto pt-8 !text-white/60">{a.feature.source}</p>
            </article>
          </Reveal>
        </div>

        <Ticker items={a.ticker} className="mt-10 border-y border-line py-3 text-mute" />
      </div>
    </section>
  );
}
