"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

function GlassCard() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = Math.sin(t / 4) / 30;
      ref.current.rotation.y = Math.cos(t / 4) / 30;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0.1, 0]}>
      <boxGeometry args={[3.6, 2.2, 0.06]} />
      <meshStandardMaterial color="#e6fefe" metalness={0.2} roughness={0.15} />
    </mesh>
  );
}

function AccentSlab() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = -0.8 + Math.sin(clock.getElapsedTime() * 1.2) * 0.02;
  });
  return (
    <mesh ref={ref} position={[1.9, -0.8, -0.2]} rotation={[-0.15, 0.35, 0.08]}>
      <boxGeometry args={[2.6, 1.2, 0.08]} />
      <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.18} />
    </mesh>
  );
}

export default function HeroR3F() {
  return (
    <section className="mt-8 rounded-2xl border border-mist overflow-hidden">
      <div className="h-[480px]">
        {/* cheap in dev */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1]}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
            alpha: true,
          }}
          onCreated={({ gl }) => {
            const handleLost = (e: Event) => e.preventDefault();
            gl.domElement.addEventListener("webglcontextlost", handleLost as EventListener, {
              passive: false,
            });
          }}
          flat
          shadows={false}
        >
          <color attach="background" args={["#0c0c0c"]} />
          <hemisphereLight intensity={0.6} groundColor={new THREE.Color("#222")} />
          <directionalLight position={[5, 6, 5]} intensity={1.0} />
          <group>
            <AccentSlab />
            <GlassCard />
          </group>
        </Canvas>
      </div>
    </section>
  );
}
