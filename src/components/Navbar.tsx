import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE } from "../data/site";
import { Avatar } from "./Character";

/** Floating glass pill navigation with a full-screen sheet on small screens. */
export function Navbar({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const ids = [...SITE.nav.map((n) => n.href.slice(1)), "contact"];
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav aria-label="Primary" className="glass flex items-center gap-1 rounded-full p-1.5 pr-2">
          <a href="#top" className="flex items-center gap-2.5 rounded-full py-0.5 pl-0.5 pr-3" aria-label="Back to top">
            <Avatar size={38} />
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">{SITE.profile.shortName}</span>
          </a>
          <span className="mx-1 hidden h-5 w-px bg-line md:block" />
          {SITE.nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`hidden rounded-full px-4 py-2 text-[13px] font-medium transition-colors md:block ${
                active === n.href.slice(1) ? "bg-ink text-white" : "text-ink/70 hover:text-ink"
              }`}
            >
              {n.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-accent !px-5 !py-2.5 !text-[13px]">
            Let&rsquo;s talk
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="ml-1 grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-white md:hidden cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper/95 p-6 backdrop-blur-xl md:hidden"
          >
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="ml-auto grid h-12 w-12 place-items-center rounded-full bg-white shadow-card cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <ul className="mt-10 flex flex-col gap-2">
              {[...SITE.nav, { label: "Contact", href: "#contact" }].map((n, i) => (
                <motion.li key={n.href} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * i }}>
                  <a href={n.href} onClick={() => setOpen(false)} className="block py-2 font-display text-5xl font-semibold tracking-tight">
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
