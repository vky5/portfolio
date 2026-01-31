"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, ArrowRight, Code, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconMap } from "./IconMap";

interface Project {
  _id?: string;
  id: string;
  title: string;
  year: string;
  description: string;
  tags?: string[];
  tech?: string[];
  githubLink?: string;
  liveLink?: string;
  blogLink?: string;
  icon?: string;
  coverImage?: string;
}

export default function ProjectsSlide() {
  const [activeTag, setActiveTag] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch((err) => console.error(err));
  }, []);

  // Consolidate tags/tech logic
  const getTags = (p: Project) => p.tags || p.tech || [];

  const allTags = ["All", ...Array.from(new Set(projects.flatMap(getTags)))];

  const filteredProjects =
    activeTag === "All"
      ? projects
      : projects.filter((p) => getTags(p).includes(activeTag));

  return (
    <div className="space-y-12 w-full max-w-6xl mx-auto px-4">
      {/* Title */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-light text-foreground mb-4">
          <span className="text-primary">./projects</span>
        </h1>
        <div className="flex justify-center items-center gap-2 text-muted-foreground">
          <Terminal className="w-4 h-4" />
          <span className="text-sm">root@vky5:~/projects</span>
        </div>
      </motion.div>

      {/* Tag Filters */}
      <div className="flex flex-wrap justify-center gap-2 relative z-20">
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={activeTag === tag ? "default" : "outline"}
            onClick={() => setActiveTag(tag)}
            className={`rounded-full text-xs md:text-sm transition-all ${
              activeTag === tag
                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-[0_0_15px_rgba(255,165,0,0.3)]"
                : "hover:border-primary/50 hover:text-primary bg-card/50 backdrop-blur-sm"
            }`}
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Timeline Section */}
      <div className="relative">
        {/* Timeline Center Line */}
        <motion.div
          className="hidden md:block absolute left-1/2 top-4 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent z-0 -translate-x-1/2"
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Project Entries */}
        <div className="space-y-16">
          {filteredProjects.map((proj, i) => {
            const Icon =
              proj.icon && IconMap[proj.icon] ? IconMap[proj.icon] : Code;
            const isLeft = i % 2 === 0;
            const tags = getTags(proj);

            return (
              <motion.div
                key={proj._id || proj.id || proj.title}
                className={`grid md:grid-cols-2 gap-8 relative ${
                  isLeft ? "md:text-right" : "text-left"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Timeline Dot */}
                <motion.div
                  className="hidden md:block absolute left-1/2 top-0 w-4 h-4 bg-primary rounded-full z-20 border-4 border-background shadow-[0_0_10px_rgba(255,165,0,0.5)] -translate-x-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileInView={{
                    boxShadow: [
                      "0 0 0 0px rgba(234, 113, 0, 0.4)",
                      "0 0 0 10px rgba(234, 113, 0, 0)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />

                {/* Info Panel */}
                <div
                  className={`${isLeft ? "md:pr-12" : "md:col-start-2 md:pl-12"}`}
                >
                  <h3 className="text-2xl md:text-3xl font-light text-foreground mb-2 group-hover:text-primary transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-primary font-medium mb-4">{proj.year}</p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {proj.description}
                  </p>

                  {/* Tags */}
                  <div
                    className={`flex flex-wrap gap-2 mb-6 ${isLeft ? "md:justify-end" : "justify-start"}`}
                  >
                    {tags.map((t, j) => (
                      <Badge
                        key={j}
                        variant="outline"
                        className="border-primary/20 text-primary bg-primary/5"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div
                    className={`flex gap-4 ${isLeft ? "md:justify-end" : "justify-start"}`}
                  >
                    {proj.githubLink && (
                      <a
                        href={proj.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {proj.liveLink && (
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>

                {/* Architecture Preview (Icon) */}
                <div
                  className={`${isLeft ? "md:pl-12 md:col-start-2" : "md:pr-12 md:col-start-1 md:row-start-1"}`}
                >
                  <motion.div
                    className={`relative bg-gradient-to-br from-white/5 to-transparent rounded-xl h-full min-h-[200px] flex flex-col items-center justify-center border border-white/5 shadow-xl transition-all overflow-hidden ${proj.blogLink ? "cursor-pointer hover:bg-white/10" : ""}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      if (proj.blogLink) window.open(proj.blogLink, "_blank");
                    }}
                  >
                    {proj.coverImage ? (
                      <img
                        src={proj.coverImage}
                        alt={proj.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-70"
                      />
                    ) : null}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-tr from-primary to-primary/80 rounded-2xl mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(255,165,0,0.4)] rotate-3 group-hover:rotate-6 transition-transform">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <p className="text-primary font-medium flex items-center gap-2">
                        {proj.blogLink ? (
                          <>
                            Read Architecture <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          "Architecture Preview"
                        )}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
