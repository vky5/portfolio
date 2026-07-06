import type { Metadata } from "next";
import { getBlogs } from "@/lib/data";
import ArchiveHeader from "@/components/ArchiveHeader";
import SectionHeader from "@/components/SectionHeader";
import WritingArchive from "@/components/WritingArchive";
import Footer from "@/components/Footer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Writing",
  description:
    "All notes on system design, infrastructure, and what I'm reading.",
};

export default async function WritingPage() {
  const posts = await getBlogs();

  return (
    <>
      <ArchiveHeader />
      <main className="mx-auto max-w-5xl px-6 pt-14">
        <section className="py-16 md:py-20">
          <SectionHeader kicker="writing" title="All writing" />
          <WritingArchive posts={posts} />
        </section>
      </main>
      <Footer />
    </>
  );
}
