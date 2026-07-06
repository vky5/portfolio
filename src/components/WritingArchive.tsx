"use client";

import { useState } from "react";
import type { BlogPost, BlogType } from "@/data/blogs";
import { PostRow } from "@/components/sections/Writing";

const FILTERS: { id: "all" | BlogType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "native-simple", label: "Articles" },
  { id: "native-book", label: "Book notes" },
  { id: "external", label: "External" },
];

export default function WritingArchive({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = useState<"all" | BlogType>("all");

  const available = FILTERS.filter(
    (f) => f.id === "all" || posts.some((p) => p.type === f.id),
  );
  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.type === filter);

  return (
    <div>
      {available.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2 font-mono text-sm">
          {available.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                filter === f.id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border">
        {filtered.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-muted-foreground">
          Nothing here yet — check back soon.
        </p>
      )}
    </div>
  );
}
