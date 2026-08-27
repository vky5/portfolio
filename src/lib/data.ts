import dbConnect from "@/lib/db";
import Experience from "@/models/Experience";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import type { BlogPost } from "@/data/blogs";

export interface ExperienceLink {
  label: string;
  url: string;
}

export interface ExperienceItem {
  _id: string;
  role: string;
  company: string;
  logo?: string;
  period: string;
  description: string;
  highlights: string[];
  skills: string[];
  type: "work" | "achievement" | "opensource";
  links?: ExperienceLink[];
}

export interface ProjectItem {
  _id: string;
  title: string;
  year: string;
  description: string;
  tags: string[];
  githubLink?: string;
  liveLink?: string;
  blogLink?: string;
  icon?: string;
  coverImage?: string;
  featured?: boolean;
  order: number;
}

// Strips mongoose internals so documents can cross the RSC boundary.
function serialize<T>(docs: unknown): T {
  return JSON.parse(JSON.stringify(docs)) as T;
}

// Each fetcher degrades to empty content rather than failing the page —
// the Atlas allow-list drops connections from rotating IPs.
export async function getExperience(): Promise<ExperienceItem[]> {
  try {
    await dbConnect();
    const docs = await Experience.find({})
      .sort({ sortDate: -1, period: -1 })
      .lean();
    return serialize<ExperienceItem[]>(docs);
  } catch (err) {
    console.error("getExperience failed:", err);
    return [];
  }
}

export async function getProjects(): Promise<ProjectItem[]> {
  try {
    await dbConnect();
    const docs = await Project.find({}).sort({ order: 1, year: -1 }).lean();
    return serialize<ProjectItem[]>(docs);
  } catch (err) {
    console.error("getProjects failed:", err);
    return [];
  }
}

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    await dbConnect();
    const docs = await Blog.find({}).sort({ sortDate: -1, date: -1 }).lean();
    return serialize<BlogPost[]>(docs);
  } catch (err) {
    console.error("getBlogs failed:", err);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    await dbConnect();
    const doc = await Blog.findOne({ id: slug }).lean();
    return doc ? serialize<BlogPost>(doc) : null;
  } catch (err) {
    console.error("getBlogBySlug failed:", err);
    return null;
  }
}
