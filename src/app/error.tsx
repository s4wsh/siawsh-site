// src/app/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // You can wire this to your logging service
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl md:text-5xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-neutral-600">Please try again.</p>
      <button
        onClick={() => reset()}
        className="mt-6 px-4 py-2 rounded-lg bg-accent text-ink font-medium"
        data-cursor="Retry"
      >
        Reload
      </button>
    </div>
  );
}
