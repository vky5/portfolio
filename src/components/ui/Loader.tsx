"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export function Loader({ fullScreen = false, message }: LoaderProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl"
    : "flex flex-col items-center justify-center py-12 w-full";

  return (
    <div className={containerClasses}>
      {/* Scanline Effect for FullScreen */}
      {fullScreen && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-primary animate-[scan_3s_linear_infinite]" />
          <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
      )}

      <div className="relative w-32 h-32 scale-110 md:scale-125">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Pulsing Glow */}
        <motion.div
          className="absolute inset-4 rounded-full bg-primary/20 blur-2xl"
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dash Circle */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-dashed border-primary/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Hexagonal Pattern / Inner Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 bg-primary/40 backdrop-blur-lg rounded-xl border border-primary/60 shadow-[0_0_30px_rgba(255,165,0,0.5)]"
            animate={{ 
              rotate: [45, 135, 45],
              scale: [0.9, 1.1, 0.9],
              borderRadius: ["30%", "50%", "30%"]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Orbital nodes with trails */}
        {[0, 120, 240].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_rgba(255,165,0,1)]"
            style={{ 
              top: "50%", 
              left: "50%",
              marginLeft: "-0.25rem",
              marginTop: "-0.25rem"
            }}
            animate={{
              rotate: [0, 360],
              x: Math.cos((angle * Math.PI) / 180) * 58,
              y: Math.sin((angle * Math.PI) / 180) * 58
            }}
            transition={{ 
              rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" },
              duration: 0 
            }}
          />
        ))}

        {/* Internal rotating segments */}
        <motion.div
            className="absolute inset-8 border-t-2 border-primary/40 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {message && (
        <div className="mt-12 flex flex-col items-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold text-primary tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(255,165,0,0.5)]"
            >
              {message}
            </motion.p>
            <motion.div 
               className="h-0.5 bg-primary/30 mt-2 rounded-full overflow-hidden"
               initial={{ width: 0 }}
               animate={{ width: 120 }}
               transition={{ duration: 1 }}
            >
                <motion.div 
                   className="h-full bg-primary shadow-[0_0_10px_rgba(255,165,0,1)]"
                   animate={{ x: [-120, 120] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}
