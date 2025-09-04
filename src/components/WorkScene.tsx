// src/components/WorkScene.tsx
"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

// TODO(siawsh): Replace placeholder cube with branded minimal scene (lines/logo).
// TODO(siawsh): Add reduced-motion guard and subtle OrbitControls.
function SpinningBox() {
  const ref = useRef<Mesh>(null!);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.6;
    ref.current.rotation.y += delta * 0.4;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#7c3aed" />
    </mesh>
  );
}

export default function WorkScene() {
  return (
    <div className="h-64 md:h-80 rounded-xl border overflow-hidden bg-black">
      <Canvas camera={{ position: [3, 2, 5], fov: 45 }}>
        <color attach="background" args={[0x000000]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <SpinningBox />
      </Canvas>
    </div>
  );
}
