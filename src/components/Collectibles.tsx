"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Item = { id: string; left: string; top: string };

const DEFAULTS: Item[] = [
  { id: "c1", left: "18%", top: "32%" },
  { id: "c2", left: "52%", top: "22%" },
  { id: "c3", left: "78%", top: "38%" },
];

export default function Collectibles({
  items = DEFAULTS,
  storageKey = "collectibles_v1",
}: {
  items?: Item[];
  storageKey?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const [collected, setCollected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCollected(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(collected));
    } catch {}
  }, [collected, storageKey]);

  // Simple WebAudio blip (very subtle)
  const blip = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = 660;
      g.gain.value = 0.02;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 120);
    } catch {}
  };

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-[2]">
      {items.map((it) => (
        <Coin
          key={it.id}
          id={it.id}
          left={it.left}
          top={it.top}
          hidden={!!collected[it.id]}
          reduced={reduced}
          onCollect={() => {
            setCollected((s) => ({ ...s, [it.id]: true }));
            blip();
          }}
        />
      ))}
    </div>
  );
}

function Coin({
  id,
  left,
  top,
  hidden,
  reduced,
  onCollect,
}: {
  id: string;
  left: string;
  top: string;
  hidden: boolean;
  reduced: boolean;
  onCollect: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hidden || reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let mx = -9999, my = -9999;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = mx - cx, dy = my - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 140;
      const t = Math.max(0, Math.min(1, 1 - dist / radius));
      const max = 14;
      const tx = (dx / (dist || 1)) * max * t;
      const ty = (dy / (dist || 1)) * max * t;
      const rx = (-(dy / (dist || 1))) * 8 * t;
      const ry = ((dx / (dist || 1))) * 8 * t;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      el.style.transform = "translate3d(0,0,0)";
    };
  }, [hidden, reduced]);

  if (hidden) return null;

  return (
    <button
      ref={ref}
      type="button"
      onClick={onCollect}
      data-cursor="Collect"
      style={{ left, top }}
      className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full
                 border border-accent/70 bg-white/20 backdrop-blur-sm
                 [box-shadow:0_8px_30px_rgba(0,0,0,.25),inset_0_1px_0_rgba(255,255,255,.4)]
                 transition-transform duration-150 active:scale-95"
      aria-label={`Collectible ${id}`}
    >
      <span className="sr-only">Collect</span>
      <span className="block h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(120% 120% at 30% 25%, rgba(255,255,255,0.7), rgba(0,255,255,0.35) 35%, rgba(0,0,0,0.0) 65%)",
        }}
      />
    </button>
  );
}

