"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const sections = ["Home", "Projects", "Skills", "Blog", "Contact"];
const bgColors = ["#DADADA", "#C8C8C8", "#B5B5B5", "#A3A3A3", "#909090"];

export default function HorizontalScroll() {
  const scrollRef = useRef(null);
  let scrollAmount = 0;

  const handleWheelScroll = (e) => {
    e.preventDefault(); // Prevent default rough scrolling

    if (scrollRef.current) {
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      
      // Smoothly animate scrollLeft using requestAnimationFrame
      const smoothScroll = () => {
        scrollRef.current.scrollLeft += scrollAmount * 0.1; // Slow smooth effect
        scrollAmount *= 0.9; // Reduce scroll speed over time (inertia)
        if (Math.abs(scrollAmount) > 0.5) {
          requestAnimationFrame(smoothScroll);
        }
      };

      // Set the new scroll speed
      scrollAmount += e.deltaY * 2; // Multiply for a better effect
      scrollAmount = Math.max(-maxScroll, Math.min(scrollAmount, maxScroll));

      requestAnimationFrame(smoothScroll);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="w-full h-full flex overflow-x-auto scrollbar-hide space-x-5"
      onWheel={handleWheelScroll}
      style={{scrollbarWidth: "none"}}
    >
      {sections.map((section, index) => (
        <motion.div
          key={section}
          className="min-w-full h-full flex items-center justify-center text-3xl font-bold"
          style={{ background: bgColors[index] }}
        >
          {section}
        </motion.div>
      ))}
    </div>
  );
}
