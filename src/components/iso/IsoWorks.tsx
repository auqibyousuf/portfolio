import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { ArrowUpRight } from "lucide-react";
import { PORTFOLIO_DATA, type ProjectItem } from "../../data/portfolioData";
import { useScrollProgress } from "./useScrollProgress";

const SPACING = 3.2;
const COLORS = ["#38bdf8", "#6366f1", "#22d3ee", "#a78bfa", "#34d399"];

function Block({ index, active, color }: { index: number; active: React.RefObject<number>; color: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m || !mat.current) return;
    // 1 when this block is under the camera, fading to 0 one slot away.
    const focus = Math.max(0, 1 - Math.abs(active.current - index));
    const h = 1 + focus * 1.8;
    m.scale.y = THREE.MathUtils.damp(m.scale.y, h, 5, dt);
    m.position.y = m.scale.y / 2;
    m.rotation.y = THREE.MathUtils.damp(m.rotation.y, focus * Math.PI * 0.5, 4, dt);
    mat.current.emissiveIntensity = THREE.MathUtils.damp(mat.current.emissiveIntensity, focus * 0.6, 5, dt);
  });
  return (
    <mesh ref={mesh} position={[index * SPACING, 0.5, 0]}>
      <boxGeometry args={[1.8, 1, 1.8]} />
      <meshStandardMaterial ref={mat} color={color} emissive={color} emissiveIntensity={0} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

function Rig({ active, count }: { active: React.RefObject<number>; count: number }) {
  const track = useRef(new THREE.Vector3());
  useFrame(({ camera }, dt) => {
    // Camera glides along the row so the active block stays centred.
    const x = active.current * SPACING;
    track.current.x = THREE.MathUtils.damp(track.current.x, x, 6, dt);
    camera.position.set(track.current.x + 10, 10, 10);
    camera.lookAt(track.current.x, -0.4, 0);
  });
  return (
    <>
      <mesh position={[((count - 1) * SPACING) / 2, -0.05, 0]}>
        <boxGeometry args={[count * SPACING + 4, 0.1, 5]} />
        <meshStandardMaterial color="#64748b" transparent opacity={0.35} metalness={0.2} roughness={0.8} />
      </mesh>
    </>
  );
}

export const IsoWorks: React.FC<{ onSelectProject: (p: ProjectItem) => void }> = ({ onSelectProject }) => {
  const projects = PORTFOLIO_DATA.projects;
  const wrapper = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(wrapper, "sticky");
  const active = useRef(0); // float index, read by the 3D scene
  const [index, setIndex] = useState(0); // integer index, drives the overlay

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      active.current = progress.current * (projects.length - 1);
      const i = Math.round(active.current);
      setIndex((prev) => (prev === i ? prev : i));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, projects.length]);

  const project = projects[index];

  return (
    <section id="works" ref={wrapper} style={{ height: `${projects.length * 70 + 100}vh` }} className="relative font-mono">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
          <OrthographicCamera makeDefault zoom={42} near={0.1} far={100} position={[10, 10, 10]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[6, 12, 4]} intensity={1.4} />
          <pointLight position={[-4, 5, -6]} intensity={25} color="#6366f1" />
          <Rig active={active} count={projects.length} />
          {projects.map((p, i) => (
            <Block key={p.id} index={i} active={active} color={COLORS[i % COLORS.length]} />
          ))}
        </Canvas>

        <div className="absolute top-24 left-6 sm:left-12 right-6 pointer-events-none">
          <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-blue-500 mb-2">Production Portfolio</div>
          <h2 className="text-3xl sm:text-5xl font-bold text-[hsl(var(--text))] leading-tight">Featured Projects</h2>
        </div>

        <div className="absolute bottom-8 left-6 right-6 sm:left-12 sm:right-auto sm:max-w-md rounded-2xl bg-[hsl(var(--surface))]/90 backdrop-blur border border-[hsl(var(--stroke))] p-5 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[hsl(var(--muted))] mb-3">
            <span>SYS.{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
            <span>{project.category}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[hsl(var(--text))] mb-1">{project.title}</h3>
          <p className="text-xs text-[hsl(var(--muted))] leading-relaxed font-sans mb-4">{project.tagline}</p>
          <button
            onClick={() => onSelectProject(project)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[hsl(var(--text))] text-[hsl(var(--bg))] hover:opacity-85 transition-opacity cursor-pointer"
          >
            View details <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default IsoWorks;
