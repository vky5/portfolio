"use client";

import { useState, useEffect, useRef } from "react";
import { BlogPost } from "@/data/blogs";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReadingProgress } from "@/components/motion/ReadingProgress";
import { useMermaid } from "@/components/Blogs/useMermaid";

interface NativeBlogLayoutProps {
  blog: BlogPost;
}

export default function NativeBlogLayout({ blog }: NativeBlogLayoutProps) {
  const router = useRouter();
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  useMermaid(contentRef, [blog.content]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const timeoutId = setTimeout(() => {
      const headingElements = container.querySelectorAll("h1, h2, h3, h4");
      const list: { id: string; text: string; level: number }[] = [];

      headingElements.forEach((el, idx) => {
        if (!el.id) {
          const text = el.textContent || "";
          const slug = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          el.id = slug || `heading-${idx}`;
        }
        list.push({
          id: el.id,
          text: el.textContent || "",
          level: parseInt(el.tagName.replace("H", ""), 10),
        });
      });

      setHeadings(list);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [blog.content]);

  // ScrollSpy listener
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const container = contentRef.current;
      if (!container) return;

      const headingElements = container.querySelectorAll("h1, h2, h3, h4");
      let currentActiveId = "";

      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i];
        const rect = el.getBoundingClientRect();

        // 120px threshold offset for top of viewport scroll
        if (rect.top <= 120) {
          currentActiveId = el.id;
        } else {
          break;
        }
      }

      if (currentActiveId) {
        setActiveHeadingId(currentActiveId);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (!blog.content) return null;

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <ReadingProgress />
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        <div className="flex-grow max-w-3xl w-full">
          <Button
            variant="ghost"
            onClick={() => router.push("/#writing")}
            className="mb-8 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground/60">
              <Badge
                variant="outline"
                className="border-primary/20 text-primary bg-primary/5"
              >
                {blog.category}
              </Badge>
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
              {blog.title}
            </h1>

            {/* Table of Contents - Mobile/Tablet inline view */}
            {headings.length > 0 && (
              <div className="lg:hidden mb-8 p-6 bg-card/40 border border-border rounded-xl backdrop-blur-sm">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Table of Contents
                </h3>
                <ul className="space-y-2">
                  {headings.map((h) => (
                    <li
                      key={h.id}
                      style={{ paddingLeft: `${Math.max(0, h.level - 1) * 1}rem` }}
                      className="text-sm"
                    >
                      <a
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={cn(
                          "text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group",
                          activeHeadingId === h.id ? "text-primary font-medium" : ""
                        )}
                      >
                        <span className={cn(
                          "opacity-40 group-hover:opacity-100 group-hover:text-primary transition-opacity",
                          activeHeadingId === h.id ? "opacity-100 text-primary" : ""
                        )}>•</span>
                        <span className={h.level === 1 ? "font-medium text-foreground/90 hover:text-primary" : ""}>
                          {h.text}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div
              ref={contentRef}
              className="prose-content prose md:prose-lg dark:prose-invert max-w-none text-muted-foreground/90 leading-relaxed
                  prose-headings:font-semibold prose-headings:text-foreground
                  prose-p:mb-6 prose-p:leading-8
                  prose-strong:text-foreground
                  prose-a:text-primary hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </motion.div>
        </div>

        {/* Sticky Table of Contents on Right Side for Desktop */}
        {headings.length > 0 && (
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 overflow-y-auto max-h-[calc(100vh-12rem)] no-scrollbar py-2">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              On this page
            </h3>
            <ul className="space-y-3 border-l border-border/40 pl-3">
              {headings.map((h) => (
                <li
                  key={h.id}
                  style={{ paddingLeft: `${Math.max(0, h.level - 2) * 0.75}rem` }}
                  className="text-xs"
                >
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(
                      "transition-all duration-200 flex items-start gap-1.5 group relative -left-[13px] pl-3 border-l-2",
                      activeHeadingId === h.id
                        ? "text-primary border-primary font-medium"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    )}
                  >
                    <span className="group-hover:text-primary transition-colors">{h.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
