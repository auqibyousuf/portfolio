import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectItem } from "./data/portfolioData";
import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { ProjectModal } from "./components/ProjectModal";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Experience } from "./sections/Experience";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Achievements } from "./sections/Achievements";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const done = useCallback(() => setLoading(false), []);

  // Pinned sections measure the page, so re-measure once the preloader has released scrolling.
  useEffect(() => {
    if (!loading) {
      const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
      return () => window.clearTimeout(id);
    }
  }, [loading]);

  return (
    <>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white">
        Skip to content
      </a>
      <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
      <Navbar ready={!loading} />
      <main>
        <Hero ready={!loading} />
        <About onSelect={setSelected} />
        <Experience />
        <Projects onSelect={setSelected} />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
