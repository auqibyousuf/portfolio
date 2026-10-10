import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2 } from "lucide-react";
import { SITE } from "../data/site";
import { Character } from "../components/Character";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned deck. On desktop the section pins while each role's card slides up over the previous one; on small screens
 * it falls back to a plain vertical list. Cards alternate between a neutral and an accent surface.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);
  const { experience } = SITE;
  const items = experience.items;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".xp-card", root.current!);
      gsap.set(cards.slice(1), { yPercent: 108, autoAlpha: 0 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${(cards.length - 1) * 75}%`, pin: true, scrub: 0.6, anticipatePin: 1 },
      });
      cards.slice(1).forEach((card, i) => {
        tl.to(card, { autoAlpha: 1, duration: 0.05 }, i).to(card, { yPercent: 0, duration: 1 }, i);
        tl.to(cards[i], { scale: 0.94, yPercent: -3, duration: 1 }, i);
      });
      gsap.to(".xp-char", { y: -14, repeat: -1, yoyo: true, duration: 2.4, ease: "sine.inOut" });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="experience" ref={root} className="relative overflow-hidden lg:h-[100svh]">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-24 lg:h-full lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:py-0">
        <div className="relative">
          <p className="section-no mb-5">02 &nbsp;/&nbsp; EXPERIENCE</p>
          <h2 className="h-display text-[clamp(2.2rem,5vw,4rem)]">{experience.title}</h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mute sm:text-lg">{experience.intro}</p>
          <div className="xp-char mt-6 hidden lg:block">
            <Character pose="think" className="mx-auto h-[min(40svh,340px)] w-auto drop-shadow-[0_24px_30px_rgba(15,18,24,0.16)]" title="Auqib thinking" />
          </div>
        </div>

        <div className="relative flex flex-col gap-5 lg:block lg:h-[560px]">
          {items.map((x, i) => {
            const accent = i % 2 === 1;
            return (
              <article
                key={`${x.company}-${x.period}`}
                className={`xp-card flex flex-col rounded-card p-7 shadow-lift sm:p-9 lg:absolute lg:inset-0 ${
                  accent ? "bg-accent text-white" : "border border-line/60 bg-white text-ink"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div>
                    <p className={`font-mono text-xs tracking-[0.2em] ${accent ? "text-white/70" : "text-accent"}`}>
                      {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{x.role}</h3>
                    <p className={`mt-1.5 text-sm font-semibold ${accent ? "text-white/85" : "text-ink/80"}`}>
                      {x.company} <span className={accent ? "text-white/60" : "text-mute"}>· {x.location}</span>
                    </p>
                  </div>
                  <p className={`rounded-full px-4 py-1.5 font-mono text-xs ${accent ? "bg-white/15" : "bg-paper text-mute"}`}>{x.period}</p>
                </div>

                <p className={`mt-6 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold leading-snug ${accent ? "bg-white/15" : "bg-paper"}`}>
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${accent ? "text-white" : "text-accent"}`} />
                  {x.metrics}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {x.bullets.slice(0, 3).map((b) => (
                    <li key={b} className={`flex gap-3 text-sm leading-relaxed ${accent ? "text-white/90" : "text-mute"}`}>
                      <span aria-hidden="true" className={`mt-2 h-1 w-1 shrink-0 rounded-full ${accent ? "bg-white" : "bg-accent"}`} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                  {x.skills.slice(0, 7).map((s) => (
                    <li key={s} className={`rounded-full px-3 py-1 text-xs font-medium ${accent ? "bg-white/15 text-white" : "border border-line bg-paper text-ink/80"}`}>
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
