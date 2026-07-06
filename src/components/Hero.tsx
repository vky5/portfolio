"use client";

import { motion } from "framer-motion";
import SystemDiagram from "@/components/SystemDiagram";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE },
});

export default function Hero() {
  return (
    <section
      id="top"
      className="grid min-h-[85svh] items-center gap-12 pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16"
    >
      <div>
        <motion.p
          {...enter(0)}
          className="mb-6 flex items-center gap-2 font-mono text-xs text-muted-foreground"
        >
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          all systems operational
        </motion.p>

        <motion.h1
          {...enter(0.08)}
          className="text-balance text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:tracking-tighter"
        >
          I build the systems other software runs on.
        </motion.h1>

        <motion.p
          {...enter(0.16)}
          className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground"
        >
          I&apos;m Vaibhav — a systems engineer working across Kubernetes,
          CI/CD pipelines, and distributed backends, plus the full-stack
          applications that sit on top of them.
        </motion.p>

        <motion.div
          {...enter(0.24)}
          className="mt-8 flex items-center gap-6 font-mono text-sm"
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-primary transition-colors hover:text-foreground"
          >
            get in touch →
          </a>
          <a
            href="https://github.com/vky5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            github ↗
          </a>
          <a
            href="https://www.linkedin.com/in/vky5/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            linkedin ↗
          </a>
        </motion.div>
      </div>

      <motion.div {...enter(0.3)} className="mx-auto w-full max-w-md pb-12 lg:max-w-none lg:pb-0">
        <SystemDiagram />
      </motion.div>
    </section>
  );
}
