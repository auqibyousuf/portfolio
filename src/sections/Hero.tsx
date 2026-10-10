import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDownRight } from "lucide-react";
import { SITE } from "../data/site";
import { Avatar, Character } from "../components/Character";
import { Magnetic } from "../components/Magnetic";
import { Marquee } from "../components/Ticker";

function Headline() {
  const { headline, emphasis } = SITE.hero;
  return (
    <h1 className="h-display text-[clamp(2.8rem,6.6vw,5.6rem)]">
      {headline.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <span className="hero-line block">
            {line.split(" ").map((w, j) =>
              w === emphasis ? (
                <span key={j} className="relative inline-block text-accent">
                  {w}
                  <svg aria-hidden="true" viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-2.5 w-full">
                    <path d="M2 8C40 2 90 2 120 6s56 2 78-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  {" "}
                </span>
              ) : (
                <span key={j}>{w} </span>
              ),
            )}
          </span>
        </span>
      ))}
    </h1>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);

  // Hide the entrance elements up front and build the timeline paused; it plays once the preloader has gone.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      gsap.set(q(".hero-line"), { yPercent: 110 });
      gsap.set(q(".hero-in"), { y: 36, opacity: 0 });
      gsap.set(q(".hero-char"), { y: 60, opacity: 0, scale: 0.92 });
      gsap.set(q(".hero-bg"), { opacity: 0, scale: 1.06 });
      intro.current = gsap
        .timeline({ paused: true, defaults: { ease: "power4.out" } })
        .to(q(".hero-bg"), { opacity: 1, scale: 1, duration: 1.6 }, 0)
        .to(q(".hero-line"), { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.1)
        .to(q(".hero-in"), { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.35)
        .to(q(".hero-char"), { y: 0, opacity: 1, scale: 1, duration: 1.3 }, 0.2);

      // Mouse parallax: the background word, the character and the floating chips move at different depths.
      const bgX = gsap.quickTo(q(".hero-bgword"), "x", { duration: 1.2, ease: "power3.out" });
      const bgY = gsap.quickTo(q(".hero-bgword"), "y", { duration: 1.2, ease: "power3.out" });
      const chX = gsap.quickTo(q(".hero-stage"), "x", { duration: 0.9, ease: "power3.out" });
      const chY = gsap.quickTo(q(".hero-stage"), "y", { duration: 0.9, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        bgX(nx * -46);
        bgY(ny * -26);
        chX(nx * 22);
        chY(ny * 14);
        root.current?.style.setProperty("--mx", `${(nx + 0.5) * 100}%`);
        root.current?.style.setProperty("--my", `${(ny + 0.5) * 100}%`);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return (
    <section id="top" ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24">
      {/* oversized background typography */}
      <div className="hero-bg pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
        <span
          className="hero-bgword select-none font-display font-extrabold leading-none tracking-[-0.06em]"
          style={{ fontSize: "clamp(8rem, 27vw, 25rem)", color: "transparent", WebkitTextStroke: "2px rgba(15,18,24,0.09)" }}
        >
          {SITE.watermark}
        </span>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-6 px-6 md:grid-cols-[1.08fr_0.92fr]">
        <div className="py-6">
          <div className="hero-in mb-7 flex items-center gap-3">
            <Avatar size={52} />
            <p className="text-sm font-semibold text-ink">{SITE.hero.greeting}</p>
          </div>
          <Headline />
          <p className="hero-in mt-4 font-script text-4xl text-accent sm:text-5xl">{SITE.profile.title}</p>
          <p className="hero-in mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">{SITE.hero.intro}</p>
          <div className="hero-in mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#projects" className="btn btn-primary">
                View selected work <ArrowDownRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn btn-ghost">
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>

        {/* character stage */}
        <div className="hero-stage relative mx-auto w-full max-w-[460px]">
          <div
            aria-hidden="true"
            className="absolute inset-x-[6%] bottom-[2%] top-[14%] rounded-[44%] bg-gradient-to-b from-accent/15 to-accent/0"
            style={{ filter: "blur(2px)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(320px circle at var(--mx,60%) var(--my,35%), rgba(255,255,255,0.85), transparent 60%)", mixBlendMode: "soft-light" }}
          />
          <div className="hero-char float-slow relative">
            <Character pose="stand" priority className="relative mx-auto h-[min(66svh,600px)] w-auto drop-shadow-[0_30px_40px_rgba(15,18,24,0.2)]" title={`${SITE.profile.shortName}`} />
          </div>
          {SITE.hero.chips.map((c, i) => (
            <div
              key={c.label}
              className={`hero-in glass absolute rounded-2xl px-4 py-3 ${i === 0 ? "left-0 top-[22%]" : "bottom-[16%] right-0"}`}
            >
              <p className="font-display text-2xl font-semibold leading-none tracking-tight">{c.value}</p>
              <p className="label mt-1.5 !text-[10px]">{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* dual-layer skills marquee */}
      <div className="hero-in relative mt-4 pb-8">
        <Marquee items={SITE.hero.marqueeTop} />
        <Marquee items={SITE.hero.marqueeBottom} reverse />
      </div>
    </section>
  );
}
