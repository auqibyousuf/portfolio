import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { GAP, SECTION_IDS, world } from "./store";
import {
  HeroStage, WorksStage, ArchitectureStage, SkillsStage, CareerStage, CertsStage, ContactStage,
} from "./stages";

/** Reads where the viewport centre sits in the page and converts it to a stage position. */
function readScroll() {
  const mid = window.innerHeight * 0.4;
  let t = 0;
  for (let i = 0; i < SECTION_IDS.length; i++) {
    const el = document.getElementById(SECTION_IDS[i]);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) {
      // Dwell on the stage, then move to the next one over the last 30% of the section.
      const frac = THREE.MathUtils.smoothstep((mid - r.top) / Math.max(r.height, 1), 0.7, 1);
      t = i + frac;
      break;
    }
    if (r.bottom < mid) t = i;
  }
  world.target = THREE.MathUtils.clamp(t, 0, SECTION_IDS.length - 1);
}

/** Fades and scales a stage by its distance from the camera so sets fly in and out of depth. */
function Stage({ index, children }: { index: number; children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!g.current) return;
    const k = 1 - THREE.MathUtils.smoothstep(Math.abs(world.t - index), 0.75, 1);
    g.current.visible = k > 0.01;
    g.current.scale.setScalar(Math.max(k, 0.0001));
  });
  return <group ref={g} position={[0, 0, -index * GAP]}>{children}</group>;
}

function Scene() {
  useFrame((state, dt) => {
    const prev = world.t;
    world.t = THREE.MathUtils.damp(world.t, world.target, 3.5, dt);
    world.vel = THREE.MathUtils.damp(world.vel, (world.t - prev) / Math.max(dt, 0.001), 6, dt);
    const z = -world.t * GAP + 10;
    state.camera.position.set(Math.sin(world.t * 2.2) * 0.6 + state.pointer.x * 0.5, 0.4 + state.pointer.y * 0.3, z);
    state.camera.lookAt(state.pointer.x * 0.3, 0.2, z - 10);
  });
  return (
    <>
      <Stage index={0}><HeroStage /></Stage>
      <Stage index={1}><WorksStage /></Stage>
      <Stage index={2}><ArchitectureStage /></Stage>
      <Stage index={3}><SkillsStage /></Stage>
      <Stage index={4}><CareerStage /></Stage>
      <Stage index={5}><CertsStage /></Stage>
      <Stage index={6}><ContactStage /></Stage>
      <Sparkles count={160} scale={[16, 9, GAP * 7]} position={[0, 0, -GAP * 3]} size={3} speed={0.35} opacity={0.55} color="#bae6fd" />
    </>
  );
}

export const IsoBackdrop: React.FC = () => {
  useEffect(() => {
    readScroll();
    world.t = world.target;
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    return () => {
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
    };
  }, []);
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none opacity-70 sm:opacity-100" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 0.4, 10]} fov={32} near={0.1} far={90} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 6]} intensity={2} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={4} position={[0, 6, 4]} scale={[12, 4, 1]} />
          <Lightformer form="rect" intensity={2} color="#6366f1" position={[-7, 1, -2]} scale={[6, 6, 1]} />
          <Lightformer form="rect" intensity={2.5} color="#38bdf8" position={[7, 2, 2]} scale={[5, 6, 1]} />
          <Lightformer form="ring" intensity={3} color="#fff7ed" position={[0, 0, -8]} scale={6} />
          <Lightformer form="rect" intensity={3} position={[0, -5, 2]} scale={[14, 3, 1]} />
          <Lightformer form="rect" intensity={2.5} position={[0, 1, -10]} scale={[16, 8, 1]} />
          <Lightformer form="rect" intensity={2} position={[-9, 0, 4]} scale={[3, 10, 1]} />
        </Environment>
        <Scene />
      </Canvas>
    </div>
  );
};

export default IsoBackdrop;
