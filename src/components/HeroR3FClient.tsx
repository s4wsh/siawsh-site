// src/components/HeroR3FClient.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";

export default function HeroR3FClient() {
  // Optional: reduce CPU in background tabs
  useEffect(() => {
    const onVis = () => {
      // you can pause animations here if you run a loop
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="relative h-[48vh] min-h-[320px] rounded-2xl border border-mist overflow-hidden">
      <Canvas
        // Lower chance of context loss + fewer GPU headaches
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
        }}
        // Keep DPR reasonable for thermals
        dpr={[1, 1.75]}
        // Avoid constant render in dev if you don’t need it
        frameloop="demand"
        onCreated={({ gl }) => {
          const canvas = gl.getContext().canvas as HTMLCanvasElement;
          const onLost = (e: Event) => {
            // Prevent default so the browser doesn’t permanently lose the context.
            e.preventDefault();
            // Request a single re-render after restore.
            requestAnimationFrame(() => {});
          };
          const onRestore = () => requestAnimationFrame(() => {});
          canvas.addEventListener("webglcontextlost", onLost, false);
          canvas.addEventListener("webglcontextrestored", onRestore, false);
          // Cleanup on unmount
          return () => {
            canvas.removeEventListener("webglcontextlost", onLost, false);
            canvas.removeEventListener("webglcontextrestored", onRestore, false);
          };
        }}
      >
        <Suspense fallback={null}>
          {/* TODO: your scene goes here. Keep it simple for now. */}
          {/* Example: <ambientLight intensity={0.5} /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
