import React from "react";
import { motion } from "framer-motion";

type ProgressBarProps = {
  currentSlide: number;
  totalSlides: number;
};

function ProgressBar(props: ProgressBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-1 bg-white/5 z-20">
      {/* Progress bar */}
      <motion.div
        className="h-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_10px_rgba(255,165,0,0.5)]"
        initial={{ width: 0 }}
        animate={{
          width: `${((props.currentSlide + 1) / props.totalSlides) * 100}%`,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

export default ProgressBar;
