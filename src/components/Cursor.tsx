"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Triangle cursor that stays exactly under the mouse.
 * Label is edge-aware with light easing + flip cooldown.
 * All handlers guard against null refs (fixes runtime errors on HMR/unmount).
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const nearRef = useRef<HTMLElement | null>(null);
  const isOverInteractive = useRef(false);
  const guidingRef = useRef(false);
  const visibleRef = useRef(true);

  // Tunables
  const LABEL_ON_HOVER =
    process.env.NEXT_PUBLIC_CURSOR_LABEL_ON_HOVER === undefined
      ? true // default ON
      : !["0", "false", "off", "no"].includes(
          String(process.env.NEXT_PUBLIC_CURSOR_LABEL_ON_HOVER).toLowerCase()
        );
  const PADDING = 10;            // viewport clamp (kept for future)
  const FLIP_COOLDOWN_MS = 140;  // min ms between flips (kept for future)
  const NEAR_RADIUS = 140;       // px, radius for considering nearest
  const QUERY = "a[href],button:not(:disabled),[role=button],[data-cursor]";
  const LABEL_LERP = 0.2;        // smoothing for label position
  const LABEL_DIST_MAX = 72;     // px, max distance from cursor for label
  const LABEL_DIST_MIN = 24;     // px, min distance from cursor for label
  const LABEL_EDGE_MARGIN = 16;  // px, prefer opposite if near edge
  const LABEL_RESP_K = 10;       // 1/s, smoothing response (higher is snappier)

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (matchMedia("(pointer: coarse)").matches) return; // skip touch
    setEnabled(true);

    let rafId = 0;

    // pointer position (no easing for dot)
    let mouseX = -100, mouseY = -100;

    // smoothed label position
    let labelTX = mouseX, labelTY = mouseY;

    // sticky flips + cooldown (not used for label anymore, but kept for potential future)
    let lastFlip = 0;
    let lastTs = performance.now();

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // dot transform handled in tick (so we can include rotation)
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(QUERY);
      isOverInteractive.current = !!el;
    };

    const tick = () => {
      const dot = dotRef.current;
      const label = labelRef.current;
      const labelText = labelTextRef.current;
      if (!dot || !label || !labelText) {
        // If hot-reload removed elements, keep the loop alive but skip work
        rafId = requestAnimationFrame(tick);
        return;
      }

      const now = performance.now();
      const dt = Math.min(1 / 30, Math.max(0, (now - lastTs) / 1000));
      lastTs = now;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Determine interactive under pointer and scope (form/dialog) if any
      const underEl = document.elementFromPoint(mouseX, mouseY) as Element | null;
      const underTarget = underEl?.closest<HTMLElement>(QUERY) || null;

      // Nearest interactive guidance when not directly over one
      let usedGuidance = false;
      let showingLabel = false;
      let snappedAngle = 0;
      if (!underTarget) {
        const scope = (underEl as HTMLElement | null)?.closest<HTMLElement>('form,[role="dialog"],[data-modal]');
        const nodes = (scope || document).querySelectorAll<HTMLElement>(QUERY);
        let nearest: HTMLElement | null = null;
        let best = Infinity;
        let nearestCenterX = 0, nearestCenterY = 0;
        nodes.forEach((n) => {
          // ignore invisible or non-interactive via CSS
          const style = window.getComputedStyle(n);
          if (style.pointerEvents === "none" || style.visibility === "hidden" || parseFloat(style.opacity || "1") < 0.05) return;
          const r = n.getBoundingClientRect();
          if (r.width <= 1 && r.height <= 1) return;
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = cx - mouseX;
          const dy = cy - mouseY;
          const d2 = dx * dx + dy * dy;
          if (d2 < best) { best = d2; nearest = n; nearestCenterX = cx; nearestCenterY = cy; }
        });
        const RADIUS2 = NEAR_RADIUS * NEAR_RADIUS; // pixels squared
        if (nearest && best < RADIUS2) {
          // toggle highlight attr
          if (nearRef.current && nearRef.current !== nearest) {
            nearRef.current.removeAttribute("data-cursor-near");
          }
          nearRef.current = nearest;
          (nearest as Element).setAttribute("data-cursor-near", "1");
          // Direction towards nearest, snapped to 45°
          const vx = nearestCenterX - mouseX;
          const vy = nearestCenterY - mouseY;
          const dist = Math.hypot(vx, vy);
          const angle = Math.atan2(vy, vx);
          snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);

          guidingRef.current = true;

          // Rotate triangle towards snapped direction at cursor
          dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0) rotate(${(snappedAngle * 180) / Math.PI}deg)`;
          usedGuidance = true;

          // Short guidance text (<= 2 words), optional
          const elNearest = nearest as HTMLElement;
          const fallback = elNearest.tagName === "A" ? "Open" : elNearest.tagName === "BUTTON" ? "Click" : "";
          // prefer explicit attributes, otherwise visible text
          const rawAttr = elNearest.dataset.cursor || elNearest.getAttribute("aria-label") || elNearest.getAttribute("title") || "";
          let raw = rawAttr.trim();
          if (!raw) {
            const txt = (elNearest.innerText || elNearest.textContent || "").trim();
            raw = txt;
          }
          if (!raw) raw = fallback;
          // sanitize: strip arrows and extra symbols, collapse spaces, limit to 2 words
          raw = raw.replace(/[›»→⇢>]+/g, "").replace(/[\s\u00A0]+/g, " ").trim();
          const words = (raw || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
          const txt = words.join(" ");
          if (txt) {
            labelText.textContent = txt;
            // measure after setting text
            const lw = label.offsetWidth || 0;
            const lh = label.offsetHeight || 0;
            const labelDist = Math.min(LABEL_DIST_MAX, Math.max(LABEL_DIST_MIN, dist * 0.25));

            // compute forward and opposite positions
            const fx = mouseX + Math.cos(snappedAngle) * labelDist - lw / 2;
            const fy = mouseY + Math.sin(snappedAngle) * labelDist - lh / 2;
            const ox = mouseX + Math.cos(snappedAngle + Math.PI) * labelDist - lw / 2;
            const oy = mouseY + Math.sin(snappedAngle + Math.PI) * labelDist - lh / 2;

            // penalty for being outside bounds or too near edges
            const penalty = (x: number, y: number) => {
              let p = 0;
              if (x < PADDING + LABEL_EDGE_MARGIN) p += (PADDING + LABEL_EDGE_MARGIN - x);
              if (y < PADDING + LABEL_EDGE_MARGIN) p += (PADDING + LABEL_EDGE_MARGIN - y);
              if (x + lw > w - (PADDING + LABEL_EDGE_MARGIN)) p += (x + lw - (w - (PADDING + LABEL_EDGE_MARGIN)));
              if (y + lh > h - (PADDING + LABEL_EDGE_MARGIN)) p += (y + lh - (h - (PADDING + LABEL_EDGE_MARGIN)));
              return p;
            };
            const pf = penalty(fx, fy);
            const po = penalty(ox, oy);

            const targetX = po < pf ? ox : fx;
            const targetY = po < pf ? oy : fy;

            // smooth with time-based response
            const s = 1 - Math.exp(-LABEL_RESP_K * dt);
            labelTX += (targetX - labelTX) * s;
            labelTY += (targetY - labelTY) * s;
            label.style.transform = `translate3d(${Math.round(labelTX)}px,${Math.round(labelTY)}px,0)`;
            label.style.opacity = "0.95";
            showingLabel = true;
          } else {
            labelText.textContent = "";
            label.style.opacity = "0";
          }
        } else if (nearRef.current) {
          nearRef.current.removeAttribute("data-cursor-near");
          nearRef.current = null;
        }
      } else if (nearRef.current) {
        nearRef.current.removeAttribute("data-cursor-near");
        nearRef.current = null;
      }

      // Hover label support when directly over an interactive target
      if (underTarget && LABEL_ON_HOVER) {
        const el = underTarget as HTMLElement;
        const fallback = el.tagName === "A" ? "Open" : el.tagName === "BUTTON" ? "Click" : "";
        const rawAttr = el.dataset.cursor || el.getAttribute("aria-label") || el.getAttribute("title") || "";
        let raw = rawAttr.trim();
        if (!raw) {
          const txt = (el.innerText || el.textContent || "").trim();
          raw = txt;
        }
        if (!raw) raw = fallback;
        raw = raw.replace(/[›»→⇢>]+/g, "").replace(/[\s\u00A0]+/g, " ").trim();
        const words = (raw || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
        const txt = words.join(" ");
        if (txt) {
          labelText.textContent = txt;
          // place label at a small offset to the right/below the cursor
          const lw = label.offsetWidth || 0;
          const lh = label.offsetHeight || 0;
          const offX = 16, offY = 10;
          let tx = mouseX + offX;
          let ty = mouseY + offY;
          // clamp to viewport with padding
          const pad = PADDING + LABEL_EDGE_MARGIN;
          if (tx + lw > w - pad) tx = mouseX - offX - lw; // flip to left if overflow
          if (ty + lh > h - pad) ty = mouseY - offY - lh; // flip above if overflow
          labelTX += ((tx - labelTX) * (1 - Math.exp(-LABEL_RESP_K * dt)));
          labelTY += ((ty - labelTY) * (1 - Math.exp(-LABEL_RESP_K * dt)));
          label.style.transform = `translate3d(${Math.round(labelTX)}px,${Math.round(labelTY)}px,0)`;
          label.style.opacity = "0.95";
          showingLabel = true;
        } else {
          labelText.textContent = "";
          label.style.opacity = "0";
        }
      }

      // Always keep the triangle glued to the pointer when not guiding
      if (!usedGuidance) {
        guidingRef.current = false;

        // Keep triangle default orientation (pointing right)
        dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0) rotate(0deg)`;
      }

      // Hide label if neither guidance nor hover logic is active this frame
      if (!showingLabel) label.style.opacity = "0";

      rafId = requestAnimationFrame(tick);
    };

    // Visibility helpers
    const setVisible = (v: boolean) => {
      visibleRef.current = v;
      const dot = dotRef.current;
      const label = labelRef.current;
      if (!dot || !label) return;
      const disp = v ? "block" : "none";
      dot.style.display = disp;
      label.style.display = disp;
      if (!v) {
        // also park off-screen in case styles are overridden
        dot.style.transform = "translate3d(-100px,-100px,0) rotate(0deg)";
        label.style.opacity = "0";
      }
    };

    const onLeaveWindow = () => setVisible(false);
    const onEnterWindow = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    // Hide cursor when leaving the viewport or tab loses focus
    document.addEventListener("mouseleave", onLeaveWindow, { passive: true });
    document.addEventListener("mouseenter", onEnterWindow, { passive: true });
    window.addEventListener("blur", onLeaveWindow, { passive: true });
    window.addEventListener("focus", onEnterWindow, { passive: true });
    document.addEventListener("visibilitychange", () => setVisible(!document.hidden));
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      window.removeEventListener("blur", onLeaveWindow);
      window.removeEventListener("focus", onEnterWindow);
      cancelAnimationFrame(rafId);
      if (nearRef.current) nearRef.current.removeAttribute("data-cursor-near");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Triangle pointer — glued to OS cursor */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-4 w-4 bg-white mix-blend-difference"
        style={{
          transform: "translate3d(-100px,-100px,0)",
          clipPath: "polygon(0 0, 100% 50%, 0 100%)",
          willChange: "transform",
        }}
      />
      {/* Minimal guidance label (<= 2 words) */}
      <div
        ref={labelRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] text-xs text-white/90 mix-blend-difference opacity-0 font-semibold"
        style={{ transform: "translate3d(-100px,-100px,0)", willChange: "transform,opacity" }}
      >
        <span ref={labelTextRef} />
      </div>
    </>
  );
}
