"use client"

import { Button } from "../ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import slides from "./data"

type NavigationProps = {
  currentSlide: number
  paginate: (direction: number) => void
  setCurrentSlide: (index: number) => void
}

export default function Navigation({ currentSlide, paginate, setCurrentSlide }: NavigationProps) {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => paginate(-1)}
          className="p-2 hover:bg-orange-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex space-x-2">
          {slides.map((slide, index) => {
            const Icon = slide.icon
            const isActive = index === currentSlide
            return (
              <motion.button
                key={slide.id}
                onClick={() => {
                  const direction = index > currentSlide ? 1 : -1
                  paginate(direction)
                  setCurrentSlide(index)
                }}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isActive ? "bg-orange-500 text-white" : "text-gray-400 hover:text-orange-500"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
              </motion.button>
            )
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => paginate(1)}
          className="p-2 hover:bg-orange-100"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
