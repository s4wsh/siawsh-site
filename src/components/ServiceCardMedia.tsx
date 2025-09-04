"use client";
import Link from "next/link";

export default function ServiceCardMedia({
  title,
  blurb,
  href,
  imgSrc,
  imgAlt = "",
}: {
  title: string;
  blurb: string;
  href: string;
  imgSrc: string;
  imgAlt?: string;
}) {
  return (
    <Link
      href={href}
      data-cursor="Explore"
      className="group relative isolate overflow-hidden rounded-[1.25rem] border border-mist bg-paper/90 shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
      style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
    >
      {/* Top media */}
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={imgSrc}
          alt={imgAlt || title}
          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center justify-between min-h-8">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-xs px-2 py-1 rounded bg-accent text-ink" style={{ transform: "translateZ(40px)" }}>
            Explore
          </span>
        </div>
        <p className="mt-2 text-sm text-neutral-600">{blurb}</p>
      </div>

      {/* Edge feather */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.25rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]" />
    </Link>
  );
}

