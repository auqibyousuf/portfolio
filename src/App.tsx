import { lazy, Suspense, useState } from "react";
import { MotionConfig } from "framer-motion";
import type { ProjectItem } from "./data/portfolioData";
import { Nav } from "./components/Nav";
import { WorldBackdrop } from "./components/WorldBackdrop";
import { Hero } from "./sections/Hero";
import { Intro } from "./sections/Intro";
import { Work } from "./sections/Work";
import { Architecture } from "./sections/Architecture";
import { Stack } from "./sections/Stack";
import { Experience } from "./sections/Experience";
import { Credentials } from "./sections/Credentials";
import { Contact } from "./sections/Contact";

const ProjectModal = lazy(() => import("./components/ProjectModal").then((m) => ({ default: m.ProjectModal })));

export default function App() {
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative bg-bg text-ink min-h-screen overflow-x-clip">
        <WorldBackdrop />
        <Nav />
        <main>
          <Hero />
          <Intro />
          <Work onSelect={setSelected} />
          <Architecture />
          <Stack />
          <Experience />
          <Credentials />
        </main>
        <Contact />
        <Suspense fallback={null}>
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        </Suspense>
      </div>
    </MotionConfig>
  );
}
