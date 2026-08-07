"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ExperienceItem } from "@/lib/data";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  items: ExperienceItem[];
};

// Cap on the collapsed panel height. Short entries (e.g. a two-line
// description, no highlights) render at their natural height — no padding
// out to this number, which would leave a dead gap above the skills line.
// It only kicks in as a real ceiling once content would otherwise exceed
// it, at which point a fade + expand button appear.
const COLLAPSED_HEIGHT = 200;

// Description + highlights can run long and vary a lot entry to entry —
// without a cap the panel height jumps around as you switch tabs. Declared
// as its own component (rather than inline in the parent) so the `expanded`
// state resets for free each time AnimatePresence remounts it on tab
// switch, instead of leaking across entries.
function DetailBody({ item }: { item: ExperienceItem }) {
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(COLLAPSED_HEIGHT);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasBody = Boolean(item.description) || item.highlights?.length > 0;
  const truncated = fullHeight > COLLAPSED_HEIGHT;

  // Measure the content's natural height once it's laid out so the
  // collapsed/expanded animation has a real target instead of "auto"
  // (which framer-motion can't tween smoothly).
  useLayoutEffect(() => {
    if (contentRef.current) setFullHeight(contentRef.current.scrollHeight);
  }, [item]);

  return (
    <>
      {hasBody && (
        <motion.div
          className="relative mt-5 overflow-hidden"
          initial={false}
          animate={{ height: expanded ? fullHeight : Math.min(fullHeight, COLLAPSED_HEIGHT) }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <div ref={contentRef}>
            {item.description && (
              <p className="max-w-[65ch] leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            )}

            {item.highlights?.length > 0 && (
              <ul className="mt-5 space-y-2.5">
                {item.highlights.map((h, i) => (
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
          </div>

          {!expanded && truncated && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background to-transparent" />
          )}
        </motion.div>
      )}

      {hasBody && truncated && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {expanded ? "Show less" : "Show more"}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {item.skills?.length > 0 && (
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {item.skills.join(" · ")}
        </p>
      )}
    </>
  );
}

export default function ExperienceSection({ items }: Props) {
  // Open-source contributions get their own section (see OpenSource.tsx) —
  // they're not an employer relationship, so they're excluded here.
  const works = items.filter((i) => i.type === "work" || !i.type);
  const achievements = items.filter((i) => i.type === "achievement");
  const ordered = [...works, ...achievements];
  const [activeId, setActiveId] = useState<string | null>(
    ordered[0]?._id ?? null,
  );
  const active = ordered.find((i) => i._id === activeId) ?? ordered[0];

  if (ordered.length === 0) return null;

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
                  className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left transition-colors md:shrink ${
                    isActive ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  {item.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.logo}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded border border-border/60 bg-zinc-200 object-contain p-0.5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] text-muted-foreground">
                      {item.period}
                    </span>
                    <span
                      className={`block truncate text-sm font-medium ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.type === "achievement" ? item.role : item.company}
                    </span>
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
                  <div className="flex items-center gap-3">
                    {active.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={active.logo}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-md border border-border bg-zinc-200 object-contain p-1.5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <h3 className="text-xl font-medium tracking-tight text-foreground">
                      {active.role}
                    </h3>
                  </div>
                  <p className="mt-1 font-mono text-sm text-muted-foreground">
                    {active.company}
                    {active.period ? ` · ${active.period}` : ""}
                    {active.type === "achievement" ? " · achievement" : ""}
                  </p>

                  <DetailBody item={active} />
                </motion.article>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
