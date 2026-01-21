"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/Home/Navigation";
import ProgressBar from "@/ProgressBar";
import slides from "@/components/Home/data";

import HomeSlide from "@/components/Home/Home";
import BlogsSlide from "@/components/Blogs/Blogs";
import ProjectsSlide from "@/components/Projects/Projects";
import ExperienceSlide from "@/components/Experience/Experience";
import ContactSlide from "@/components/Contact/Contact";

function PortfolioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Initialize from URL
  useEffect(() => {
    const slideId = searchParams.get("slide");
    if (slideId) {
      const index = slides.findIndex((s) => s.id === slideId);
      if (index !== -1) setCurrentSlide(index);
    }
  }, [searchParams]);

  const updateSlide = (index: number) => {
    setCurrentSlide(index);
    // Update URL without full reload
    const slideId = slides[index].id;
    router.push(`/?slide=${slideId}`, { scroll: false });
  };

  const paginate = (newDirection: number) => {
    let newIndex = currentSlide;
    if (newDirection === 1) {
      newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    } else {
      newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    }
    updateSlide(newIndex);
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return <HomeSlide />;
      case 1:
        return <BlogsSlide />;
      case 2:
        return <ProjectsSlide />;
      case 3:
        return <ExperienceSlide />;
      case 4:
        return <ContactSlide />;
      default:
        return <HomeSlide />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Slide content area with scroll support */}
      <div
        className="max-w-7xl mx-auto px-4 pt-16 pb-32 h-screen overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {renderSlide()}
      </div>

      {/* Navigation + Progress */}
      <Navigation
        currentSlide={currentSlide}
        paginate={paginate}
        setCurrentSlide={updateSlide}
      />
      <ProgressBar currentSlide={currentSlide} totalSlides={slides.length} />
    </div>
  );
}

export default function Portfolio() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <PortfolioContent />
    </Suspense>
  );
}
