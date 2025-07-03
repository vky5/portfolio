"use client";

import { useState } from "react";
import Navigation from "@/components/Home/Navigation";
import ProgressBar from "@/ProgressBar";
import slides from "@/components/Home/data";

export default function Portfolio() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const paginate = (newDirection: number) => {
    setCurrentSlide((prev) => {
      if (newDirection === 1) {
        return prev === 4 ? 0 : prev + 1;
      } else {
        return prev === 0 ? 4 : prev - 1;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentSlide={currentSlide}
        paginate={paginate}
        setCurrentSlide={setCurrentSlide}
      />

      <ProgressBar currentSlide={currentSlide} totalSlides={slides.length} />
    </div>
  );
}
