import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera, RoundedBox, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { ArrowUpRight } from "lucide-react";
import { PORTFOLIO_DATA, type ProjectItem } from "../../data/portfolioData";
import { useScrollProgress } from "./useScrollProgress";
import { Monitor, Laptop, Phone, ServerRack, Cloud, Shadowed } from "./models";

const SPACING = 3.8;
const COLORS = ["#38bdf8", "#6366f1", "#22d3ee", "#a78bfa", "#34d399"];

type Kind = "monitor" | "laptop" | "phone" | "rack" | "cloud";
function kindOf(p: ProjectItem): Kind {
  const c = p.category.toLowerCase();
  if (c.includes("mobile")) return "phone";
  if (c.includes("infrastructure") || c.includes("code")) return "rack";
  if (c.includes("observability") || c.includes("cloud")) return "cloud";
  if (c.includes("platform") || c.includes("portal") || c.includes("banking")) return "monitor";
  return "laptop";
}

function Prop({ kind, color, seed }: { kind: Kind; color: string; seed: number }) {
  switch (kind) {
    case "monitor": return <group scale={0.95}><Monitor seed={seed} accent={color} /></group>;
    case "phone": return <Phone seed={seed} accent={color} scale={1.1} />;
    case "rack": return <ServerRack scale={0.8} accent={color} />;
    case "cloud": return <group position={[0, 1.2, 0]}><Cloud scale={1} /></group>;
    default: return <group scale={1.1}><Laptop seed={seed} accent={color} /></group>;
  }
}

function Exhibit({ index, active, kind, color }: { index: number; active: React.RefObject<number>; kind: Kind; color: string }) {
  const g = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    if (!g.current || !mat.current) return;
    // 1 when this exhibit is under the camera, fading to 0 one slot away.
    const focus = Math.max(0, 1 - Math.abs(active.current - index));
    g.current.position.y = THREE.MathUtils.damp(g.current.position.y, focus * 0.55, 5, dt);
    g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, 0.85 + focus * 0.25, 5, dt));
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, (focus - 1) * 0.5, 4, dt);
    mat.current.emissiveIntensity = THREE.MathUtils.damp(mat.current.emissiveIntensity, 0.15 + focus * 0.9, 5, dt);
  });
  return (
    <group position={[index * SPACING, 0, 0]}>
      <group ref={g}>
        <RoundedBox args={[2.8, 0.3, 2.8]} radius={0.1} smoothness={4} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[2.84, 0.08, 2.84]} radius={0.04} position={[0, 0.04, 0]}>
          <meshStandardMaterial ref={mat} color={color} emissive={color} emissiveIntensity={0.15} toneMapped={false} />
        </RoundedBox>
        <group position={[0, 0.3, 0]} rotation={[0, 0.2, 0]}>
          <Prop kind={kind} color={color} seed={index + 1} />
        </group>
      </group>
    </group>
  );
}

function Rig({ active, count }: { active: React.RefObject<number>; count: number }) {
  const x = useRef(0);
  useFrame(({ camera }, dt) => {
    // Camera glides along the row so the active exhibit stays centred.
    x.current = THREE.MathUtils.damp(x.current, active.current * SPACING, 6, dt);
    camera.position.set(x.current + 10, 9, 10);
    camera.lookAt(x.current, 0.4, 0);
  });
  return (
    <RoundedBox args={[count * SPACING + 4, 0.1, 4.6]} radius={0.04} position={[((count - 1) * SPACING) / 2, -0.06, 0]} receiveShadow>
      <meshStandardMaterial color="#cbd5e1" transparent opacity={0.55} roughness={0.8} />
    </RoundedBox>
  );
}

export const IsoWorks: React.FC<{ onSelectProject: (p: ProjectItem) => void }> = ({ onSelectProject }) => {
  const projects = PORTFOLIO_DATA.projects;
  const wrapper = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(wrapper, "sticky");
  const active = useRef(0);
  const [index, setIndex] = useState(0);

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
        <Canvas shadows dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
          <OrthographicCamera makeDefault zoom={60} near={0.1} far={100} position={[10, 9, 10]} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[6, 12, 5]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} />
          <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={2.5} position={[0, 6, 4]} scale={[10, 4, 1]} />
            <Lightformer form="rect" intensity={1.2} color="#6366f1" position={[-6, 2, -3]} scale={[6, 4, 1]} />
          </Environment>
          <Rig active={active} count={projects.length} />
          <Shadowed>
            {projects.map((p, i) => (
              <Exhibit key={p.id} index={i} active={active} kind={kindOf(p)} color={COLORS[i % COLORS.length]} />
            ))}
          </Shadowed>
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
