"use client";
import { useRef } from "react";

export default function Hero3D() {
  const wrap = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${py * -6}deg`);
    el.style.setProperty("--ry", `${px * 8}deg`);
  }
  function reset() {
    const el = wrap.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  }

  return (
    <section className="pt-10">
      <div
        ref={wrap}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="rounded-2xl border border-mist overflow-hidden"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* background bed */}
        <div className="bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(0,255,255,0.18),transparent),radial-gradient(900px_500px_at_95%_110%,rgba(0,255,255,0.12),transparent)]">
          {/* content grid (no absolute positioning → no overlap) */}
          <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Copy panel */}
            <div
              className="relative"
              style={{
                transform:
                  "translateZ(50px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
                transition: "transform 150ms ease",
              }}
            >
              <p className="text-xs tracking-widest text-neutral-500">
                SIAWSH STUDIO
              </p>
              <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-tight">
                Design that feels calm—and works.
              </h1>
              <p className="mt-4 max-w-xl text-neutral-400 md:text-neutral-700">
                Minimal, future-modern interior, graphic and motion design with
                real process and results.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="/contact" className="px-4 py-2 rounded-lg bg-accent text-ink font-medium">
                  Start a project
                </a>
                <a href="/case-studies" className="px-4 py-2 rounded-lg border border-mist">
                  View work
                </a>
              </div>
            </div>

            {/* Media panel */}
            <div
              className="relative"
              style={{
                transform:
                  "translateZ(90px) rotateX(calc(var(--rx,0deg)*1.2)) rotateY(calc(var(--ry,0deg)*1.2))",
                transition: "transform 150ms ease",
              }}
            >
              <div className="aspect-video w-full rounded-2xl bg-paper/90 shadow-[0_20px_60px_rgba(0,0,0,0.25)] grid place-items-center text-neutral-500">
                Hero video placeholder
              </div>

              {/* accent slab behind media */}
              <div
                aria-hidden
                className="absolute -z-10 right-[-6%] bottom-[-10%] h-[58%] w-[55%] rounded-3xl bg-accent/80"
                style={{
                  transform:
                    "translateZ(0) rotateX(calc(var(--rx,0deg)*0.8)) rotateY(calc(var(--ry,0deg)*0.8))",
                  filter: "blur(0.2px)",
                  transition: "transform 150ms ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
