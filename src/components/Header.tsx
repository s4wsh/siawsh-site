"use client";

import { useEffect, useRef, useState } from "react";
import MenuOverlay from "./MenuOverlay";
import CornerHomeHotspot from "./CornerHomeHotspot";

// DO NOT CHANGE PUBLIC PROPS
// TODO(siawsh): Consider adding `variant` (default|transparent|compact) without breaking existing usage.
type HeaderProps = {
  /** Set false on pages where you don’t want the sticky auto-scroll warning. */
  sticky?: boolean;
  className?: string;
};

export default function Header({ sticky = true, className = "" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [logoOk, setLogoOk] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null); // will restore focus here

  // lock scroll when overlay open
  useEffect(() => {
    const el = document.documentElement;
    if (open) el.classList.add("overflow-hidden");
    else el.classList.remove("overflow-hidden");
    return () => el.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <>
      <header
        className={`${sticky ? "sticky top-0" : ""} z-50 bg-[#101010] text-white backdrop-blur border-b border-white/10 ${className}`}
      >
        <div className="relative mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          {/* Bigger hidden Home hotspot (visible to your custom cursor only) */}
          <CornerHomeHotspot className="absolute left-0 top-0 h-14 w-28 md:w-40 lg:w-56 z-[60]" />

          <div /> {/* left spacer */}

          {/* Right trigger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            data-cursor="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            className="group relative inline-flex items-center gap-2 rounded-xl px-3 py-1.5
                       border border-mist hover:border-ink/20 transition
                       will-change-transform hover:-translate-y-[1px] hover:translate-x-[1px]
                       motion-reduce:transform-none z-[55]"
          >
            {/* “About =” layer */}
            <span className="pointer-events-none flex items-center gap-2 transition-opacity duration-300 group-hover:opacity-0">
              <span className="text-sm">About</span>
              <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-80" aria-hidden="true">
                <path fill="currentColor" d="M5 8h14v2H5zM5 14h14v2H5z" />
              </svg>
            </span>

            {/* Logo layer */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {logoOk ? (
                <img
                  src="/logo-ss.png" // must exist at /public/logo-ss.png
                  alt="Siawsh Studio"
                  className="h-6 w-6 rounded-md transition-transform duration-300 ease-out
                             group-hover:-translate-y-[1px] group-hover:translate-x-[1px]
                             motion-reduce:transition-none motion-reduce:transform-none"
                  onError={() => setLogoOk(false)}
                />
              ) : (
                <span className="text-sm font-semibold">SS</span>
              )}
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay
        open={open}
        onClose={() => setOpen(false)}
        returnFocus={() => triggerRef.current?.focus()} // ✅ no TS mismatch
      />
    </>
  );
}
