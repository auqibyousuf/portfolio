import React, { useEffect } from "react";
import type { ProjectItem } from "../data/portfolioData";
import { X, ExternalLink, Cpu, Zap, Users2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-2xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[hsl(var(--surface))] border border-[hsl(var(--stroke))] p-6 sm:p-8 md:p-10 shadow-2xl text-[hsl(var(--text))] z-10 custom-scrollbar font-mono"
        >
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 sm:top-7 sm:right-7 w-9 h-9 rounded-full bg-[hsl(var(--bg))] hover:opacity-80 border border-[hsl(var(--stroke))] flex items-center justify-center text-[hsl(var(--text))] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-500 dark:text-[#89AACC]">
              {project.category}
            </span>
            <span className="opacity-30">•</span>
            <span className="text-[10px] uppercase font-medium text-[hsl(var(--muted))] flex items-center gap-1">
              <Users2 className="w-3 h-3 text-blue-500" />
              {project.companyContext}
            </span>
            <span className="opacity-30">•</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Production Verified
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--text))] mb-3">
            {project.title}
          </h2>

          <p className="text-xs sm:text-sm text-[hsl(var(--muted))] leading-relaxed mb-6 max-w-2xl font-sans">
            {project.tagline}
          </p>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[hsl(var(--stroke))] mb-8 bg-[hsl(var(--bg))]">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--surface))] via-transparent to-transparent opacity-80" />
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] mb-8">
            {project.stats.map((s) => (
              <div key={s.label} className="text-center sm:text-left sm:pl-3">
                <div className="text-lg sm:text-2xl font-bold text-[hsl(var(--text))] mb-0.5">
                  {s.value}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-[hsl(var(--muted))]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[hsl(var(--text))] mb-4 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              Architecture & Collaboration Highlights
            </h3>
            <div className="space-y-3 font-sans">
              {project.architecturalHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] text-xs text-[hsl(var(--muted))] leading-relaxed"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[hsl(var(--text))] mb-3">
              Technologies & Standards
            </h3>
            <div className="flex flex-wrap gap-1.5 font-mono">
              {project.stack.map((st) => (
                <span
                  key={st}
                  className="text-[10px] font-medium px-3 py-1.5 rounded-full bg-[hsl(var(--bg))] border border-[hsl(var(--stroke))] text-[hsl(var(--text))]"
                >
                  {st}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[hsl(var(--stroke))]">
            <div className="text-[11px] text-[hsl(var(--muted))] font-sans">
              * Enterprise collaborative engineering project (proprietary codebase).
            </div>
            <div className="flex items-center gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[hsl(var(--text))] text-[hsl(var(--bg))] hover:opacity-85 transition-opacity"
                >
                  <span>Visit Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[hsl(var(--bg))] hover:opacity-80 text-[hsl(var(--text))] transition-colors border border-[hsl(var(--stroke))] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
