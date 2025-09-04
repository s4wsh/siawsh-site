"use client";

import { useEffect, useMemo, useState } from "react";

export default function TypingText({
  text,
  speed = 28, // ms per char
  className = "",
  caret = true,
}: {
  text: string;
  speed?: number;
  className?: string;
  caret?: boolean;
}) {
  const [i, setI] = useState(0);
  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReduced) { setI(text.length); return; }
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      if (i >= text.length) return;
      if (now - last >= speed) {
        setI((n) => Math.min(text.length, n + 1));
        last = now;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, speed, prefersReduced, i]);

  const shown = text.slice(0, i);
  return (
    <span className={className} aria-label={text}>
      {shown}
      {caret && i < text.length && (
        <span className="inline-block w-2 h-[1em] align-[-0.15em] bg-ink ml-0.5 animate-pulse" aria-hidden />
      )}
    </span>
  );
}

