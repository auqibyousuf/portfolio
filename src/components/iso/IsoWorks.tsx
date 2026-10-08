import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PORTFOLIO_DATA, type ProjectItem } from "../../data/portfolioData";
import { useScrollProgress } from "./useScrollProgress";
import { world } from "./store";

/**
 * HTML layer of the Featured Projects section. The 3D poster gallery lives in the shared
 * backdrop canvas; this component only provides scroll length, copy and controls.
 */
export const IsoWorks: React.FC<{ onSelectProject: (p: ProjectItem) => void }> = ({ onSelectProject }) => {
  const projects = PORTFOLIO_DATA.projects;
  const wrapper = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(wrapper, "sticky");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      world.worksActive = progress.current * (projects.length - 1);
      const i = Math.round(world.worksActive);
      setIndex((prev) => (prev === i ? prev : i));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, projects.length]);

  const project = projects[index];

  return (
    <section id="works" ref={wrapper} style={{ height: `${projects.length * 70 + 100}vh` }} className="relative font-mono">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute top-24 left-6 sm:left-12 right-6 pointer-events-none">
          <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-blue-500 mb-2">Production Portfolio</div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[hsl(var(--text))] leading-tight">Featured Projects</h2>
        </div>

        <div className="absolute bottom-8 left-6 right-6 sm:left-12 sm:right-auto sm:max-w-md rounded-2xl bg-[hsl(var(--surface))]/90 backdrop-blur-md border border-[hsl(var(--stroke))] p-5 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[hsl(var(--muted))] mb-3">
            <span>SYS.{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
            <span className="text-right">{project.category}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[hsl(var(--text))] mb-1">{project.title}</h3>
          <p className="text-xs text-[hsl(var(--muted))] leading-relaxed font-sans mb-4">{project.tagline}</p>
          <button
            onClick={() => onSelectProject(project)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[hsl(var(--text))] text-[hsl(var(--bg))] hover:opacity-85 transition-opacity cursor-pointer"
          >
            View details <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-1.5" aria-hidden="true">
          {projects.map((p, i) => (
            <span key={p.id} className={`block w-1 rounded-full transition-all duration-300 ${i === index ? "h-6 bg-blue-500" : "h-2 bg-[hsl(var(--stroke))]"}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IsoWorks;
