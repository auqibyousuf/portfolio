import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Float, Line, MeshDistortMaterial, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { PORTFOLIO_DATA } from "../../data/portfolioData";
import { world } from "./store";
import { cardTexture, tileTexture } from "./textures";

type V3 = [number, number, number];

/** Right-side anchor for stage centrepieces; shrinks on narrow screens so nothing leaves the frame. */
function useLayout() {
  const size = useThree((s) => s.size);
  const u = THREE.MathUtils.clamp(size.width / size.height / 1.5, 0.55, 1);
  return { u };
}

function fib(n: number, r: number): V3[] {
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = Math.PI * (3 - Math.sqrt(5)) * i;
    return [Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r];
  });
}

function Tile({ label, color, size = 0.8, position }: { label: string; color: string; size?: number; position: V3 }) {
  const map = useMemo(() => tileTexture(label, color), [label, color]);
  return (
    <Billboard position={position}>
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial map={map} transparent toneMapped={false} />
      </mesh>
    </Billboard>
  );
}

function Blob({ color, radius = 1.35, distort = 0.38 }: { color: string; radius?: number; distort?: number }) {
  return (
    <mesh>
      <icosahedronGeometry args={[radius, 32]} />
      <MeshDistortMaterial
        color={color}
        distort={distort}
        speed={1.8}
        roughness={0.1}
        metalness={0.25}
        clearcoat={1}
        clearcoatRoughness={0.05}
        iridescence={1}
        iridescenceIOR={1.4}
        envMapIntensity={1.6}
      />
    </mesh>
  );
}

// ── 1. Hero: liquid iridescent core orbited by the tech stack ────────────────
const TECH: [string, string][] = [
  ["React", "#0ea5e9"], ["Next.js", "#334155"], ["Drupal", "#0678be"], ["K8s", "#326ce5"],
  ["AWS", "#f59e0b"], ["Terraform", "#7c3aed"], ["Docker", "#2496ed"], ["TypeScript", "#3178c6"],
];

export function HeroStage() {
  const { u } = useLayout();
  const orbit = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (orbit.current) orbit.current.rotation.y += dt * (0.22 + Math.abs(world.vel) * 3);
    if (ring.current) ring.current.rotation.z += dt * 0.12;
  });
  return (
    <group position={[0, -0.35, 0]} scale={u * 0.92}>
      <group position={[3.3, 0, 0]}>
        <Float speed={1.4} floatIntensity={0.8}>
          <Blob color="#7c8cff" radius={1.2} />
        </Float>
        <mesh ref={ring} rotation={[1.2, 0.2, 0]}>
          <torusGeometry args={[1.85, 0.03, 24, 160]} />
          <meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0.1} />
        </mesh>
        <group ref={orbit} rotation={[0.35, 0, 0.25]}>
          {TECH.map(([label, color], i) => {
            const a = (i / TECH.length) * Math.PI * 2;
            return <Tile key={label} label={label} color={color} size={0.7} position={[Math.cos(a) * 2.3, Math.sin(a * 2) * 0.35, Math.sin(a) * 2.3]} />;
          })}
        </group>
      </group>
    </group>
  );
}

// ── 2. Works: coverflow of poster cards, one per project ─────────────────────
function ProjectCard({ index, active }: { index: number; active: React.RefObject<number> }) {
  const project = PORTFOLIO_DATA.projects[index];
  const map = useMemo(() => cardTexture(project, index), [project, index]);
  const g = useRef<THREE.Group>(null);
  const face = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ pointer, clock }) => {
    if (!g.current || !face.current) return;
    const d = index - active.current;
    const ad = Math.abs(d);
    g.current.visible = ad < 3.4;
    if (!g.current.visible) return;
    const focus = Math.max(0, 1 - ad);
    const fade = 1 - THREE.MathUtils.smoothstep(ad, 2.6, 3.4);
    g.current.position.set(3 + d * 2.1 + Math.tanh(d) * 0.8, Math.sin(clock.elapsedTime * 0.8 + index) * 0.06, -Math.min(ad, 3) * 1.1);
    g.current.rotation.y = -Math.tanh(d * 1.2) * 0.75 + pointer.x * 0.14 * focus;
    g.current.rotation.x = -pointer.y * 0.08 * focus;
    g.current.scale.setScalar((0.8 + 0.3 * focus) * Math.max(fade, 0.0001));
    face.current.color.setScalar(0.45 + 0.55 * focus);
  });
  return (
    <group ref={g}>
      <RoundedBox args={[3, 1.9, 0.1]} radius={0.09} smoothness={4}>
        <meshPhysicalMaterial color="#0b1220" metalness={0.4} roughness={0.25} clearcoat={1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.056]}>
        <planeGeometry args={[2.9, 1.8125]} />
        <meshBasicMaterial ref={face} map={map} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function WorksStage() {
  const { u } = useLayout();
  const active = useRef(0);
  useFrame((_, dt) => {
    active.current = THREE.MathUtils.damp(active.current, world.worksActive, 5, dt);
  });
  return (
    <group scale={u * 1.2} position={[0, -0.25, 0]}>
      {PORTFOLIO_DATA.projects.map((p, i) => (
        <ProjectCard key={p.id} index={i} active={active} />
      ))}
    </group>
  );
}

// ── 3. Architecture: service graph with data pulses ──────────────────────────
const ARCH: { label: string; color: string }[] = [
  { label: "Next.js", color: "#334155" }, { label: "CMS", color: "#0678be" }, { label: "GraphQL", color: "#e535ab" },
  { label: "Terraform", color: "#7c3aed" }, { label: "Jenkins", color: "#d33833" }, { label: "EKS", color: "#326ce5" },
  { label: "ArgoCD", color: "#ef7b4d" }, { label: "ELK", color: "#00a69b" }, { label: "CDN", color: "#f59e0b" },
];
const EDGES: [number, number][] = [[0, 2], [2, 1], [0, 8], [8, 2], [3, 5], [4, 5], [5, 6], [5, 7], [2, 5], [4, 6]];

function Pulse({ a, b, offset, speed }: { a: V3; b: V3; offset: number; speed: number }) {
  const m = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!m.current) return;
    const t = (clock.elapsedTime * speed + offset) % 1;
    m.current.position.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
  });
  return (
    <mesh ref={m}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshBasicMaterial color="#7dd3fc" toneMapped={false} />
    </mesh>
  );
}

export function ArchitectureStage() {
  const { u } = useLayout();
  const grp = useRef<THREE.Group>(null);
  const pts = useMemo(() => fib(ARCH.length, 1.7), []);
  useFrame((_, dt) => {
    if (grp.current) grp.current.rotation.y += dt * (0.12 + Math.abs(world.vel) * 2);
  });
  return (
    <group position={[0, 0, 0]} scale={u}>
      <group position={[3.2, 0.8, 0]}>
        <group ref={grp}>
          {EDGES.map(([i, j], k) => (
            <React.Fragment key={k}>
              <Line points={[pts[i], pts[j]]} color="#7dd3fc" lineWidth={1.4} transparent opacity={0.55} />
              <Pulse a={pts[i]} b={pts[j]} offset={k * 0.13} speed={0.25 + (k % 3) * 0.08} />
            </React.Fragment>
          ))}
          {ARCH.map((n, i) => (
            <Tile key={n.label} label={n.label} color={n.color} size={0.66} position={pts[i]} />
          ))}
        </group>
      </group>
    </group>
  );
}

// ── 4. Skills: rotating constellation of the stack ───────────────────────────
const SKILLS: [string, string][] = [
  ["React", "#0ea5e9"], ["Next.js", "#334155"], ["TypeScript", "#3178c6"], ["Tailwind", "#06b6d4"], ["Drupal", "#0678be"],
  ["GraphQL", "#e535ab"], ["PHP", "#777bb3"], ["Node.js", "#3c873a"], ["AWS", "#f59e0b"], ["Docker", "#2496ed"],
  ["K8s", "#326ce5"], ["Helm", "#0f1689"], ["ArgoCD", "#ef7b4d"], ["Terraform", "#7c3aed"], ["Ansible", "#ee0000"],
  ["Jenkins", "#d33833"], ["ELK", "#00a69b"], ["Kafka", "#231f20"], ["WCAG", "#16a34a"], ["Storybook", "#ff4785"],
];

export function SkillsStage() {
  const { u } = useLayout();
  const grp = useRef<THREE.Group>(null);
  const pts = useMemo(() => fib(SKILLS.length, 1.9), []);
  useFrame((_, dt) => {
    if (grp.current) grp.current.rotation.y += dt * (0.16 + Math.abs(world.vel) * 3);
  });
  return (
    <group scale={u}>
      <group position={[3.6, 0.2, 0]}>
        <group ref={grp}>
          <mesh>
            <icosahedronGeometry args={[1.9, 2]} />
            <meshBasicMaterial color="#7dd3fc" wireframe transparent opacity={0.18} />
          </mesh>
          {SKILLS.map(([label, color], i) => (
            <Tile key={label} label={label} color={color} size={0.62} position={pts[i]} />
          ))}
        </group>
      </group>
    </group>
  );
}

// ── 5. Experience: a tunnel of gates to fly through ──────────────────────────
export function CareerStage() {
  const { u } = useLayout();
  const orbs = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    orbs.current?.children.forEach((o, i) => {
      o.position.z = 2 - (((clock.elapsedTime * 3 + i * 9) % 30) as number);
    });
    rings.current?.children.forEach((r, i) => {
      r.rotation.z += dt * (0.15 + i * 0.02);
    });
  });
  return (
    <group scale={u}>
      <group position={[3.2, 0, 0]}>
        <group ref={rings}>
          {Array.from({ length: 9 }).map((_, i) => (
            <mesh key={i} position={[0, 0, 2 - i * 3.4]}>
              <torusGeometry args={[1.5 + (i % 2) * 0.12, 0.035, 16, 96]} />
              <meshStandardMaterial color={i % 2 ? "#6366f1" : "#38bdf8"} emissive={i % 2 ? "#6366f1" : "#38bdf8"} emissiveIntensity={0.9} toneMapped={false} />
            </mesh>
          ))}
        </group>
        <group ref={orbs}>
          {[0, 1, 2].map((i) => (
            <mesh key={i}>
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshBasicMaterial color="#fde68a" toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

// ── 6. Certifications: floating gold badges ──────────────────────────────────
function Badge({ position, phase }: { position: V3; phase: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!g.current) return;
    g.current.rotation.y = Math.sin(clock.elapsedTime * 0.7 + phase) * 0.6 + pointer.x * 0.3;
    g.current.rotation.x = Math.PI / 2 + Math.sin(clock.elapsedTime * 0.5 + phase) * 0.15 - 0.2;
  });
  return (
    <Float speed={1.3} floatIntensity={1}>
      <group position={position}>
        <group ref={g}>
          <mesh>
            <cylinderGeometry args={[0.72, 0.72, 0.16, 6]} />
            <meshStandardMaterial color="#f5c451" metalness={1} roughness={0.22} envMapIntensity={1.8} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.52, 0.52, 0.05, 48]} />
            <meshStandardMaterial color="#0b1220" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.38, 0.03, 16, 64]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <octahedronGeometry args={[0.16]} />
            <meshStandardMaterial color="#fde68a" metalness={1} roughness={0.15} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

export function CertsStage() {
  const { u } = useLayout();
  const pos: V3[] = [[0.2, -0.9, 0.4], [1.9, -1.1, 0], [3.6, -0.9, -0.4], [5, -0.5, -0.9]];
  return (
    <group scale={u * 0.8}>
      {pos.map((p, i) => (
        <Badge key={i} position={p} phase={i * 1.7} />
      ))}
    </group>
  );
}

// ── 7. Contact: the closing orb, bookending the hero ─────────────────────────
export function ContactStage() {
  const { u } = useLayout();
  const rings = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (rings.current) rings.current.rotation.y += dt * 0.25;
  });
  return (
    <group scale={u}>
      <group position={[3.4, 1.1, 0]}>
        <Float speed={1.2} floatIntensity={0.6}>
          <Blob color="#f59e0b" radius={1.15} distort={0.3} />
        </Float>
        <group ref={rings}>
          {[1.7, 2.2, 2.7].map((r, i) => (
            <mesh key={r} rotation={[1.1 + i * 0.35, i * 0.5, 0]}>
              <torusGeometry args={[r, 0.02, 16, 160]} />
              <meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0.12} />
            </mesh>
          ))}
        </group>
        <Sparkles count={90} scale={[7, 7, 7]} size={4} speed={0.5} opacity={0.8} color="#fde68a" />
      </group>
    </group>
  );
}
