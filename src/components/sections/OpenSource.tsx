"use client";

import type { ExperienceItem } from "@/lib/data";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  items: ExperienceItem[];
};

// Open-source contributions — no employer relationship, so they live apart
// from the Experience tabs. Each entry can carry multiple PR links, which
// the Experience shape doesn't otherwise need.
export default function OpenSourceSection({ items }: Props) {
  const contributions = items.filter((i) => i.type === "opensource");
  if (contributions.length === 0) return null;

  return (
    <section id="open-source" className="scroll-mt-14 py-16 md:py-20">
      <SectionHeader kicker="open source" title="Contributions" />

      <div className="space-y-12">
        {contributions.map((item) => (
          <Reveal key={item._id}>
            <article>
              <div className="flex items-center gap-3">
                {item.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.logo}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-md border border-border bg-white object-contain p-1.5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <h3 className="text-xl font-medium tracking-tight text-foreground">
                  {item.company}
                </h3>
              </div>
              <p className="mt-1 font-mono text-sm text-muted-foreground">
                {item.role}
                {item.period ? ` · ${item.period}` : ""}
              </p>

              {item.description && (
                <p className="mt-5 max-w-[65ch] leading-relaxed text-muted-foreground">
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

              {item.links && item.links.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-6 font-mono text-sm">
                  {item.links.map((l, i) => (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary transition-colors hover:text-foreground"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}

              {item.skills?.length > 0 && (
                <p className="mt-6 font-mono text-xs text-muted-foreground">
                  {item.skills.join(" · ")}
                </p>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
