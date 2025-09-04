"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// DO NOT CHANGE PUBLIC PROPS
// TODO(siawsh): Source links from a central content config to avoid drift.
type Props = {
  open: boolean;
  onClose: () => void;
  /** called on unmount to restore focus to the opener */
  returnFocus?: () => void;
};

const TO_PREFETCH = ["/about", "/services", "/contact", "/case-studies"];

export default function MenuOverlay({ open, onClose, returnFocus }: Props) {
  const refBackdrop = useRef<HTMLDivElement>(null);
  const refPanel = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Prefetch when opened
  useEffect(() => {
    if (!open) return;
    TO_PREFETCH.forEach((p) => router.prefetch(p));
  }, [open, router]);

  // Keep menu interactions snappy; no extra page/menu transitions

  // Focus trap + restore focus
  useEffect(() => {
    if (!open) return;
    const panel = refPanel.current;
    if (!panel) return;

    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const prevActive = document.activeElement as HTMLElement | null;
    const to = setTimeout(() => first?.focus(), 0);

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusables.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          (last || first).focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          (first || last).focus();
        }
      }
    };

    panel.addEventListener("keydown", trap);

    return () => {
      clearTimeout(to);
      panel.removeEventListener("keydown", trap);
      // restore to opener (or previous active)
      if (returnFocus) returnFocus();
      else prevActive?.focus();
    };
  }, [open, returnFocus]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    setTimeout(() => router.push(href), 0);
  };

  const hoverPrefetch = (href: string) => router.prefetch(href);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="menu-overlay fixed inset-0 z-[70] text-white"
    >
      {/* Backdrop: gradient (no 404) */}
      <div
        ref={refBackdrop}
        onClick={(e) => {
          if (e.target === refBackdrop.current) onClose();
        }}
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 20% 20%, rgba(255,255,255,0.06), transparent 60%), radial-gradient(1200px 800px at 80% 80%, rgba(0,255,255,0.08), transparent 60%), #000",
          boxShadow: "inset 0 0 0 100vmax rgba(0,0,0,0.55)",
        }}
      />

      {/* Foreground */}
      <div
        ref={refPanel}
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 outline-none"
        tabIndex={-1}
      >
        <ul className="space-y-6 text-center">
          <MenuButton label="The Studio"   href="/about"          onHover={hoverPrefetch} onClick={() => go("/about")} />
          <MenuButton label="Our approach" href="/about#approach" onHover={hoverPrefetch} onClick={() => go("/about#approach")} />
          <MenuButton label="Services"     href="/services"       onHover={hoverPrefetch} onClick={() => go("/services")} />
          <MenuButton label="Awards"       href="/about#awards"   onHover={hoverPrefetch} onClick={() => go("/about#awards")} />
          <MenuButton label="Clients"      href="/about#clients"  onHover={hoverPrefetch} onClick={() => go("/about#clients")} />
        </ul>

        <div className="mt-10">
          <button
            onMouseEnter={() => hoverPrefetch("/contact")}
            onClick={() => go("/contact")}
            data-cursor="Contact"
          className="text-lg underline decoration-white/40 underline-offset-4 hover:decoration-white transition"
          >
            Contact us
          </button>
        </div>

        <button
          onClick={onClose}
          data-cursor="Close"
          aria-label="Close menu"
          className="absolute top-4 right-4 rounded-lg border border-white/20 px-3 py-1.5 hover:border-white/40 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function MenuButton({
  label,
  href,
  onHover,
  onClick,
}: {
  label: string;
  href: string;
  onHover: (href: string) => void;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onMouseEnter={() => onHover(href)}
        onClick={onClick}
        data-cursor={label}
        className="block font-serif text-[40px] leading-none md:text-[64px]
                   tracking-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]
                   hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-white/40 rounded-lg px-2"
      >
        {label}
      </button>
    </li>
  );
}
