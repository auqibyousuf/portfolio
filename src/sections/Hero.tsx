import { SylvaHero } from "../shaders/landing-pages/SylvaHero";
import { ArrowDown } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";

/** ThreeUI Sylva hero, Living Green variant, with the exact configured props. */
export function Hero() {
  return (
    <section id="hero" className="relative h-[100svh] w-full overflow-hidden bg-bg">
      <div className="shader-frame absolute inset-0">
        <SylvaHero
          variant="living-green"
          headingFont="lexend"
          bodyFont="lexend"
          headingWeight="300"
          bodyWeight="300"
          primaryColor="#ffffff"
          headingSize={63}
          bodySize={16.5}
          headingLetterSpacing={-0.006}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>

      {/* Portfolio identity, layered outside the authored page so its markup stays untouched. */}
      <a
        href="#intro"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 rounded-full border border-white/25 bg-black/35 backdrop-blur-md px-5 py-2.5 text-xs text-white/90 hover:bg-black/50 transition-colors"
      >
        <span className="hidden sm:inline">{PORTFOLIO_DATA.profile.name}</span>
        <span className="hidden sm:inline h-3 w-px bg-white/30" />
        <span>{PORTFOLIO_DATA.profile.title}</span>
        <ArrowDown className="w-3.5 h-3.5" />
      </a>
    </section>
  );
}
