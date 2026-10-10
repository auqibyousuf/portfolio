import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolioData";
import { SectionScene } from "../components/SectionScene";
import { Reveal } from "../components/Reveal";

type Exploration = (typeof PORTFOLIO_DATA.explorations)[number];

function Lightbox({ item, onClose }: { item: Exploration | null; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!item) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-10 bg-black/80 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.figure
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-line bg-moss"
          >
            <img src={item.url} alt={`${item.title} — ${item.category}`} className="max-h-[70svh] w-full object-cover" />
            <figcaption className="p-6">
              <p className="eyebrow mb-2">{item.category}</p>
              <p className="text-2xl font-light tracking-tight text-ink">{item.title}</p>
            </figcaption>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label="Close image"
              className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-line text-ink hover:text-leaf transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Explorations() {
  const [open, setOpen] = useState<Exploration | null>(null);
  return (
    <section id="explorations" className="overflow-hidden relative py-24 sm:py-32 px-6 sm:px-12 border-t border-line">
      <SectionScene scene="flow" strength={0.45} />
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Visual playground</p>
            <h2 className="section-title">Explorations</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-mute">
            Architecture studies and engineering sketches: ingress, GitOps, event streams and design tokens.
          </p>
        </Reveal>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTFOLIO_DATA.explorations.map((x, i) => (
            <Reveal key={x.title} delay={(i % 3) * 0.08}>
              <li className="list-none">
                <button
                  type="button"
                  onClick={() => setOpen(x)}
                  className="group relative block w-full overflow-hidden rounded-3xl border border-line bg-moss text-left cursor-pointer"
                >
                  <img
                    src={x.url}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
                  <span className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="eyebrow mb-1 block">{x.category}</span>
                    <span className="block text-lg font-light tracking-tight text-ink">{x.title}</span>
                  </span>
                </button>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
      <Lightbox item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
