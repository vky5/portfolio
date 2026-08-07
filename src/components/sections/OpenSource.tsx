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

// Cap on the collapsed panel height — short entries render at their natural
// height instead of padding out to this number. Same treatment as
// Experience's DetailBody, kept as its own component so `expanded` resets
// for free when AnimatePresence remounts it on tab switch.
const COLLAPSED_HEIGHT = 200;

function DetailBody({ item }: { item: ExperienceItem }) {
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(COLLAPSED_HEIGHT);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasBody = Boolean(item.description) || item.highlights?.length > 0;
  const truncated = fullHeight > COLLAPSED_HEIGHT;

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
                {item.highlights.map((h, i) => {
                  // Links are positional — link[i] is the PR for highlight[i].
                  const link = item.links?.[i];
                  return (
                    <li
                      key={i}
                      className="flex max-w-[65ch] gap-3 leading-relaxed text-foreground/90"
                    >
                      <span className="mt-[0.7em] h-px w-3 shrink-0 bg-primary" />
                      <span>
                        {link && (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mr-2 whitespace-nowrap font-mono text-xs text-primary transition-colors hover:text-foreground"
                          >
                            {link.label} ↗
                          </a>
                        )}
                        {h}
                      </span>
                    </li>
                  );
                })}
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

// Open-source contributions — no employer relationship, so they live apart
// from the Experience tabs. Structured the same way Experience is (a tabbed
// browser for "where"). PR links render inline next to the highlight they
// belong to (see DetailBody) rather than in a separate list — a PR link
// orphaned from the bug it fixes isn't useful on its own.
export default function OpenSourceSection({ items }: Props) {
  const contributions = items.filter((i) => i.type === "opensource");
  const [activeId, setActiveId] = useState<string | null>(
    contributions[0]?._id ?? null,
  );
  const active =
    contributions.find((i) => i._id === activeId) ?? contributions[0];

  if (contributions.length === 0) return null;

  return (
    <section id="open-source" className="scroll-mt-14 py-16 md:py-20">
      <SectionHeader kicker="open source" title="Where I've contributed" />

      <Reveal>
        <div className="grid gap-8 md:grid-cols-[240px_1fr] md:gap-12">
          {/* Selector */}
          <div
            role="tablist"
            aria-label="Open source contributions"
            aria-orientation="vertical"
            className="flex gap-1 overflow-x-auto no-scrollbar md:flex-col md:overflow-visible"
          >
            {contributions.map((item) => {
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
                        (e.target as HTMLImageElement).style.display =
                          "none";
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
                      {item.company}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail */}
          <div className="min-h-[240px]">
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
                          (e.target as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    )}
                    <h3 className="text-xl font-medium tracking-tight text-foreground">
                      {active.company}
                    </h3>
                  </div>
                  <p className="mt-1 font-mono text-sm text-muted-foreground">
                    {active.role}
                    {active.period ? ` · ${active.period}` : ""}
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
