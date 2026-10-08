import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgress } from "./useScrollProgress";

const GRID = 5;
const ACCENTS = ["#38bdf8", "#6366f1", "#22d3ee"];

function Tower({ x, z, height, color, progress }: {
  x: number; z: number; height: number; color: string; progress: React.RefObject<number>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  // Towers grow as the visitor scrolls, staggered by distance from the corner.
  const delay = (x + z + GRID) / (GRID * 2);
  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const t = THREE.MathUtils.clamp((progress.current * 1.6 - delay * 0.6), 0, 1);
    const target = height * (0.45 + 0.9 * t);
    m.scale.y = THREE.MathUtils.damp(m.scale.y, target, 4, dt);
    m.position.y = m.scale.y / 2;
  });
  return (
    <mesh ref={mesh} position={[x, height / 2, z]} scale={[0.8, height, 0.8]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.45} />
    </mesh>
  );
}

function World({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const towers = useMemo(() => {
    const list: { x: number; z: number; height: number; color: string }[] = [];
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const half = (GRID - 1) / 2;
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const edge = Math.max(Math.abs(i - half), Math.abs(j - half));
        list.push({
          x: (i - half) * 1.1,
          z: (j - half) * 1.1,
          height: 0.4 + rand() * (2.4 - edge * 0.55),
          color: ACCENTS[Math.floor(rand() * ACCENTS.length)],
        });
      }
    }
    return list;
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    state.camera.lookAt(0, 1, 0);
    const p = progress.current;
    // Scroll spins the whole world and lifts it out of the page.
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, p * Math.PI * 1.5, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, p * 1.5, 3, dt);
    // Gentle mouse parallax.
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * 0.06, 3, dt);
  });

  return (
    <group ref={group}>
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[GRID * 1.1 + 0.8, 0.12, GRID * 1.1 + 0.8]} />
        <meshStandardMaterial color="#64748b" transparent opacity={0.35} metalness={0.2} roughness={0.7} />
      </mesh>
      <gridHelper args={[GRID * 1.1 + 0.8, GRID * 2, "#38bdf8", "#94a3b8"]} position={[0, 0.001, 0]} />
      {towers.map((t, i) => (
        <Tower key={i} {...t} progress={progress} />
      ))}
    </group>
  );
}

export const IsoHero: React.FC<{ container: React.RefObject<HTMLElement | null> }> = ({ container }) => {
  const progress = useScrollProgress(container, "leave");
  return (
    <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ pointerEvents: "none" }}>
      <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={55} near={0.1} far={100} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 12, 4]} intensity={1.4} />
      <pointLight position={[-6, 4, -6]} intensity={30} color="#6366f1" />
      <World progress={progress} />
    </Canvas>
  );
};

export default IsoHero;
