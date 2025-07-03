"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlogsSlide() {
  const blogs = [
    {
      title: "Designing Resilient Microservices",
      date: "Dec 15, 2024",
      excerpt: "Patterns and practices for building fault-tolerant distributed systems.",
      readTime: "8 min read",
      category: "System Design",
    },
    {
      title: "Kubernetes at Scale",
      date: "Nov 28, 2024",
      excerpt: "Lessons learned from managing K8s clusters in production environments.",
      readTime: "12 min read",
      category: "DevOps",
    },
    {
      title: "Event-Driven Architecture Patterns",
      date: "Nov 10, 2024",
      excerpt: "Building loosely coupled systems with event streaming and CQRS.",
      readTime: "10 min read",
      category: "Architecture",
    },
    {
      title: "Zero Downtime Deployments",
      date: "Nov 03, 2024",
      excerpt: "Techniques to ship with confidence in large systems.",
      readTime: "7 min read",
      category: "DevOps",
    },
    {
      title: "Chaos Engineering 101",
      date: "Oct 20, 2024",
      excerpt: "How to test system resilience through failure injection.",
      readTime: "9 min read",
      category: "Resilience",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-light text-gray-800 mb-4">
          <span className="text-orange-500">Technical</span> Insights
        </h1>
        <p className="text-lg text-gray-600">
          Deep dives into system design, infrastructure, and engineering practices
        </p>
      </motion.div>

      {/* Blog Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                    {blog.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{blog.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{blog.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{blog.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-500 font-medium">{blog.date}</span>
                  <Button variant="ghost" className="text-orange-500 hover:text-orange-600 p-0 text-sm">
                    Read More →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
