import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera, RoundedBox, Environment, Lightformer, Float, Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { Laptop, Cloud, ServerRack } from "./models";

const UNITS_PER_PX = 0.004; // how far the camera travels per scrolled pixel
const VISIBLE = 15; // objects fade in from this far ahead of the camera

type Kind = "laptop" | "ring" | "crate" | "orb" | "cloud" | "rack" | "discs" | "helm" | "chrome";
interface Item { kind: Kind; x: number; y: number; z: number; s: number; color?: string }

const ITEMS: Item[] = [
  { kind: "laptop", x: 3.1, y: -0.55, z: 0, s: 1.5 },
  { kind: "ring", x: 3.1, y: 0.9, z: -0.6, s: 0.9 },
  { kind: "orb", x: -3.8, y: 1.5, z: 1, s: 1 },
  { kind: "crate", x: 5.2, y: 1.7, z: 0.8, s: 0.7, color: "#38bdf8" },
  { kind: "crate", x: 4.6, y: -1.8, z: 1.4, s: 0.5, color: "#6366f1" },
  { kind: "crate", x: -4.6, y: -0.2, z: 1.4, s: 0.45, color: "#f97316" },
  { kind: "cloud", x: 4.2, y: 2.7, z: -2, s: 0.9 },
  { kind: "rack", x: -3.6, y: -1.4, z: -9, s: 0.9 },
  { kind: "chrome", x: 3.8, y: 0.8, z: -10, s: 0.8 },
  { kind: "discs", x: 3.8, y: -1, z: -18, s: 1 },
  { kind: "crate", x: -3.8, y: 0.8, z: -17, s: 0.8, color: "#10b981" },
  { kind: "helm", x: -3.8, y: 0, z: -26, s: 1 },
  { kind: "cloud", x: 4, y: 1.4, z: -27, s: 1 },
  { kind: "laptop", x: 3.8, y: -1.2, z: -35, s: 1.5 },
  { kind: "orb", x: -3.8, y: 1, z: -34, s: 1 },
  { kind: "rack", x: 3.8, y: -1.4, z: -43, s: 0.9 },
  { kind: "chrome", x: -3.8, y: 0.4, z: -42, s: 0.9 },
  { kind: "crate", x: 3.6, y: 1.2, z: -51, s: 0.8, color: "#ec4899" },
  { kind: "discs", x: -3.8, y: -1, z: -52, s: 1 },
];

function Shape({ item }: { item: Item }) {
  switch (item.kind) {
    case "laptop":
      return <group position={[0, -0.4, 0]}><Laptop seed={Math.round(item.z) + 11} accent="#38bdf8" /></group>;
    case "ring":
      return (
        <mesh rotation={[1.1, 0.3, 0]}>
          <torusGeometry args={[1.9, 0.07, 32, 128]} />
          <meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0.08} />
        </mesh>
      );
    case "orb":
      return (
        <mesh>
          <sphereGeometry args={[0.65, 48, 48]} />
          <meshPhysicalMaterial color="#c7d2fe" transparent opacity={0.45} roughness={0.04} metalness={0} clearcoat={1} clearcoatRoughness={0.02} envMapIntensity={2.2} />
        </mesh>
      );
    case "crate":
      return (
        <RoundedBox args={[1, 1, 1]} radius={0.16} smoothness={6}>
          <meshPhysicalMaterial color={item.color} roughness={0.18} metalness={0.1} clearcoat={1} clearcoatRoughness={0.08} />
        </RoundedBox>
      );
    case "cloud":
      return <Cloud />;
    case "rack":
      return <group position={[0, -1.1, 0]}><ServerRack /></group>;
    case "chrome":
      return (
        <mesh>
          <icosahedronGeometry args={[0.8, 5]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.12} envMapIntensity={1.6} />
        </mesh>
      );
    case "discs":
      // A stack of database platters.
      return (
        <group>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[0, i * 0.42 - 0.6, 0]}>
              <cylinderGeometry args={[0.9, 0.9, 0.3, 48]} />
              <meshPhysicalMaterial color={i % 2 ? "#6366f1" : "#38bdf8"} roughness={0.2} clearcoat={1} metalness={0.2} />
            </mesh>
          ))}
        </group>
      );
    case "helm":
      // Ship's wheel, a nod to Kubernetes.
      return (
        <group>
          <mesh><torusGeometry args={[1, 0.09, 24, 96]} /><meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} /></mesh>
          <mesh><sphereGeometry args={[0.25, 32, 32]} /><meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0.1} /></mesh>
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i / 7) * Math.PI * 2]}>
              <boxGeometry args={[0.08, 2.5, 0.08]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      );
  }
}

function Flyer({ item, cam }: { item: Item; cam: React.RefObject<{ z: number; vel: number }> }) {
  const g = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const faces = item.kind === "laptop" || item.kind === "rack";
  useFrame(({ clock }, dt) => {
    if (!g.current || !spin.current) return;
    // Scale in as the camera approaches; the object appears to fly out of the depth.
    const dist = cam.current.z - item.z;
    const t = THREE.MathUtils.clamp((VISIBLE - dist) / 6, 0, 1) * THREE.MathUtils.clamp((dist + 1) / 3, 0, 1);
    const s = item.s * t * t * (3 - 2 * t);
    g.current.visible = s > 0.01;
    g.current.scale.setScalar(Math.max(s, 0.0001));
    // Faster scrolling spins things harder.
    if (faces) {
      // Screens and racks sway toward the viewer instead of turning their backs.
      spin.current.rotation.y = -0.5 + Math.sin(clock.elapsedTime * 0.6 + item.z) * 0.45 + cam.current.vel * 1.5;
    } else {
      spin.current.rotation.y += dt * (0.25 + Math.abs(cam.current.vel) * 2.5);
    }
  });
  return (
    <group ref={g} position={[item.x, item.y, item.z]}>
      <Float speed={1.3} rotationIntensity={0.6} floatIntensity={1}>
        <group ref={spin} rotation={item.kind === "laptop" ? [0, -0.5, 0] : [0.2, 0, 0]}>
          <Shape item={item} />
        </group>
      </Float>
    </group>
  );
}

function Scene() {
  const cam = useRef({ z: 9.5, vel: 0 });
  const last = useRef(0);
  const narrow = useRef(1);
  useFrame((state, dt) => {
    const y = window.scrollY;
    const targetZ = 9.5 - y * UNITS_PER_PX;
    const prev = cam.current.z;
    cam.current.z = THREE.MathUtils.damp(cam.current.z, targetZ, 5, dt);
    cam.current.vel = THREE.MathUtils.damp(cam.current.vel, (prev - cam.current.z) / Math.max(dt, 0.001) / 30, 6, dt);
    last.current = y;
    narrow.current = Math.min(1, state.size.width / state.size.height / 1.4);
    state.camera.position.set(
      state.pointer.x * 0.5,
      -y * 0.0002 + state.pointer.y * 0.3 + 0.6,
      cam.current.z
    );
    state.camera.lookAt(state.pointer.x * 0.3, 0.2, cam.current.z - 10);
  });
  return (
    <>
      {ITEMS.map((it, i) => (
        <Flyer key={i} item={it} cam={cam} />
      ))}
      <Sparkles count={70} scale={[14, 8, 60]} position={[0, 0, -22]} size={3} speed={0.4} opacity={0.6} color="#bae6fd" />
    </>
  );
}

export const IsoBackdrop: React.FC = () => (
  <div className="fixed inset-0 z-[1] pointer-events-none opacity-70 sm:opacity-100" aria-hidden="true">
    <Canvas dpr={[1, 1.15]} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
      <PerspectiveCamera makeDefault position={[0, 0.6, 9.5]} fov={32} near={0.1} far={80} />
      <ambientLight intensity={0.35} />
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

export default IsoBackdrop;
