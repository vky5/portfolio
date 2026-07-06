"use client";

import Image from "next/image";
import type { ProjectItem } from "@/lib/data";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { IconMap } from "@/components/Projects/IconMap";
import { Code } from "lucide-react";

type Props = {
  items: ProjectItem[];
  title?: string;
  sub?: string;
  /** Total project count; when greater than items shown, links to /projects. */
  totalCount?: number;
};

export default function ProjectsSection({
  items,
  title = "Things I've built",
  sub,
  totalCount,
}: Props) {
  if (items.length === 0) return null;
  const hasMore = totalCount !== undefined && totalCount > items.length;

  return (
    <section id="projects" className="scroll-mt-14 py-16 md:py-20">
      <SectionHeader kicker="projects" title={title} sub={sub} />

      <div className="space-y-20">
        {items.map((proj) => {
          const Icon = (proj.icon && IconMap[proj.icon]) || Code;
          return (
            <Reveal key={proj._id}>
              <article className="grid items-start gap-8 md:grid-cols-[1fr_320px] md:gap-12">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {proj.year}
                  </p>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight text-foreground">
                    {proj.title}
                  </h3>
                  <p className="mt-4 max-w-[65ch] leading-relaxed text-muted-foreground">
                    {proj.description}
                  </p>

                  {proj.tags?.length > 0 && (
                    <p className="mt-5 font-mono text-xs text-muted-foreground">
                      {proj.tags.join(" · ")}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-6 font-mono text-sm">
                    {proj.blogLink && (
                      <a
                        href={proj.blogLink}
                        className="text-primary transition-colors hover:text-foreground"
                      >
                        architecture →
                      </a>
                    )}
                    {proj.githubLink && (
                      <a
                        href={proj.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        github ↗
                      </a>
                    )}
                    {proj.liveLink && (
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        live ↗
                      </a>
                    )}
                  </div>
                </div>

                <div className="order-first overflow-hidden rounded-lg border border-border bg-card md:order-none">
                  {proj.coverImage ? (
                    <Image
                      src={proj.coverImage}
                      alt={`${proj.title} preview`}
                      width={640}
                      height={400}
                      className="h-48 w-full object-cover md:h-52"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center md:h-52">
                      <Icon
                        className="h-8 w-8 text-muted-foreground/50"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {hasMore && (
        <Reveal className="mt-16">
          <a
            href="/projects"
            className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            all {totalCount} projects →
          </a>
        </Reveal>
      )}
    </section>
  );
}
