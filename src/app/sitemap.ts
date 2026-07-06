import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getBlogs();

  const posts = blogs
    .filter((b) => b.type !== "external")
    .map((b) => ({
      url: `${BASE_URL}/blog/${b.id}`,
      changeFrequency: "monthly" as const,
    }));

  return [
    { url: BASE_URL, changeFrequency: "weekly" },
    { url: `${BASE_URL}/projects`, changeFrequency: "monthly" },
    { url: `${BASE_URL}/writing`, changeFrequency: "weekly" },
    ...posts,
  ];
}
