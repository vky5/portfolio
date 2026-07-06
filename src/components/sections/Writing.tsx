"use client";

import Link from "next/link";
import type { BlogPost } from "@/data/blogs";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  posts: BlogPost[];
  /** Total post count; when greater than posts shown, links to /writing. */
  totalCount?: number;
};

export function PostRow({ post }: { post: BlogPost }) {
  const isExternal = post.type === "external";
  const meta = (
    <span className="shrink-0 font-mono text-xs text-muted-foreground">
      {post.date}
      {post.readTime ? ` · ${post.readTime}` : ""}
      {isExternal ? " · ↗" : ""}
    </span>
  );

  const inner = (
    <span className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <span className="min-w-0">
        <span className="block font-medium text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </span>
        {post.excerpt && (
          <span className="mt-1 block truncate text-sm text-muted-foreground">
            {post.excerpt}
          </span>
        )}
      </span>
      {meta}
    </span>
  );

  const className = "group block border-b border-border";

  if (isExternal && post.externalLink) {
    return (
      <a
        href={post.externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={`/blog/${post.id}`} className={className}>
      {inner}
    </Link>
  );
}

export default function WritingSection({ posts, totalCount }: Props) {
  if (posts.length === 0) return null;
  const hasMore = totalCount !== undefined && totalCount > posts.length;

  return (
    <section id="writing" className="scroll-mt-14 py-16 md:py-20">
      <SectionHeader
        kicker="writing"
        title="Notes on systems"
        sub="Deep dives into system design, infrastructure, and what I'm reading."
      />
      <Reveal>
        <div className="border-t border-border">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
        {hasMore && (
          <a
            href="/writing"
            className="mt-8 inline-block font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            all {totalCount} posts →
          </a>
        )}
      </Reveal>
    </section>
  );
}
