"use client";
import { useEffect, useState } from "react";

export default function GridOverlay() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.key || "").toLowerCase() === "g") setOn((v) => !v);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  if (!on) return null;

  const col = 12;
  const gap = 24; // px
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <div className="mx-auto max-w-6xl h-full px-4 grid" style={{ gridTemplateColumns: `repeat(${col}, 1fr)` }}>
        {Array.from({ length: col }).map((_, i) => (
          <div
            key={i}
            className="h-full"
            style={{
              background:
                "repeating-linear-gradient(to bottom, rgba(0,255,255,0.12), rgba(0,255,255,0.12) 1px, transparent 1px, transparent 8px)",
              outline: "1px solid rgba(0,255,255,0.2)",
              outlineOffset: `-${gap/2}px`,
              marginLeft: i === 0 ? 0 : gap / 2,
              marginRight: i === col - 1 ? 0 : gap / 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
