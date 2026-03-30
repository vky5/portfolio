"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoaderProps {
  fullScreen?: boolean;
}

export function Loader({ fullScreen = false }: LoaderProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl"
    : "flex flex-col items-center justify-center py-12 w-full";

  // Solar system orbits configuration: [radius, duration, color_opacity, size, initial_angle]
  const orbits = [
    { r: 25, d: 2, o: 0.15, s: 4, a: 0 },   // inner
    { r: 40, d: 4, o: 0.1, s: 3, a: 120 }, // middle
    { r: 60, d: 8, o: 0.08, s: 5, a: 240 }, // outer
    { r: 85, d: 15, o: 0.05, s: 6, a: 45 }, // far
  ];

  return (
    <div className={containerClasses + " overflow-hidden"}>
      {/* Stellar Field (Background Stars) */}
      {fullScreen && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary/40 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      )}

      {/* Orbiting System */}
      <div className="relative w-48 h-48 flex items-center justify-center scale-90 md:scale-110">
        
        {/* Central Sun */}
        <div className="relative z-20">
            <motion.div
              className="w-10 h-10 bg-primary rounded-full shadow-[0_0_40px_rgba(255,165,0,0.8),0_0_80px_rgba(255,165,0,0.4)]"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                    "0 0 40px rgba(255,165,0,0.8)",
                    "0 0 60px rgba(255,165,0,1)",
                    "0 0 40px rgba(255,165,0,0.8)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Sun Glow Flare */}
            <motion.div 
               className="absolute inset-[-20px] bg-primary/20 blur-3xl rounded-full"
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 4, repeat: Infinity }}
            />
        </div>

        {/* Orbits and Planets */}
        {orbits.map((orbit, i) => (
          <React.Fragment key={i}>
            {/* Orbital Path Line */}
            <div 
              className="absolute rounded-full border border-primary/20"
              style={{ 
                width: orbit.r * 2, 
                height: orbit.r * 2,
                opacity: orbit.o 
              }}
            />
            
            {/* Planet Container (Rotates) */}
            <motion.div
              className="absolute"
              style={{ 
                width: orbit.r * 2, 
                height: orbit.r * 2 
              }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: orbit.d, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {/* Actual Planet */}
              <div 
                className="absolute bg-primary rounded-full shadow-[0_0_10px_rgba(255,165,0,0.6)]"
                style={{ 
                    width: orbit.s, 
                    height: orbit.s,
                    top: -orbit.s / 2,
                    left: '50%',
                    marginLeft: -orbit.s / 2
                }}
              />
            </motion.div>
          </React.Fragment>
        ))}

        {/* Asteroid Belt (Small fast dots) */}
        <motion.div 
            className="absolute inset-0 rounded-full border border-dashed border-primary/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Subtle Scanlines Overlay */}
      {fullScreen && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      )}
    </div>
  );
}
