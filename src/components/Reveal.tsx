"use client";

import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
