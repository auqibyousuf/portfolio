import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera, RoundedBox, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgress } from "./useScrollProgress";
import { Monitor, Laptop, ServerRack, Cloud, Plant, Mug, Desk, Shadowed } from "./models";

function World({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const cloud = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    state.camera.lookAt(0, 1.3, 0);
    const p = progress.current;
    // Scroll turns the diorama and lifts the cloud out of the scene.
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, Math.PI / 4 + p * Math.PI * 0.55, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, p * 0.8, 3, dt);
    if (cloud.current) cloud.current.position.y = THREE.MathUtils.damp(cloud.current.position.y, 3.3 + p * 1.6, 3, dt);
  });

  return (
    <group ref={group} rotation={[0, Math.PI / 4, 0]}>
      <Shadowed>
        {/* island */}
        <RoundedBox args={[7, 0.5, 5]} radius={0.12} smoothness={4} position={[0, -0.25, 0]}>
          <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[7.04, 0.1, 5.04]} radius={0.05} position={[0, -0.42, 0]}>
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} toneMapped={false} />
        </RoundedBox>

        {/* workstation */}
        <group position={[-0.7, 0, 0.2]}>
          <Desk />
          <group position={[-0.25, 0.78, -0.2]}><Monitor seed={4} /></group>
          <group position={[1.1, 0.78, 0.2]} rotation={[0, -0.35, 0]}><Laptop seed={9} scale={0.85} /></group>
          <group position={[-1.35, 0.78, 0.35]}><Mug /></group>
        </group>

        <group position={[2.5, 0, -1]} rotation={[0, -0.2, 0]}><ServerRack /></group>
        <group position={[-2.7, 0, 1.6]}><Plant scale={1.1} /></group>
        <group position={[2.6, 0, 1.6]}><Plant scale={0.7} /></group>
      </Shadowed>

      <group ref={cloud} position={[0.2, 3.3, -0.6]}>
        <Cloud scale={1.1} />
      </group>
    </group>
  );
}

export const IsoHero: React.FC<{ container: React.RefObject<HTMLElement | null> }> = ({ container }) => {
  const progress = useScrollProgress(container, "leave");
  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ pointerEvents: "none" }}>
      <OrthographicCamera makeDefault position={[10, 9, 10]} zoom={50} near={0.1} far={100} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[6, 12, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0004}
      />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 6, 4]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#6366f1" position={[-6, 2, -3]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={1} color="#38bdf8" position={[6, 1, 2]} scale={[4, 4, 1]} />
      </Environment>
      <World progress={progress} />
    </Canvas>
  );
};

export default IsoHero;
