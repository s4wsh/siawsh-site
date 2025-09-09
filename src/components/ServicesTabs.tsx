"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Reveal from "@/components/Reveal";
import { motion, useSpring } from "framer-motion";

type Cat = "interior" | "graphic" | "motion";

export default function ServicesTabs() {
  const sp = useSearchParams();
  const [active, setActive] = useState<Cat>("interior");
  // Sequential pulse index (0..tabs.length-1)
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const q = (sp?.get("category") || "").toLowerCase();
    const pick = (v: string): Cat | null => (v === "interior" || v === "graphic" || v === "motion") ? (v as Cat) : null;
    const chosen = pick(q) || null;
    if (chosen) setActive(chosen);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs: { key: Cat; title: string; blurb: string; cta: { href: string; label: string }[] }[] = useMemo(() => ([
    {
      key: "interior",
      title: "Interior",
      blurb: "Spaces with clean lines, light, and function.",
      cta: [
        { href: "/work?category=interior", label: "See interior work" },
        { href: "/contact", label: "Start interior project" },
      ],
    },
    {
      key: "graphic",
      title: "Graphic",
      blurb: "Branding and visuals that speak clearly.",
      cta: [
        { href: "/work?category=graphic", label: "See graphic work" },
        { href: "/contact", label: "Start graphic project" },
      ],
    },
    {
      key: "motion",
      title: "Motion",
      blurb: "Smooth, satisfying animations for brands and spaces.",
      cta: [
        { href: "/work?category=motion", label: "See motion work" },
        { href: "/contact", label: "Start motion project" },
      ],
    },
  ]), []);

  // Start sequential pulsing: wait 3.5s, then pulse 1→2→3 each 0.5s, then pause 3.5s, loop
  useEffect(() => {
    let alive = true;
    const tids: number[] = [];
    const run = () => {
      if (!alive) return;
      const base = 3500; // initial pause
      tids.push(window.setTimeout(() => alive && setPulseIndex(0), base + 0));
      tids.push(window.setTimeout(() => alive && setPulseIndex(1), base + 500));
      tids.push(window.setTimeout(() => alive && setPulseIndex(2), base + 1000));
      // clear and repeat after final step + small buffer
      tids.push(window.setTimeout(() => {
        if (!alive) return;
        setPulseIndex(-1 as any);
        run();
      }, base + 1500));
    };
    run();
    return () => { alive = false; tids.forEach(clearTimeout); };
  }, [tabs.length]);

  const current = tabs.find(t => t.key === active) || tabs[0];

  return (
    <>
      {/* Tabs — gaming style sparkles with slow, springy hover expansion */}
      <div className="mt-8 flex gap-3">
        {tabs.map((t) => (
          <Chip
            key={t.key}
            title={t.title}
            color={t.key === "interior" ? "cyan" : t.key === "graphic" ? "emerald" : "fuchsia"}
            active={active === t.key}
            onClick={() => setActive(t.key)}
            scheduledPulse={pulseIndex === tabs.findIndex(x=>x.key===t.key)}
          />
        ))}
      </div>

      {/* Active panel */}
      <Reveal>
        <div className="mt-6 rounded-2xl border border-mist p-6 bg-paper/80">
          <h2 className="text-xl font-semibold">{current.title}</h2>
          <p className="mt-2 text-sm text-neutral-700 max-w-prose">{current.blurb}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {current.cta.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="px-3 py-2 rounded-lg border border-mist hover:border-ink/30"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </>
  );
}

function Chip({ title, color, active, onClick, scheduledPulse }: { title: string; color: "cyan"|"emerald"|"fuchsia"; active: boolean; onClick: () => void; scheduledPulse: boolean }) {
  // Slower, softer spring
  const spring = { type: "spring", stiffness: 200, damping: 26, mass: 1.0 } as const;
  const rx = useSpring(0, spring);
  const ry = useSpring(0, spring);
  const sc = useSpring(1, spring);
  const mw = useSpring(36, spring); // max-width in px: 36 collapsed, ~192 expanded
  const op = useSpring(0, spring);  // label opacity 0..1
  const tr = useSpring(-6, spring); // label translateX
  const ref = useRef<HTMLButtonElement | null>(null);
  const [pulse, setPulse] = useState(false);
  const [hover, setHover] = useState(false);

  // Hover-driven open/close; if active, stay open with neon
  useEffect(() => {
    const open = hover || active;
    mw.set(open ? 192 : 36);
    op.set(open ? 1 : 0);
    tr.set(open ? 0 : -6);
    sc.set(open ? 1.04 : 1);
  }, [hover, active]);

  // Sequential subtle shine when closed (label hidden)
  useEffect(() => {
    const hidden = (op.get ? (op.get() as number) < 0.2 : true);
    if (!active && scheduledPulse && hidden) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 700);
      return () => clearTimeout(t);
    }
  }, [scheduledPulse, active]);

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const dx = (x / r.width - 0.5) * 2; // -1..1
    const dy = (y / r.height - 0.5) * 2;
    ry.set(dx * 4); // gentler tilt
    rx.set(-dy * 4);
  };
  const onEnter = () => setHover(true);
  const onLeave = () => { setHover(false); rx.set(0); ry.set(0); };

  return (
    <motion.button
      type="button"
      aria-label={title}
      aria-expanded={active}
      onClick={() => { sc.set(1.02); onClick(); }}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      data-cursor={`Switch ${title}`}
      layout
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, scale: sc, maxWidth: mw as unknown as number }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={spring as any}
      className={`group relative flex items-center h-9 overflow-hidden rounded-full border transition-[box-shadow,border-color] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[max-width,transform] cursor-pointer ${
        active ? "bg-ink text-paper border-accent shadow-[0_6px_18px_rgba(0,0,0,0.22)]" : "hover:border-ink/40"
      } pl-2 pr-0 focus:outline-none focus:ring-2 focus:ring-accent`}
      >
      {/* Persistent frame when selected */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-full transition-shadow ${
          active ? 'ring-2 ring-accent/70' : 'ring-0'
        }`}
      />
      {/* Aura glow */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-3 -z-10 rounded-full blur-2xl transition-opacity ${
          (hover || active) ? 'opacity-60' : 'opacity-0'
        }`}
        style={{
          background:
            color === "cyan"
              ? "radial-gradient(40% 40% at 50% 50%, rgba(34,211,238,0.5), transparent 70%)"
              : color === "emerald"
              ? "radial-gradient(40% 40% at 50% 50%, rgba(52,211,153,0.5), transparent 70%)"
              : "radial-gradient(40% 40% at 50% 50%, rgba(232,121,249,0.5), transparent 70%)",
        }}
      />
      <motion.span
        className={`mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.04)] ${
          color === "cyan" ? "bg-cyan-400" : color === "emerald" ? "bg-emerald-400" : "bg-fuchsia-400"
        }`}
        animate={active
          ? { scale: 1.06, boxShadow: `0 0 0 12px rgba(255,255,255,0.10)` }
          : pulse
          ? { scale: 1.14, boxShadow: `0 0 0 10px rgba(255,255,255,0.08)` }
          : { scale: 1, boxShadow: "0 0 0 1px rgba(0,0,0,0.04)" }}
        transition={{ type: "spring", stiffness: 280, damping: 24, mass: 1 }}
      />
      <motion.span
        className="pr-3 text-sm whitespace-nowrap"
        style={{ opacity: op, x: tr }}
      >
        {title}
      </motion.span>
    </motion.button>
  );
}
