"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogType, BlogPost } from "@/data/blogs"; // Keep types, remove static data usage
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ExternalLink, FileText, Book, Pencil, Terminal } from "lucide-react";

export default function BlogsSlide() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | BlogType>("all");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error("Failed to load blogs", error);
      } finally {
        setLoading(false);
      }
    };

    // Check admin
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("admin_token")
    ) {
      setIsAdmin(true);
    }

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) => filter === "all" || blog.type === filter,
  );

  const handleReadMore = (blog: BlogPost) => {
    if (blog.type === "external" && blog.externalLink) {
      window.open(blog.externalLink, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/blog/${blog.id}`);
    }
  };

  // Helper to get icon based on blog type
  const getBlogIcon = (type: BlogType) => {
    switch (type) {
      case "external":
        return ExternalLink;
      case "native-simple":
        return FileText;
      case "native-book":
        return Book;
      default:
        return FileText;
    }
  };

  // Helper to get icon color based on blog type
  const getBlogIconColor = (type: BlogType) => {
    switch (type) {
      case "external":
        return "text-purple-600 dark:text-purple-400";
      case "native-simple":
        return "text-green-600 dark:text-green-400";
      case "native-book":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-primary";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground animate-pulse">
        Loading content...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Heading */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-light text-foreground mb-4">
          <span className="text-primary">./blog</span>
        </h1>
        <div className="flex justify-center items-center gap-2 text-muted-foreground mb-4">
          <Terminal className="w-4 h-4" />
          <span className="text-sm">root@vky5:~/blog</span>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
          Deep dives into system design, infrastructure, and engineering
          practices
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: "all", label: "All" },
            { id: "native-simple", label: "Articles" },
            { id: "native-book", label: "Books" },
            { id: "external", label: "External" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={filter === tab.id ? "default" : "outline"}
              onClick={() => setFilter(tab.id as BlogType | "all")}
              className={`rounded-full transition-all ${
                filter === tab.id
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,165,0,0.3)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Blog Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog, index) => {
          const TypeIcon = getBlogIcon(blog.type);

          return (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border border-white/5 bg-card/40 backdrop-blur-md hover:bg-card/60 overflow-hidden">
                {blog.coverImage && (
                  <div className="w-full h-40 overflow-hidden border-b border-white/5">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                  </div>
                )}
                <CardContent className="p-6 h-full flex flex-col relative group">
                  {isAdmin && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background shadow-sm border border-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/editor?slug=${blog.id}`);
                      }}
                    >
                      <Pencil className="w-4 h-4 text-foreground" />
                    </Button>
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/20 text-primary bg-primary/5"
                    >
                      {blog.category}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TypeIcon
                        className={`w-3 h-3 ${getBlogIconColor(blog.type)}`}
                      />
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm text-primary/80 font-medium">
                      {blog.date}
                    </span>
                    <Button
                      variant="ghost"
                      className="text-primary hover:text-primary hover:bg-primary/10 p-0 px-2 text-sm"
                      onClick={() => handleReadMore(blog)}
                    >
                      Read More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
