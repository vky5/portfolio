"use client";

import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Lock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import slides from "./data";
import { useRouter } from "next/navigation";

type NavigationProps = {
  currentSlide: number;
  paginate: (direction: number) => void;
  setCurrentSlide: (index: number) => void;
};

export default function Navigation({
  currentSlide,
  paginate,
  setCurrentSlide,
}: NavigationProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-[95%] max-w-sm sm:max-w-md">
      <div className="flex items-center justify-between space-x-2 bg-secondary/80 backdrop-blur-md rounded-full px-4 py-3 shadow-2xl border border-white/5 w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => paginate(-1)}
          className="p-2 hover:bg-primary/10 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {slides.map((slide, index) => {
            const Icon = slide.icon;
            const isActive = index === currentSlide;
            return (
              <motion.button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`p-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,165,0,0.4)]"
                    : "text-muted-foreground hover:text-primary"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
              </motion.button>
            );
          })}

          <motion.a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="View Resume"
          >
            <FileText className="w-4 h-4" />
          </motion.a>

          <div className="w-px h-4 bg-white/10 mx-1" />

          <motion.button
            onClick={() => router.push("/admin")}
            className="p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Admin Dashboard"
          >
            <Lock className="w-4 h-4" />
          </motion.button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => paginate(1)}
          className="p-2 hover:bg-primary/10 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
