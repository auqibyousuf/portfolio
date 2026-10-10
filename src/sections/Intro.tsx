import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import { MapPin } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { GithubIcon, LinkedinIcon } from "../components/icons";
import { SectionScene } from "../components/SectionScene";
import { Reveal } from "../components/Reveal";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.28em]">
      {word}
    </motion.span>
  );
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    const unsub = value.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, to, suffix, value]);
  return <span ref={ref}>{`${to}${suffix}`}</span>;
}

function useIstClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: true }));
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function Intro() {
  const p = PORTFOLIO_DATA.profile;
  const clock = useIstClock();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = p.bio.split(" ");

  return (
    <section id="intro" className="overflow-hidden relative pt-32 sm:pt-36 pb-24 px-6 sm:px-12">
      <SectionScene scene="constellation" strength={0.7} />
      <div className="mx-auto max-w-[1200px]">
        <header className="min-h-[78svh] flex flex-col justify-center pb-20">
          <Reveal>
            <p className="inline-flex items-center gap-3 rounded-full border border-line bg-white/[0.04] px-4 py-2 text-xs text-ink/85">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-leaf opacity-60 animate-ping motion-reduce:animate-none" />
                <span className="relative h-2 w-2 rounded-full bg-leaf" />
              </span>
              {p.availability}
              <span className="hidden sm:inline h-3 w-px bg-line" />
              <span className="hidden sm:inline tabular-nums text-mute">Bangalore {clock} IST</span>
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-8 text-5xl sm:text-7xl lg:text-[6.5rem] font-light tracking-tight leading-[1.02] text-ink">
              {p.name}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 text-xl sm:text-2xl font-light text-leaf">{p.title}</p>
          </Reveal>
          <Reveal delay={0.24} className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#work" className="rounded-full bg-ink px-7 py-3.5 text-sm text-bg transition-colors hover:bg-leaf">
              View selected work
            </a>
            <a href="#architecture" className="rounded-full border border-line px-7 py-3.5 text-sm text-ink transition-colors hover:border-leaf hover:text-leaf">
              Architecture sandbox
            </a>
          </Reveal>
        </header>

        <Reveal>
          <p className="eyebrow mb-8">About</p>
        </Reveal>

        <div ref={ref}>
          <p className="text-3xl sm:text-5xl lg:text-[3.4rem] font-light tracking-tight leading-[1.15] text-ink max-w-[22ch] sm:max-w-none">
            {words.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 3) / words.length)]} />
            ))}
          </p>
        </div>

        <Reveal className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-mute">
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 text-leaf" /> {p.location}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-leaf opacity-60 animate-ping motion-reduce:animate-none" />
              <span className="relative rounded-full h-2 w-2 bg-leaf" />
            </span>
            {p.availability}
          </span>
          <span className="inline-flex items-center gap-4">
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ink transition-colors">
              <GithubIcon /> GitHub
            </a>
            <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ink transition-colors">
              <LinkedinIcon /> LinkedIn
            </a>
          </span>
        </Reveal>

        <dl className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-line bg-line">
          {PORTFOLIO_DATA.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-bg/90 p-6 sm:p-8">
              <dt className="eyebrow !text-mute mb-4">{s.label}</dt>
              <dd className="text-5xl sm:text-6xl font-light tracking-tight text-ink">
                <Counter to={s.number} suffix={s.suffix} />
              </dd>
              <p className="mt-3 text-xs leading-relaxed text-mute">{s.description}</p>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
