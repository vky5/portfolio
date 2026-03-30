"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export function Loader({ fullScreen = false, message }: LoaderProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl"
    : "flex flex-col items-center justify-center py-12 w-full";

  return (
    <div className={containerClasses}>
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Pulsing Glow */}
        <motion.div
          className="absolute inset-2 rounded-full bg-primary/20 blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dash Circle */}
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-dashed border-primary/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-10 h-10 bg-primary/30 backdrop-blur-md rounded-lg border border-primary/50 shadow-[0_0_20px_rgba(255,165,0,0.4)]"
            animate={{ 
              rotate: [45, 135, 45],
              scale: [0.8, 1, 0.8],
              borderRadius: ["20%", "50%", "20%"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Orbital nodes */}
        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(255,165,0,0.8)]"
            style={{ 
              top: "50%", 
              left: "50%",
              marginLeft: "-0.1875rem",
              marginTop: "-0.1875rem"
            }}
            animate={{
              rotate: [0, 360],
              x: Math.cos((angle * Math.PI) / 180) * 44,
              y: Math.sin((angle * Math.PI) / 180) * 44
            }}
            transition={{ 
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              duration: 0 
            }}
          />
        ))}
      </div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-sm font-medium text-primary tracking-[0.2em] uppercase"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
