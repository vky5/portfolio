"use client";

import { BlogPost } from "@/data/blogs";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BookSummaryLayoutProps {
  blog: BlogPost;
}

export default function BookSummaryLayout({ blog }: BookSummaryLayoutProps) {
  const router = useRouter();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  if (!blog.bookData || !blog.bookData.chapters.length) return null;

  const chapters = blog.bookData.chapters;
  const activeChapter = chapters[activeChapterIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header for Sidebar Toggle */}
      <div className="md:hidden bg-white border-b border-gray-100 p-4 sticky top-0 z-30 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => router.push("/?slide=blogs")}
          className="pl-0 hover:bg-transparent text-gray-600"
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
          "bg-card border-r border-border flex-shrink-0 md:h-screen md:sticky md:top-0 overflow-y-auto transition-all duration-300 ease-in-out z-20",
          "w-full md:w-80 lg:w-96", // Widths
          "fixed md:relative top-[57px] md:top-0 bottom-0 md:bottom-auto", // Positioning: Fixed on mobile below header
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0", // Hide on mobile if closed, always show on desktop
        )}
      >
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/?slide=blogs")}
            className="mb-8 pl-0 hover:bg-transparent text-gray-600 hover:text-gray-900 hidden md:inline-flex"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </Button>

          <div className="mb-8">
            <Badge
              variant="outline"
              className="mb-3 border-orange-200 text-orange-700"
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
                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 transition-colors",
                    activeChapterIndex === index
                      ? "bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200"
                      : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/20",
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
      <main className="flex-grow p-6 md:p-12 lg:p-16 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapterIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2 text-gray-500 mb-6">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">
                  Chapter {activeChapterIndex + 1}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-8">
                {activeChapter.title}
              </h2>

              <div
                className="prose prose-lg prose-orange dark:prose-invert max-w-none text-muted-foreground leading-relaxed
                  prose-headings:font-semibold prose-headings:text-foreground
                  prose-p:mb-6 prose-p:leading-8
                  prose-strong:text-foreground
                  prose-a:text-orange-600 hover:prose-a:text-orange-700"
                dangerouslySetInnerHTML={{ __html: activeChapter.content }}
              />

              {/* Navigation Footer */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between">
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
                      : "bg-orange-600 hover:bg-orange-700 text-white"
                  }
                >
                  Next Chapter
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
