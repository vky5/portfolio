"use client";

import { BlogPost } from "@/data/blogs";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface NativeBlogLayoutProps {
  blog: BlogPost;
}

export default function NativeBlogLayout({ blog }: NativeBlogLayoutProps) {
  const router = useRouter();

  if (!blog.content) return null;

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/?slide=blogs")}
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

          <div
            className="prose prose-orange md:prose-lg dark:prose-invert max-w-none text-muted-foreground/90 leading-relaxed
                prose-headings:font-semibold prose-headings:text-foreground
                prose-p:mb-6 prose-p:leading-8
                prose-strong:text-foreground
                prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>
      </div>
    </div>
  );
}
