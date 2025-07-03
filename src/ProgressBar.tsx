import React from 'react'
import { motion } from 'framer-motion'

type ProgressBarProps = {
    currentSlide: number,
    totalSlides: number
}

function ProgressBar(props: ProgressBarProps) {
  return (
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200 z-20">
        {/* Progress bar */}
        <motion.div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${((props.currentSlide + 1) / props.totalSlides) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
  )
}

export default ProgressBar
