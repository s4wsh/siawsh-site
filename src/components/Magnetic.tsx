"use client";

import { ReactNode, useRef } from "react";

// DO NOT CHANGE PUBLIC PROPS
// TODO(siawsh): Respect `prefers-reduced-motion`; add `disabled` flag to opt-out.
type Props = {
  children: ReactNode;   // e.g. <Link>…</Link> or <button>…</button>
  strength?: number;     // px drift
  rotate?: number;       // deg tilt
  className?: string;
};

export default function Magnetic({
  children,
  strength = 4,
  rotate = 8,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;

    // clamp then map
    const rx = Math.max(-0.5, Math.min(0.5, py)) * -rotate;
    const ry = Math.max(-0.5, Math.min(0.5, px)) *  rotate;

    el.style.transform =
      `translate3d(${px * strength}px, ${py * strength}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block ${className}`}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </span>
  );
}
