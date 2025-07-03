"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Cloud, Server, Briefcase } from "lucide-react"

export default function ProjectsSlide() {
  const projects = [
    {
      title: "Multi‑Cloud Platform",
      year: "2024",
      description:
        "Designed and implemented a multi‑cloud platform serving 10M+ requests/day with 99.99% uptime.",
      tech: ["Kubernetes", "Terraform", "AWS", "GCP", "Istio"],
      impact: "99.99% uptime",
      metrics: "10M+ req/day",
      icon: Cloud,
    },
    {
      title: "Microservices Migration",
      year: "2023",
      description:
        "Led migration from monolith to microservices architecture for a fintech platform.",
      tech: ["Docker", "Kubernetes", "Redis", "PostgreSQL", "Kafka"],
      impact: "50% faster deployments",
      metrics: "15 services",
      icon: Server,
    },
    {
      title: "CI/CD Pipeline Automation",
      year: "2023",
      description:
        "Built comprehensive DevOps pipeline reducing deployment time from hours to minutes.",
      tech: ["Jenkins", "GitLab CI", "Ansible", "Prometheus", "Grafana"],
      impact: "90% faster deployments",
      metrics: "200+ deployments/week",
      icon: Briefcase,
    },
  ]

  return (
    <div className="relative space-y-12">
      {/* Timeline Center Line */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-400 via-orange-300 to-transparent z-0"
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Title */}
      <motion.div
        className="text-center relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-light text-gray-800 mb-4">
          Infrastructure <span className="text-orange-500">Projects</span>
        </h1>
        <motion.div
          className="w-4 h-4 bg-orange-500 rounded-full mx-auto"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Project Entries */}
      <div className="relative z-10 space-y-16">
        {projects.map((proj, i) => {
          const Icon = proj.icon
          const isLeft = i % 2 === 0
          return (
            <motion.div
              key={i}
              className={`grid md:grid-cols-2 items-center gap-8 ${
                isLeft ? "md:text-right" : ""
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.8 }}
            >
              {/* Timeline Dot */}
              <motion.div
                className="absolute left-1/2 top-1/2 w-6 h-6 bg-orange-500 rounded-full z-20 border-4 border-gray-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
              />

              {/* Info Panel */}
              <div className={isLeft ? "md:pr-12" : "md:order-2 md:pl-12"}>
                <h3 className="text-2xl md:text-3xl font-light text-gray-800 mb-2">
                  {proj.title}
                </h3>
                <p className="text-orange-500 font-medium mb-4">{proj.year}</p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {proj.tech.map((t, j) => (
                    <Badge key={j} variant="outline" className="border-orange-200 text-orange-700 text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm font-medium">
                  <p className="text-green-600">{proj.impact}</p>
                  <p className="text-blue-600">{proj.metrics}</p>
                </div>
              </div>

              {/* Architecture Preview */}
              <div className={isLeft ? "md:pl-12" : "md:order-1 md:pr-12"}>
                <motion.div
                  className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-8 h-48 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.2, duration: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-orange-700 font-medium">Architecture Preview</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
