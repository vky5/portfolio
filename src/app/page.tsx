import { getBlogs, getExperience, getProjects } from "@/lib/data";
import { getContributions } from "@/lib/github";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ExperienceSection from "@/components/sections/Experience";
import OpenSourceSection from "@/components/sections/OpenSource";
import ActivitySection from "@/components/sections/Activity";
import ProjectsSection from "@/components/sections/Projects";
import WritingSection from "@/components/sections/Writing";
import ContactSection from "@/components/sections/Contact";
import Footer from "@/components/Footer";

// Content changes rarely; revalidate so admin edits appear within 5 minutes.
export const revalidate = 300;

const HOMEPAGE_PROJECTS = 5;
const HOMEPAGE_POSTS = 6;

export default async function Portfolio() {
  const [experience, projects, blogs, contributions] = await Promise.all([
    getExperience(),
    getProjects(),
    getBlogs(),
    getContributions(),
  ]);

  // Curated slice: featured projects if any are flagged, else the top few.
  const flagged = projects.filter((p) => p.featured);
  const featured = (flagged.length > 0 ? flagged : projects).slice(
    0,
    HOMEPAGE_PROJECTS,
  );
  const recentPosts = blogs.slice(0, HOMEPAGE_POSTS);

  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-5xl px-6">
        <Hero />
        <ExperienceSection items={experience} />
        <OpenSourceSection items={experience} />
        <ProjectsSection items={featured} totalCount={projects.length} />
        <ActivitySection contributions={contributions} />
        <WritingSection posts={recentPosts} totalCount={blogs.length} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
