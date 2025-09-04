// src/components/CornerHomeHotspot.tsx
"use client";
import Link from "next/link";

export default function CornerHomeHotspot({ className = "" }: {
  // DO NOT CHANGE PUBLIC PROPS
  // TODO(siawsh): Add `label` override if needed.
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Home"
      data-cursor="Home"
      className={`block opacity-0 hover:opacity-0 ${className}`}
    >
      <span className="sr-only">Home</span>
    </Link>
  );
}
