import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getBlogBySlug } from "@/lib/data";
import NativeBlogLayout from "@/components/Blogs/NativeBlogLayout";
import BookSummaryLayout from "@/components/Blogs/BookSummaryLayout";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Post not found" };

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      ...(blog.coverImage ? { images: [blog.coverImage] } : {}),
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  if (blog.type === "external" && blog.externalLink) {
    redirect(blog.externalLink);
  }

  if (blog.type === "native-book") {
    return <BookSummaryLayout blog={blog} />;
  }

  return <NativeBlogLayout blog={blog} />;
}
