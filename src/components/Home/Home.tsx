"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function HomeSlide() {
  const skills = [
    "Kubernetes",
    "AWS",
    "System Design",
    "Microservices",
    "DevOps",
    "Full Stack",
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-16 h-full items-center">
      {/* Left Section */}
      <motion.div
        className="md:text-right md:pr-8 relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {/* Pulsing Dot and Crossing Line */}
        <div className="absolute -right-4 md:-right-12 top-8 z-0">
          <motion.div
            className="w-6 h-6 bg-orange-400 rounded-full relative z-10"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute left-1/2 top-[-200px] bottom-[-200px] w-px bg-gradient-to-b from-transparent via-orange-300 to-transparent -translate-x-1/2 z-0"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        <h2 className="text-xl md:text-2xl font-light text-orange-500 mb-2">
          Hello, I&apos;m Vaibhav
        </h2>
        <h1 className="text-4xl md:text-7xl font-light text-gray-800 mb-6 leading-tight">
          Software
          <br />
          <span className="text-orange-500">Engineer</span>
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed">
          Building scalable infrastructure and distributed systems that power
          modern applications.
        </p>
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="md:pl-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          I specialize in{" "}
          <span className="text-orange-500 font-medium">system design</span>,
          DevOps practices, and full-stack development. From microservices
          architecture to cloud-native solutions, I architect systems that
          scale.
        </p>

        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700 hover:bg-orange-200"
              >
                {skill}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
