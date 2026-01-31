"use client";

import { useState, useEffect, useRef, Suspense } from "react";
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
  const isInternalUpdate = useRef(false);

  // Initialize from URL - Only on mount to avoid loops with scroll-spy
  useEffect(() => {
    const slideId = searchParams.get("slide");
    if (slideId) {
      const index = slides.findIndex((s) => s.id === slideId);
      if (index !== -1) {
        setCurrentSlide(index);
        // Discrete scroll on mount
        const element = document.getElementById(slideId);
        if (element) {
          element.scrollIntoView({ behavior: "auto", inline: "start" });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to prevent feedback loop

  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.5, // Trigger when half the slide is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = slides.findIndex((s) => s.id === entry.target.id);
          if (index !== -1 && index !== currentSlide) {
            setCurrentSlide(index);
            // Flag this as an internal update to prevent Navigation from triggering a scroll
            isInternalUpdate.current = true;
            window.history.replaceState(
              null,
              "",
              `/?slide=${slides[index].id}`,
            );
            // Reset the flag after a short delay
            setTimeout(() => {
              isInternalUpdate.current = false;
            }, 100);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    slides.forEach((slide) => {
      const element = document.getElementById(slide.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [currentSlide]);

  const scrollToSlide = (index: number) => {
    if (isInternalUpdate.current) return;

    const slideId = slides[index].id;
    const element = document.getElementById(slideId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  };

  const paginate = (newDirection: number) => {
    let newIndex = currentSlide;
    if (newDirection === 1) {
      newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    } else {
      newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    }
    scrollToSlide(newIndex);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Horizontal scroll container */}
      <div
        className="flex overflow-x-auto snap-x snap-mandatory h-screen no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            id={slide.id}
            className="w-screen h-screen flex-shrink-0 snap-start snap-always flex items-start justify-center px-4 overflow-y-auto no-scrollbar"
          >
            <div className="max-w-7xl w-full py-20">
              {index === 0 && <HomeSlide />}
              {index === 1 && <ExperienceSlide />}
              {index === 2 && <ProjectsSlide />}
              {index === 3 && <BlogsSlide />}
              {index === 4 && <ContactSlide />}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation + Progress bar */}
      <Navigation
        currentSlide={currentSlide}
        paginate={paginate}
        setCurrentSlide={scrollToSlide}
      />
      <ProgressBar currentSlide={currentSlide} totalSlides={slides.length} />
    </div>
  );
}

export default function Portfolio() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PortfolioContent />
    </Suspense>
  );
}
