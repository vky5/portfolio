"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";

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
    <div className="flex items-center min-h-[calc(100vh-160px)]">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 w-full items-center">
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
              className="w-6 h-6 bg-primary rounded-full relative z-10 shadow-[0_0_20px_rgba(255,165,0,0.6)]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute left-1/2 top-[-200px] bottom-[-200px] w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent -translate-x-1/2 z-0"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>

          <h2 className="text-xl md:text-2xl font-light text-primary mb-2">
            Hello, I&apos;m Vaibhav
          </h2>
          <h1 className="text-4xl md:text-7xl font-light text-foreground mb-6 leading-tight">
            Software
            <br />
            <span className="text-primary font-medium">Engineer</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
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
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            I specialize in{" "}
            <span className="text-primary font-medium underline underline-offset-4 decoration-primary/30">
              system design
            </span>
            , DevOps practices, and full-stack development. From microservices
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
                  className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold shadow-[0_0_20px_rgba(255,165,0,0.4)] hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-5 h-5" />
              Download Resume
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
