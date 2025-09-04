"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function IntroSpotlight({
  durationMs = 3000,
  radius = 160,
  darkness = 0.96,
}: {
  durationMs?: number;
  radius?: number;
  darkness?: number; // 0..1
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -9999, y: -9999 });
  const movedRef = useRef(false);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip on touch devices
    if (matchMedia("(pointer: coarse)").matches) return;

    setMounted(true);
    const onMove = (e: MouseEvent) => {
      movedRef.current = true;
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      const el = overlayRef.current;
      if (el) {
        el.style.background = `radial-gradient(${radius}px ${radius}px at ${pos.current.x}px ${pos.current.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,${Math.min(darkness,1)}) 60%, rgba(0,0,0,1) 100%)`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    
    // Show on home page initial load (every hard reload)
    if (pathname === "/") {
      setVisible(true);
      window.setTimeout(() => setVisible(false), durationMs);
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [durationMs, pathname]);

  // Do not re-trigger on route changes (only on initial load)

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 96,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 600ms cubic-bezier(0.22,1,0.36,1)",
        background: movedRef.current
          ? `radial-gradient(${radius}px ${radius}px at ${pos.current.x}px ${pos.current.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,${Math.min(darkness,1)}) 60%, rgba(0,0,0,1) 100%)`
          : `rgba(0,0,0,${Math.min(darkness,1)})`,
      }}
    />
  );
}
