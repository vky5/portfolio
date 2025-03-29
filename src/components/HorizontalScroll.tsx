"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";


// Dynamically import slides
// this loads components lazily (only when needed) improving performance
// nextjs uses SSR by default but dynamics imports disables ssr for these slides
// without dynamic() all slides would load immediately even if the user never sees them

const HomePage = dynamic(() => import("./HomeSlide"));
const BlogsSlide = dynamic(() => import("./BlogsSlide"));
const ProjectsSlide = dynamic(() => import("./ProjectsSlide"));
const SkillsSlide = dynamic(() => import("./SkillsSlide"));
import Sidebar from "./Sidebar";

// import Progressbar from "./Progressbar";

function HorizontalScroll() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState([
    { id: "home", component: <HomePage key="home-page" /> },
    { id: "blogs", component: <BlogsSlide key="blogs-slide" /> },
    { id: "projects", component: <ProjectsSlide key="projects-slide" /> },
    { id: "skills", component: <SkillsSlide key="skills-slide" /> },
  ]);

  const scrollToSlide = (slideId: string) => {
    // checking if it is associated with any tag or not if not then simply return and do nothing
    const container = scrollContainerRef.current;
    if (!container) return;

    // we then find the index of slide that we want to go to and we used findIndex(slide) for that and then if the conditon is true, it stops at the first case when the condition is true
    const slideIndex = slides.findIndex((slide) => slide.id === slideId);
    if (slideIndex === -1) return;

    // in the div that we just selected contains a bumch of other div with scrollable set to be true
    // if want to go to certain element and select it this is gonna do it 
    const slideElement = container.children[slideIndex] as HTMLElement;
    if (slideElement) {
      const offset =
        slideElement.offsetLeft -
        container.offsetWidth / 2 +
        slideElement.offsetWidth/7;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="flex w-full h-full">
      <Sidebar scrollToSlide={scrollToSlide} />

      {/* Slides Section */}
      <section
        ref={scrollContainerRef}
        className="w-full overflow-x-auto flex space-x-5 justify-start items-center px-10"
        style={{ scrollbarWidth: "none" }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`min-w-3/4 h-full flex items-center justify-end ${
              index === slides.length - 1 ? "mr-36" : ""
            } ${index === 0 ? "ml-10" : ""}`}
          >
            <div className="w-4xl h-10/12 bg-red-500 flex items-center justify-center">
              {slide.component}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HorizontalScroll;
