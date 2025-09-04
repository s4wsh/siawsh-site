"use client";
import Link from "next/link";

export default function ServiceCard({
  title,
  blurb,
  href,
}: {
  // DO NOT CHANGE PUBLIC PROPS
  // TODO(siawsh): Export a `ServiceCardProps` type and reuse across callers.
  title: string;
  blurb: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      data-cursor="Explore"
      className="relative isolate overflow-hidden rounded-[1.25rem] border border-mist p-5 bg-paper/90
                 shadow-[0_10px_24px_rgba(0,0,0,0.06)]
                 transform-gpu transition-transform duration-300
                 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
      style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
    >
      {/* subtle edge feather to avoid anti-alias seams when scaled */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.25rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]" />
      {/* consistent header row height = aligned pills across cards */}
      <div className="flex items-center justify-between min-h-8">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span
          className="text-xs px-2 py-1 rounded bg-accent text-ink"
          style={{ transform: "translateZ(40px)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          Explore
        </span>
      </div>
      <p className="mt-2 text-sm text-neutral-600">{blurb}</p>
    </Link>
  );
}
