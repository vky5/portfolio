"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const sections = ["Home", "Projects", "Skills", "Blog", "Contact"];
const bgColors = ["#DADADA", "#C8C8C8", "#B5B5B5", "#A3A3A3", "#909090"];
const numb = [1, 2, 3, 4, 5];

export default function HorizontalScroll() {
  const scrollRef = useRef(null);
  let scrollAmount = 0;

  const handleWheelScroll = (e) => {
    e.preventDefault(); // Prevent default rough scrolling

    if (scrollRef.current) {
      const maxScroll =
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

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
      // ref={scrollRef}
      className="w-full h-full  flex"
      // onWheel={handleWheelScroll}
      style={{ scrollbarWidth: "none" }}
    >
      <div
        className="
       bg-gradient-to-r from-[#6A0DAD] to-[#EDEDED] h-full border-2 w-1/4 flex-shrink-0
      "
      ></div>

      <div
        className="
        w-full overflow-x-auto flex space-x-5 h-full items-center"
        ref={scrollRef}
        style={{ scrollbarWidth: "none" }}
        onWheel={handleWheelScroll}
      >
        {sections.map((section, index) => (
          <motion.div
            key={section}
            className={`min-w-3/4 h-4/5 flex items-center justify-center text-3xl font-bold`}
            style={{ background: bgColors[index] }}
          >
            {section}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
