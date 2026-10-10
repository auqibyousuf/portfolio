import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "../data/site";
import { Character } from "../components/Character";
import { Ticker } from "../components/Ticker";
import type { ProjectItem } from "../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

export function About({ onSelect }: { onSelect: (p: ProjectItem) => void }) {
  const root = useRef<HTMLElement>(null);
  const { about } = SITE;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      gsap.from(q(".about-line"), {
        yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(q(".about-in"), {
        y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });
      gsap.from(q(".about-char"), {
        x: -60, opacity: 0, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 65%" },
      });
      gsap.to(q(".about-orb"), {
        yPercent: -22, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  const lines = about.title.split(". ").length > 1 ? about.title.split(". ") : [about.title];

  return (
    <section id="about" ref={root} className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="about-orb absolute -right-24 top-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div aria-hidden="true" className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-ink/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="about-char relative mx-auto w-full max-w-[400px]">
          <div aria-hidden="true" className="absolute inset-x-6 bottom-4 top-12 rounded-[40%] bg-gradient-to-t from-accent/15 to-transparent" />
          <div className="float relative">
            <Character pose="thumbs-up" className="relative mx-auto h-[min(70svh,600px)] w-auto drop-shadow-[0_26px_34px_rgba(15,18,24,0.16)]" title="Auqib giving a thumbs up" />
          </div>
        </div>

        <div>
          <p className="about-in section-no mb-5">01 &nbsp;/&nbsp; ABOUT</p>
          <h2 className="h-display text-[clamp(2.2rem,5vw,4rem)]">
            {lines.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em]">
                <span className="about-line block">{l}{i < lines.length - 1 ? "." : ""}</span>
              </span>
            ))}
          </h2>
          <div className="mt-7 space-y-4 text-base leading-relaxed text-mute sm:text-lg">
            {about.paragraphs.map((p) => (
              <p key={p} className="about-in">{p}</p>
            ))}
          </div>

          <dl className="about-in mt-9 grid gap-3 sm:grid-cols-2">
            {about.facts.map((f) => (
              <div key={f.label} className="card !rounded-2xl px-5 py-4">
                <dt className="label">{f.label}</dt>
                <dd className="mt-1.5 text-sm font-semibold leading-snug text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="about-in mt-9">
            <p className="label mb-3">Selected work</p>
            <ul className="flex flex-wrap gap-2.5">
              {about.selected.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => onSelect(p)} className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold shadow-card transition-colors hover:border-accent hover:text-accent cursor-pointer">
                    {p.clientOrProduct}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Ticker items={["EDUCATION", "TRAINING", "SELECTED WORK", "AVAILABLE FOR SENIOR ROLES"]} className="relative mt-20 border-y border-line py-3 text-mute" />
    </section>
  );
}
