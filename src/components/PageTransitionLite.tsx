"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransitionLite({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: `translateY(${show ? 0 : 8}px)`,
        filter: show ? "blur(0px)" : "blur(4px)",
        transition:
          "opacity .35s cubic-bezier(.22,1,.36,1), transform .35s cubic-bezier(.22,1,.36,1), filter .35s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {children}
    </div>
  );
}
