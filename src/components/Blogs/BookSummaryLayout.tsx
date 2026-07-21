"use client";

import { BlogPost } from "@/data/blogs";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useBlogWidgets } from "@/components/Blogs/useBlogWidgets";

interface BookSummaryLayoutProps {
  blog: BlogPost;
}

export default function BookSummaryLayout({ blog }: BookSummaryLayoutProps) {
  const router = useRouter();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  useBlogWidgets(contentRef, [activeChapterIndex, blog.bookData]);

  if (!blog.bookData || !blog.bookData.chapters.length) return null;

  const chapters = blog.bookData.chapters;
  const activeChapter = chapters[activeChapterIndex];

  // Scroll to top of main on chapter change
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeChapterIndex]);

  // Extract headings with a small timeout to guarantee DOM is settled
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
  }, [activeChapterIndex, blog.bookData]);

  // ScrollSpy listener
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (!mainEl || headings.length === 0) return;

    const handleScroll = () => {
      const container = contentRef.current;
      if (!container) return;

      const headingElements = container.querySelectorAll("h1, h2, h3, h4");
      let currentActiveId = "";
      const scrollContainerTop = mainEl.getBoundingClientRect().top;

      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i];
        const rect = el.getBoundingClientRect();
        const relativeTop = rect.top - scrollContainerTop;

        if (relativeTop <= 100) {
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
    mainEl.addEventListener("scroll", handleScroll);
    return () => mainEl.removeEventListener("scroll", handleScroll);
  }, [activeChapterIndex, headings]);

  return (
    <div className="h-screen bg-background flex flex-col md:flex-row md:overflow-hidden">
      {/* Mobile Header for Sidebar Toggle */}
      <div className="md:hidden bg-card border-b border-border p-4 sticky top-0 z-30 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => router.push("/#writing")}
          className="pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Hide Chapters" : "Chapters"}
        </Button>
      </div>

      {/* Sidebar - Chapter Navigation */}
      <aside
        className={cn(
          "bg-card border-r border-border flex-shrink-0 md:h-screen md:sticky md:top-0 overflow-y-auto no-scrollbar transition-all duration-300 ease-in-out z-20",
          "w-full md:w-64 lg:w-72", // Widths
          "fixed md:sticky top-[57px] md:top-0 bottom-0 md:bottom-auto", // Positioning: Fixed on mobile, sticky on desktop
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0", // Hide on mobile if closed, always show on desktop
        )}
      >
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/#writing")}
            className="mb-8 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </Button>

          <div className="mb-8">
            <Badge
              variant="outline"
              className="mb-3 border-primary/20 text-primary bg-primary/5"
            >
              {blog.category}
            </Badge>
            <h1 className="text-2xl font-bold text-foreground leading-tight mb-2">
              {blog.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {blog.readTime} • {blog.date}
            </p>
          </div>

          <nav className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
              Chapters
            </h3>
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveChapterIndex(index);
                  setIsSidebarOpen(false); // Close sidebar on selection (mobile)
                }}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center group",
                  activeChapterIndex === index
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(255,165,0,0.1)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 transition-colors",
                    activeChapterIndex === index
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-muted-foreground group-hover:bg-muted-foreground/20",
                  )}
                >
                  {index + 1}
                </div>
                <span className="flex-grow truncate">{chapter.title}</span>
                {activeChapterIndex === index && (
                  <ChevronRight className="w-4 h-4 ml-2 opacity-50" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-8 lg:p-12 overflow-y-auto no-scrollbar">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Main content column */}
          <div className="flex-grow max-w-3xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapterIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 text-primary/60 mb-6">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">
                    Chapter {activeChapterIndex + 1}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-8">
                  {activeChapter.title}
                </h2>

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
                  className="prose-content prose prose-lg prose-orange dark:prose-invert max-w-none text-muted-foreground/90 leading-relaxed
                    prose-headings:font-semibold prose-headings:text-foreground
                    prose-p:mb-6 prose-p:leading-8
                    prose-strong:text-foreground
                    prose-a:text-primary hover:prose-a:text-primary/80"
                  dangerouslySetInnerHTML={{ __html: activeChapter.content }}
                />

                {/* Navigation Footer */}
                <div className="mt-16 pt-8 border-t border-border flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setActiveChapterIndex(Math.max(0, activeChapterIndex - 1))
                    }
                    disabled={activeChapterIndex === 0}
                    className={activeChapterIndex === 0 ? "invisible" : ""}
                  >
                    Previous Chapter
                  </Button>
                  <Button
                    variant="default"
                    onClick={() =>
                      setActiveChapterIndex(
                        Math.min(chapters.length - 1, activeChapterIndex + 1),
                      )
                    }
                    disabled={activeChapterIndex === chapters.length - 1}
                    className={
                      activeChapterIndex === chapters.length - 1
                        ? "invisible"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(255,165,0,0.3)]"
                    }
                  >
                    Next Chapter
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky Table of Contents on Right Side for Desktop */}
          {headings.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-4 overflow-y-auto max-h-[calc(100vh-6rem)] no-scrollbar py-2">
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
      </main>
    </div>
  );
}
