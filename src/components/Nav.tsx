import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PORTFOLIO_DATA } from "../data/portfolioData";

const LINKS = [
  ["Work", "work"],
  ["Architecture", "architecture"],
  ["Stack", "stack"],
  ["Experience", "experience"],
  ["Credentials", "credentials"],
] as const;

/** Floating pill nav. Hidden over the hero so it never collides with the hero's own navigation. */
export function Nav() {
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = [...LINKS.map(([, id]) => id), "contact"];
    // The current section is the last one whose top has passed 40% of the viewport.
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
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <AnimatePresence>
      {shown && (
        <motion.nav
          aria-label="Primary"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full border border-line bg-bg/70 backdrop-blur-xl px-2 py-2 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]"
        >
          <a href="#hero" className="px-3 text-sm text-ink tracking-tight" aria-label="Back to top">
            {PORTFOLIO_DATA.profile.shortName}
          </a>
          <span className="hidden md:block h-4 w-px bg-line" />
          {LINKS.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className={`hidden md:block rounded-full px-3 py-1.5 text-xs transition-colors ${
                active === id ? "bg-leaf text-bg" : "text-mute hover:text-ink"
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
              active === "contact" ? "bg-leaf text-bg" : "bg-ink text-bg hover:bg-leaf"
            }`}
          >
            Contact
          </a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
