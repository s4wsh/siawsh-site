"use client";

import { ReactNode, useEffect, useMemo, useRef } from "react";

export default function Magnet({
  children,
  radius = 140,
  strength = 18,
  rotate = 10,
  snap = true,
  snapDistance = 56,     // px from center where it begins to "grab"
  snapMaxOffset = 40,    // hard cap in px so layout doesn't break
  scaleOnSnap = 1.04,    // slight scale when snapped
  className = "",
}: {
  children: ReactNode;
  radius?: number;        // px influence radius around the element center
  strength?: number;      // max px drift at center
  rotate?: number;        // max deg tilt at center
  snap?: boolean;         // enable snap-to-cursor feeling near center
  snapDistance?: number;  // distance threshold for snapping
  snapMaxOffset?: number; // max translation during snap
  scaleOnSnap?: number;   // scale when in snap zone
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    // Cache a stable center (ignores transform) to avoid feedback jitter
    let baseCx = 0, baseCy = 0;
    const measure = () => {
      const prev = el.style.transform;
      el.style.transform = 'none';
      const box = el.getBoundingClientRect();
      baseCx = box.left + box.width / 2;
      baseCy = box.top + box.height / 2;
      el.style.transform = prev;
    };
    measure();

    // Track mouse and animate via RAF with smoothing
    let raf = 0;
    let mx = -9999, my = -9999; // mouse
    const state = { tx: 0, ty: 0, rx: 0, ry: 0, sc: 1 };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onResize = () => {
      if (!raf) raf = requestAnimationFrame(() => { measure(); apply(); });
    };

    const apply = () => {
      raf = 0;
      const dx = mx - baseCx;
      const dy = my - baseCy;
      const dist = Math.hypot(dx, dy);
      const t = Math.max(0, Math.min(1, 1 - dist / radius)); // 0..1
      // Desired transform
      let dtx = 0, dty = 0, drx = 0, dry = 0, dsc = 1;
      if (t > 0) {
      const nx = dx / (dist || 1); // unit vector
      const ny = dy / (dist || 1);
        dtx = nx * strength * t; // drift toward cursor
        dty = ny * strength * t;

      // Snap zone: when very close, pull stronger toward cursor with a hard cap
        if (snap && dist < snapDistance) {
          const snapT = 1 - dist / Math.max(1, snapDistance); // 0..1
          dtx = Math.max(-snapMaxOffset, Math.min(snapMaxOffset, dx * snapT));
          dty = Math.max(-snapMaxOffset, Math.min(snapMaxOffset, dy * snapT));
          drx = -ny * rotate * (t + snapT * 0.5);
          dry = nx * rotate * (t + snapT * 0.5);
          dsc = 1 + (scaleOnSnap - 1) * snapT;
        } else {
          drx = -ny * rotate * t;  // tilt opposite to motion for depth
          dry = nx * rotate * t;
          dsc = 1;
        }
      }

      // Smooth toward desired transform
      const S = 0.18; // smoothing factor
      state.tx = lerp(state.tx, dtx, S);
      state.ty = lerp(state.ty, dty, S);
      state.rx = lerp(state.rx, drx, S);
      state.ry = lerp(state.ry, dry, S);
      state.sc = lerp(state.sc, dsc, S);

      // Round to reduce subpixel shimmer
      const txOut = Math.round(state.tx * 10) / 10;
      const tyOut = Math.round(state.ty * 10) / 10;
      const rxOut = Math.round(state.rx * 10) / 10;
      const ryOut = Math.round(state.ry * 10) / 10;
      const scOut = Math.round(state.sc * 1000) / 1000;
      el.style.transform = `translate3d(${txOut}px, ${tyOut}px, 0) rotateX(${rxOut}deg) rotateY(${ryOut}deg) scale(${scOut})`;

      // Keep animating while not settled
      const stillMoving = Math.abs(state.tx - dtx) + Math.abs(state.ty - dty) + Math.abs(state.rx - drx) + Math.abs(state.ry - dry) + Math.abs(state.sc - dsc) > 0.01;
      if (stillMoving) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onResize, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
      cancelAnimationFrame(raf);
      el.style.transform = "translate3d(0,0,0) rotateX(0deg) rotateY(0deg) scale(1)";
    };
  }, [radius, strength, rotate, reduced]);

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </span>
  );
}
