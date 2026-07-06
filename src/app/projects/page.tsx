import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import ArchiveHeader from "@/components/ArchiveHeader";
import ProjectsSection from "@/components/sections/Projects";
import Footer from "@/components/Footer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description: "Everything I've built — infrastructure, tooling, and apps.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <ArchiveHeader />
      <main className="mx-auto max-w-5xl px-6 pt-14">
        <ProjectsSection
          items={projects}
          title="All projects"
          sub="Everything I've built, in the order I'd show it — the homepage keeps the highlights."
        />
      </main>
      <Footer />
    </>
  );
}
