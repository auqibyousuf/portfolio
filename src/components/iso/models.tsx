import React, { useLayoutEffect, useRef } from "react";
import { useScreenTexture } from "./useScreenTexture";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const METAL = { metalness: 0.7, roughness: 0.3 };

export function Monitor({ seed = 1, accent = "#38bdf8", scale = 1 }: { seed?: number; accent?: string; scale?: number }) {
  const tex = useScreenTexture(seed, accent);
  return (
    <group scale={scale}>
      <RoundedBox args={[0.9, 0.08, 0.6]} radius={0.03} position={[0, 0.04, 0]}>
        <meshStandardMaterial color="#cbd5e1" {...METAL} />
      </RoundedBox>
      <mesh position={[0, 0.34, -0.05]}>
        <boxGeometry args={[0.14, 0.6, 0.08]} />
        <meshStandardMaterial color="#94a3b8" {...METAL} />
      </mesh>
      <group position={[0, 0.95, 0]} rotation={[-0.05, 0, 0]}>
        <RoundedBox args={[1.9, 1.15, 0.1]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[1.76, 1.01]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export function Laptop({ seed = 2, accent = "#6366f1", scale = 1 }: { seed?: number; accent?: string; scale?: number }) {
  const tex = useScreenTexture(seed, accent);
  return (
    <group scale={scale}>
      <RoundedBox args={[1.3, 0.06, 0.9]} radius={0.025} position={[0, 0.03, 0]}>
        <meshStandardMaterial color="#d1d5db" {...METAL} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.005, 0.3]} radius={0.01} position={[0, 0.062, 0.2]}>
        <meshStandardMaterial color="#9ca3af" roughness={0.6} />
      </RoundedBox>
      <group position={[0, 0.06, -0.44]} rotation={[-0.28, 0, 0]}>
        <RoundedBox args={[1.3, 0.85, 0.04]} radius={0.02} position={[0, 0.425, 0]}>
          <meshStandardMaterial color="#d1d5db" {...METAL} />
        </RoundedBox>
        <mesh position={[0, 0.425, 0.022]}>
          <planeGeometry args={[1.2, 0.75]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export function Phone({ seed = 3, accent = "#22d3ee", scale = 1 }: { seed?: number; accent?: string; scale?: number }) {
  const tex = useScreenTexture(seed, accent);
  return (
    <group scale={scale} rotation={[-0.12, 0, 0]} position={[0, 0.75, 0]}>
      <RoundedBox args={[0.8, 1.5, 0.07]} radius={0.09} smoothness={4}>
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.7, 1.4]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function ServerRack({ scale = 1, accent = "#38bdf8" }: { scale?: number; accent?: string }) {
  const leds = useRef<THREE.Group>(null);
  const units = 6;
  useFrame(({ clock }) => {
    leds.current?.children.forEach((m, i) => {
      const mat = (m as THREE.Mesh).material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.2 + Math.sin(clock.elapsedTime * 3 + i * 1.7) * 1.0;
    });
  });
  return (
    <group scale={scale}>
      <RoundedBox args={[1, 2.3, 0.9]} radius={0.05} position={[0, 1.15, 0]}>
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.4} />
      </RoundedBox>
      {Array.from({ length: units }).map((_, i) => (
        <RoundedBox key={i} args={[0.88, 0.27, 0.04]} radius={0.015} position={[0, 0.3 + i * 0.34, 0.46]}>
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.35} />
        </RoundedBox>
      ))}
      <group ref={leds}>
        {Array.from({ length: units * 2 }).map((_, i) => {
          const row = Math.floor(i / 2);
          const green = i % 2 === 0;
          const c = green ? "#4ade80" : accent;
          return (
            <mesh key={i} position={[-0.3 + (i % 2) * 0.1, 0.3 + row * 0.34, 0.49]}>
              <boxGeometry args={[0.05, 0.05, 0.02]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.5} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
      {Array.from({ length: units }).map((_, i) => (
        <mesh key={`v${i}`} position={[0.18, 0.3 + i * 0.34, 0.485]}>
          <boxGeometry args={[0.4, 0.12, 0.01]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function Cloud({ scale = 1 }: { scale?: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) g.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.08;
  });
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 0.55], [0.65, -0.08, 0.05, 0.45], [-0.65, -0.1, 0, 0.42], [0.3, 0.3, 0, 0.45], [-0.25, 0.28, 0.1, 0.42], [0.05, -0.12, 0.25, 0.4],
  ];
  return (
    <group scale={scale}>
      <group ref={g}>
        {puffs.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 32, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Plant({ scale = 1 }: { scale?: number }) {
  const leaves: [number, number, number][] = [[0, 0.9, 0.3], [1.2, 0.8, 0.28], [2.4, 1, 0.3], [3.6, 0.85, 0.27], [4.8, 0.95, 0.3], [6, 0.8, 0.27]];
  return (
    <group scale={scale}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.32, 0.22, 0.5, 24]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.03, 24]} />
        <meshStandardMaterial color="#3f2d20" roughness={1} />
      </mesh>
      {leaves.map(([rot, h, s], i) => (
        <group key={i} rotation={[0, rot, 0]}>
          <mesh position={[0.18, 0.5 + h * 0.5, 0]} rotation={[0, 0, -0.35]} scale={[s * 0.5, h, s * 0.5]}>
            <sphereGeometry args={[0.5, 16, 12]} />
            <meshStandardMaterial color={i % 2 ? "#16a34a" : "#22c55e"} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Mug({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.13, 0.12, 0.28, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.11, 24]} />
        <meshStandardMaterial color="#5b3a29" roughness={0.4} />
      </mesh>
      <mesh position={[0.15, 0.14, 0]}>
        <torusGeometry args={[0.07, 0.02, 12, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
    </group>
  );
}

export function Desk({ width = 3.6, depth = 1.5 }: { width?: number; depth?: number }) {
  return (
    <group>
      <RoundedBox args={[width, 0.12, depth]} radius={0.04} position={[0, 0.72, 0]}>
        <meshStandardMaterial color="#c08a5b" roughness={0.55} />
      </RoundedBox>
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
        <mesh key={`${sx}${sz}`} position={[sx * (width / 2 - 0.15), 0.33, sz * (depth / 2 - 0.15)]}>
          <boxGeometry args={[0.1, 0.66, 0.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
        </mesh>
      )))}
    </group>
  );
}

/** Marks every mesh in the subtree as a shadow caster and receiver. */
export function Shadowed({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    ref.current?.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  });
  return <group ref={ref}>{children}</group>;
}
