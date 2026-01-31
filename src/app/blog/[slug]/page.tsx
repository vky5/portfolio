"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogPost } from "@/data/blogs"; // Using types only
import NativeBlogLayout from "@/components/Blogs/NativeBlogLayout";
import BookSummaryLayout from "@/components/Blogs/BookSummaryLayout";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!params.slug) return;

      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const allBlogs: BlogPost[] = await res.json();
          const found = allBlogs.find((b) => b.id === params.slug);
          setBlog(found || null);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Blog Post Not Found
        </h1>
        <Button onClick={() => router.push("/")}>Return Home</Button>
      </div>
    );
  }

  if (blog.type === "native-simple") {
    return <NativeBlogLayout blog={blog} />;
  }

  if (blog.type === "native-book") {
    return <BookSummaryLayout blog={blog} />;
  }

  // Fallback for external
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <p className="text-muted-foreground mb-4">Redirecting...</p>
      <Button onClick={() => (window.location.href = blog.externalLink || "/")}>
        Click if not redirected
      </Button>
    </div>
  );
}
