"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin page-scroll progress indicator for long-form reading. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary"
      style={{ scaleX }}
    />
  );
}
