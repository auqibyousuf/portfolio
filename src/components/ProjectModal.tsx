import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import type { ProjectItem } from "../data/portfolioData";

export function ProjectModal({ project, onClose }: { project: ProjectItem | null; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const prev = document.activeElement as HTMLElement | null;
    const focusable = () => Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    dialog.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <div className="fixed inset-0 bg-ink/50 backdrop-blur-md" />
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            tabIndex={-1}
            initial={{ y: 30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-card bg-paper p-6 shadow-lift outline-none sm:p-10"
          >
            <button type="button" onClick={onClose} aria-label="Close project details" className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-white shadow-card transition-colors hover:text-accent cursor-pointer">
              <X className="h-4 w-4" />
            </button>

            <p className="label !text-accent pr-14">{project.category}</p>
            <h3 className="h-display mt-3 pr-14 text-3xl sm:text-5xl">{project.title}</h3>
            <p className="mt-3 text-sm text-mute">{project.clientOrProduct} · {project.companyContext}</p>

            <div className="mt-7 aspect-[16/8] overflow-hidden rounded-3xl bg-soft">
              <img src={project.image} alt="" className="h-full w-full object-cover" />
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-3">
              {project.stats.slice(0, 3).map((s) => (
                <div key={s.label} className="card !rounded-2xl p-4">
                  <dd className="text-base font-semibold text-ink">{s.value}</dd>
                  <dt className="label mt-1 !text-[10px]">{s.label}</dt>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-base leading-relaxed text-mute">{project.description}</p>

            <h4 className="label mt-9 mb-4 !text-accent">Architecture highlights</h4>
            <ul className="space-y-3">
              {project.architecturalHighlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-mute">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-8 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t} className="tag">{t}</li>
              ))}
            </ul>

            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent mt-9">
                Visit live site <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
