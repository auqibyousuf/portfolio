import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import type { ProjectItem } from "../data/portfolioData";

export function ProjectModal({ project, onClose }: { project: ProjectItem | null; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const prev = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? []);
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
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xl" />
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            tabIndex={-1}
            initial={{ y: 30, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-4xl max-h-[90svh] overflow-y-auto rounded-3xl border border-line bg-moss p-6 sm:p-10 outline-none"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full border border-line bg-bg text-ink hover:text-leaf transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="eyebrow mb-3 pr-12">{project.category}</p>
            <h3 className="text-3xl sm:text-4xl font-light tracking-tight text-ink pr-12">{project.title}</h3>
            <p className="mt-3 text-sm text-mute">{project.clientOrProduct} · {project.companyContext}</p>

            <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-2xl border border-line bg-bg">
              <img src={project.image} alt="" className="h-full w-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-moss/80 to-transparent" />
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-3">
              {project.stats.slice(0, 3).map((s) => (
                <div key={s.label} className="rounded-2xl border border-line bg-white/[0.03] p-4">
                  <dd className="text-base text-ink">{s.value}</dd>
                  <dt className="mt-1 text-[10px] uppercase tracking-widest text-mute">{s.label}</dt>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-sm sm:text-base leading-relaxed text-mute">{project.description}</p>

            <h4 className="eyebrow mt-10 mb-4">Architecture highlights</h4>
            <ul className="space-y-3">
              {project.architecturalHighlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-mute">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-leaf" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-8 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t} className="chip">{t}</li>
              ))}
            </ul>

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-bg hover:bg-leaf transition-colors"
              >
                Visit live site <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
