"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Code, Cpu } from "lucide-react";

interface Job {
  _id?: string;
  id: string;
  type?: "work" | "achievement";
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: string[];
  skills: string[];
}

export default function ExperienceSlide() {
  const [experience, setExperience] = useState<Job[]>([]);
  // Use string ID for active tracking to simplify
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/experience")
      .then((res) => res.json())
      .then((data: Job[]) => {
        setExperience(data);
        if (data.length > 0) setActiveId(data[0]._id || data[0].id);
      })
      .catch((err) => console.error(err));
  }, []);

  const works = experience.filter((j) => j.type === "work" || !j.type);
  const achievements = experience.filter((j) => j.type === "achievement");
  const activeItem = experience.find((e) => (e._id || e.id) === activeId);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 font-mono">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-light text-foreground mb-4">
          <span className="text-primary">./experience</span>
        </h1>
        <div className="flex justify-center items-center gap-2 text-muted-foreground">
          <Terminal className="w-4 h-4" />
          <span className="text-sm">root@vky5:~/career</span>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Terminal Sidebar (file explorer style) */}
        {/* Terminal Sidebar (file explorer style) */}
        <div className="md:col-span-4 bg-card/50 backdrop-blur border border-border rounded-lg p-4 h-fit min-h-[300px] relative">
          <div className="flex items-center gap-2 mb-6 text-muted-foreground border-b border-border pb-2">
            <Code className="w-4 h-4" />
            <span className="text-xs tracking-widest">EXPLORER</span>
          </div>

          <div className="relative pl-4">
            {/* Vertical Line */}
            <div className="absolute left-[24px] top-0 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

            {/* Work Section */}
            {works.length > 0 && (
              <div className="mb-8">
                <div className="text-xs text-muted-foreground font-semibold mb-4 pl-6">
                  WORK_HISTORY
                </div>
                <div className="space-y-4">
                  {works.map((job) => (
                    <div key={job._id || job.id} className="relative group">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute left-[4px] top-3 w-2.5 h-2.5 rounded-full border-2 transition-colors z-10 ${activeId === job._id || activeId === job.id ? "bg-primary border-primary shadow-[0_0_8px_rgba(255,165,0,0.5)]" : "bg-background border-muted-foreground group-hover:border-primary/50"}`}
                      />

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                                ml-8 flex items-start gap-3 p-3 rounded cursor-pointer transition-all border border-transparent
                                  ${
                                    activeId === job._id || activeId === job.id
                                      ? "bg-primary/10 border-primary/20"
                                      : "hover:bg-white/5"
                                  }
                             `}
                        onClick={() => setActiveId(job._id || job.id)}
                      >
                        <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                          <span
                            className={`text-[10px] uppercase tracking-wider ${activeId === job._id || activeId === job.id ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {job.period}
                          </span>
                          <span
                            className={`font-bold text-sm truncate ${activeId === job._id || activeId === job.id ? "text-primary" : "text-foreground"}`}
                          >
                            {job.company}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            ({job.role})
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground font-semibold mb-4 pl-6">
                  ACHIEVEMENTS
                </div>
                <div className="space-y-4">
                  {achievements.map((item) => (
                    <div key={item._id || item.id} className="relative group">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute left-[4px] top-3 w-2.5 h-2.5 rounded-full border-2 transition-colors z-10 ${activeId === item._id || activeId === item.id ? "bg-primary border-primary shadow-[0_0_8px_rgba(255,165,0,0.5)]" : "bg-background border-muted-foreground group-hover:border-primary/50"}`}
                      />

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                                 ml-8 flex items-start gap-3 p-3 rounded cursor-pointer transition-all border border-transparent
                                 ${
                                   activeId === item._id || activeId === item.id
                                     ? "bg-primary/10 border-primary/20"
                                     : "hover:bg-white/5"
                                 }
                             `}
                        onClick={() => setActiveId(item._id || item.id)}
                      >
                        <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                          <span
                            className={`text-[10px] uppercase tracking-wider ${activeId === item._id || activeId === item.id ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {item.period}
                          </span>
                          <span
                            className={`font-bold text-sm truncate ${activeId === item._id || activeId === item.id ? "text-primary" : "text-foreground"}`}
                          >
                            {item.role}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {item.company}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code View (Details) */}
        <div className="md:col-span-8">
          {activeItem && (
            <motion.div
              key={activeItem._id || activeItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`bg-zinc-950 p-6 rounded-lg border shadow-xl font-mono relative overflow-hidden min-h-[400px] ${activeItem.type === "achievement" ? "border-yellow-900/50 text-yellow-100" : "border-zinc-800 text-green-400"}`}
            >
              {/* Fake Menu Bar */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-black/40 border-b border-white/5 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <div className="w-3 h-3 rounded-full bg-green-500/40" />
                <div className="ml-4 text-xs text-zinc-500 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  {activeItem.company
                    ? activeItem.company.toLowerCase().replace(/\s+/g, "_")
                    : "unknown"}
                  .{activeItem.type === "achievement" ? "json" : "tsx"}
                </div>
              </div>

              {/* Content */}
              <div className="mt-8 space-y-4">
                <div>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-yellow-400">
                    {activeItem.type === "achievement" ? "achievement" : "role"}
                  </span>{" "}
                  ={" "}
                  <span className="text-primary/80">
                    &quot;{activeItem.role}&quot;
                  </span>
                  ;
                </div>
                <div>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-yellow-400">
                    {activeItem.type === "achievement"
                      ? "organization"
                      : "company"}
                  </span>{" "}
                  ={" "}
                  <span className="text-primary/80">
                    &quot;{activeItem.company}&quot;
                  </span>
                  ;
                </div>
                <div>
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-yellow-400">period</span> ={" "}
                  <span className="text-blue-300">
                    &quot;{activeItem.period}&quot;
                  </span>
                  ;
                </div>

                <div className="pt-2">
                  <span className="text-zinc-500">
                    {"// "}
                    {activeItem.description}
                  </span>
                </div>

                {/* Highlights */}
                {activeItem.highlights && activeItem.highlights.length > 0 && (
                  <div className="pt-2">
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-yellow-400">highlights</span> = [
                    {activeItem.highlights.map((h, i) => (
                      <div key={i} className="pl-4">
                        <span className="text-primary/70">&quot;{h}&quot;</span>
                        <span className="text-zinc-500">,</span>
                      </div>
                    ))}
                    ];
                  </div>
                )}

                <div className="pt-4">
                  <span className="text-blue-400">export default</span>{" "}
                  <span className="text-purple-400">function</span>{" "}
                  <span className="text-yellow-300">details()</span> {"{"}
                  <div className="pl-4 py-2">
                    <span className="text-zinc-400">return</span> [
                    <div className="pl-4 flex flex-wrap gap-2 py-2">
                      {activeItem.skills?.map((skill, i) => (
                        <span key={i} className="text-primary">
                          &quot;{skill}&quot;
                          <span className="text-zinc-500">,</span>
                        </span>
                      )) || null}
                    </div>
                    ];
                  </div>
                  {"}"}
                </div>
              </div>

              {/* Cursor Blinking */}
              <motion.div
                className="w-2 h-4 bg-current mt-4"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
