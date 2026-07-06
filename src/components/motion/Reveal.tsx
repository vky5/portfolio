"use client";

import { motion } from "framer-motion";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

/** Fades content in once as it enters the viewport. Small distance, fast. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
