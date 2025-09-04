"use client";
import { useEffect, useRef, useState } from "react";

/** Triangle cursor + optional label. Hides on touch devices. */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Skip on touch devices
    if (typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const dot = dotRef.current!;
    const label = labelRef.current!;
    let x = -100, y = -100, raf = 0;

    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const tick = () => {
      dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      label.style.transform = `translate3d(${x + 16}px,${y + 8}px,0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(tick);

    // Swap label when hovering actionable targets
    const over = (e: MouseEvent) => {
      const el = (e.target as Element).closest<HTMLElement>("a,button,[data-cursor]");
      if (el) {
        dot.style.scale = "1.05";
        const txt =
          el.dataset.cursor ||
          (el.tagName === "A" ? "Open" : el.tagName === "BUTTON" ? "Click" : "");
        label.textContent = txt;
        label.style.opacity = txt ? "1" : "0";
      } else {
        dot.style.scale = "1";
        label.style.opacity = "0";
      }
    };
    document.addEventListener("mouseover", over, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Triangle pointer (mix-blend keeps it visible on dark/light) */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-4 w-4 bg-white mix-blend-difference"
        style={{
          transform: "translate3d(-100px,-100px,0)",
          clipPath: "polygon(0 0, 100% 50%, 0 100%)", // ▲
        }}
      />
      {/* Optional label that appears over links/buttons */}
      <div
        ref={labelRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] text-xs text-white/90 mix-blend-difference opacity-0 transition-opacity duration-150"
        style={{ transform: "translate3d(-100px,-100px,0)", fontWeight: 600 }}
      />
    </>
  );
}
