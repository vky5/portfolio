"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ExperienceItem } from "@/lib/data";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  items: ExperienceItem[];
};

export default function ExperienceSection({ items }: Props) {
  const works = items.filter((i) => i.type === "work" || !i.type);
  const achievements = items.filter((i) => i.type === "achievement");
  const ordered = [...works, ...achievements];
  const [activeId, setActiveId] = useState<string | null>(
    ordered[0]?._id ?? null,
  );
  const active = ordered.find((i) => i._id === activeId) ?? ordered[0];

  if (items.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-14 py-16 md:py-20">
      <SectionHeader kicker="experience" title="Where I've worked" />

      <Reveal>
        <div className="grid gap-8 md:grid-cols-[240px_1fr] md:gap-12">
          {/* Selector */}
          <div
            role="tablist"
            aria-label="Experience entries"
            aria-orientation="vertical"
            className="flex gap-1 overflow-x-auto no-scrollbar md:flex-col md:overflow-visible"
          >
            {ordered.map((item) => {
              const isActive = active?._id === item._id;
              return (
                <button
                  key={item._id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(item._id)}
                  className={`shrink-0 rounded-md px-3 py-2.5 text-left transition-colors md:shrink ${
                    isActive ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <span className="block font-mono text-[11px] text-muted-foreground">
                    {item.period}
                  </span>
                  <span
                    className={`block text-sm font-medium ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.type === "achievement" ? item.role : item.company}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail */}
          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {active && (
                <motion.article
                  key={active._id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <h3 className="text-xl font-medium tracking-tight text-foreground">
                    {active.role}
                  </h3>
                  <p className="mt-1 font-mono text-sm text-muted-foreground">
                    {active.company}
                    {active.period ? ` · ${active.period}` : ""}
                    {active.type === "achievement" ? " · achievement" : ""}
                  </p>

                  {active.description && (
                    <p className="mt-5 max-w-[65ch] leading-relaxed text-muted-foreground">
                      {active.description}
                    </p>
                  )}

                  {active.highlights?.length > 0 && (
                    <ul className="mt-5 space-y-2.5">
                      {active.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex max-w-[65ch] gap-3 leading-relaxed text-foreground/90"
                        >
                          <span className="mt-[0.7em] h-px w-3 shrink-0 bg-primary" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {active.skills?.length > 0 && (
                    <p className="mt-6 font-mono text-xs text-muted-foreground">
                      {active.skills.join(" · ")}
                    </p>
                  )}
                </motion.article>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
