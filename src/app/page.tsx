"use client";

import { useState } from "react";
import Navigation from "@/components/Home/Navigation";
import ProgressBar from "@/ProgressBar";
import slides from "@/components/Home/data";

import HomeSlide from "@/components/Home/Home";
import BlogsSlide from "@/components/Blogs/Blogs";
import ProjectsSlide from "@/components/Projects/Projects";
import ContactSlide from "@/components/Contact/Contact";

export default function Portfolio() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const paginate = (newDirection: number) => {
    setCurrentSlide((prev) => {
      if (newDirection === 1) {
        return prev === slides.length - 1 ? 0 : prev + 1;
      } else {
        return prev === 0 ? slides.length - 1 : prev - 1;
      }
    });
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return <HomeSlide />;
      case 1:
        return <BlogsSlide />;
      case 2:
        return <ProjectsSlide />;
      case 4:
        return <ContactSlide />
      default:
        return <HomeSlide />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Slide content area with scroll support */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-32 h-screen overflow-y-auto" style={{scrollbarWidth: "none"}}>
        {renderSlide()}
      </div>

      {/* Navigation + Progress */}
      <Navigation
        currentSlide={currentSlide}
        paginate={paginate}
        setCurrentSlide={setCurrentSlide}
      />
      <ProgressBar currentSlide={currentSlide} totalSlides={slides.length} />
    </div>
  );
}
