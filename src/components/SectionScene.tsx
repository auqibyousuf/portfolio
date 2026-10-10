import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { SafeBoundary } from "./SafeBoundary";

const fill = { width: "100%", height: "100%" } as const;

// Every ThreeUI scene is code-split and retinted to the moss palette with its own hue/brightness controls.
const SCENES = {
  constellation: lazy(async () => {
    const { ConstellationField } = await import("@designcodeio/threeui/components/ConstellationField");
    return { default: () => <ConstellationField hue={85} brightness={1.25} style={fill} /> };
  }),
  infrastructure: lazy(async () => {
    const { LogicCoreField } = await import("@designcodeio/threeui/components/LogicCoreField");
    return { default: () => <LogicCoreField hue={-50} style={fill} /> };
  }),
  glyphs: lazy(async () => {
    const { ParticleDrift } = await import("@designcodeio/threeui/components/ParticleDrift");
    return { default: () => <ParticleDrift hue={-75} brightness={2.2} style={fill} /> };
  }),
  growth: lazy(async () => {
    const { GenerativeTree } = await import("@designcodeio/threeui/components/GenerativeTree");
    return { default: () => <GenerativeTree hue={105} brightness={2.4} style={fill} /> };
  }),
  flow: lazy(async () => {
    const { FlowField } = await import("@designcodeio/threeui/components/FlowField");
    return { default: () => <FlowField hue={115} style={fill} /> };
  }),
  horizon: lazy(async () => {
    const { EmeraldHorizonBackground } = await import("@designcodeio/threeui/components/EmeraldHorizonBackground");
    return { default: () => <EmeraldHorizonBackground /> };
  }),
};

export type SceneName = keyof typeof SCENES;

/**
 * A ThreeUI scene behind a section. It sits at z-index -10 and is blended with `screen`, so the scene's dark
 * backdrop disappears into the page and only its light elements show. It mounts only while the section is near
 * the viewport, which keeps at most one or two WebGL contexts alive.
 */
export function SectionScene({ scene, strength = 0.7 }: { scene: SceneName; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: "20% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Scene = SCENES[scene];
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 mix-blend-screen transition-opacity duration-1000"
        style={{ opacity: live ? strength : 0 }}
      >
        {live && (
          <SafeBoundary>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </SafeBoundary>
        )}
      </div>
      {/* Fade the scene into the page above and below so sections join up without hard edges. */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
    </div>
  );
}
