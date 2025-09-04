"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ScrollSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // start when section enters bottom, end when it leaves top
    offset: ["start end", "end start"],
  });
  // Fade out as the section scrolls away
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.7, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 24]);

  return (
    <motion.section ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.section>
  );
}

