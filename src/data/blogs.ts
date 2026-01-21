export type BlogType = "external" | "native-simple" | "native-book";

export interface Chapter {
  title: string;
  content: string; // Can be a long string or eventually Markdown
}

export interface BlogPost {
  id: string; // slug
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  type: BlogType;
  image?: string; // Optional cover image
  externalLink?: string; // Required if type === 'external'
  content?: string; // Required if type === 'native-simple', main body text
  bookData?: {
    chapters: Chapter[];
  }; // Required if type === 'native-book'
}

export const blogs: BlogPost[] = [
  // 1. External Link Example
  {
    id: "designing-resilient-microservices",
    title: "Designing Resilient Microservices",
    date: "Dec 15, 2024",
    excerpt:
      "Patterns and practices for building fault-tolerant distributed systems. Read on Medium.",
    readTime: "8 min read",
    category: "System Design",
    type: "external",
    externalLink: "https://medium.com", // Placeholder
  },
  // 2. Native Simple Blog Example
  {
    id: "kubernetes-at-scale",
    title: "Kubernetes at Scale",
    date: "Nov 28, 2024",
    excerpt:
      "Lessons learned from managing K8s clusters in production environments.",
    readTime: "12 min read",
    category: "DevOps",
    type: "native-simple",
    content: `
      <p>Managing Kubernetes clusters at scale brings a unique set of challenges that are often not visible in smaller deployments. As the number of nodes and pods grows, complexity increases exponentially.</p>
      
      <h2>Resource Management</h2>
      <p>One of the first hurdles we encountered was effective resource management. Setting appropriate requests and limits is crucial. If requests are too low, nodes can become overcommitted, leading to performance degradation. If limits are too high, a single rogue container can starve others of resources.</p>
      
      <h2>Networking</h2>
      <p>Networking at scale requires careful planning. We moved from standard overlays to high-performance CNI plugins to reduce latency and overhead. Monitoring network traffic between services became essential for identifying bottlenecks.</p>
      
      <h2>Observability</h2>
      <p>You cannot fix what you cannot see. We implemented a comprehensive observability stack including Prometheus for metrics, Grafana for visualization, and Jaeger for distributed tracing. This gave us the visibility needed to debug complex interactions between microservices.</p>
      
      <p>In conclusion, scaling Kubernetes is a journey of continuous learning and optimization. By focusing on resource management, robust networking, and deep observability, you can build a platform that scales with your business.</p>
    `,
  },
  // 3. Native Book Summary Example
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    date: "Jan 10, 2025",
    excerpt: "Summary of Morgan Housel's book on wealth, greed, and happiness.",
    readTime: "20 min read",
    category: "Finance / Books",
    type: "native-book",
    bookData: {
      chapters: [
        {
          title: "Introduction",
          content:
            "<p>The premise of this book is that doing well with money has a little to do with how smart you are and a lot to do with how you behave. And behavior is hard to teach, even to really smart people.</p>",
        },
        {
          title: "No One's Crazy",
          content:
            "<p>Your personal experiences with money make up maybe 0.00000001% of what’s happened in the world, but maybe 80% of how you think the world works. People do some crazy things with money. But no one is crazy. different generations, parents, incomes etc.</p>",
        },
        {
          title: "Luck & Risk",
          content:
            "<p>Luck and risk are siblings. They are both the reality that every outcome in life is guided by forces other than individual effort. Bill Gates went to one of the only high schools in the world that had a computer.</p>",
        },
        {
          title: "Never Enough",
          content:
            "<p>There is no reason to risk what you have and need for what you don't have and don't need. The hardest financial skill is getting the goalpost to stop moving.</p>",
        },
      ],
    },
  },
  {
    id: "event-driven-architecture",
    title: "Event-Driven Architecture",
    date: "Nov 10, 2024",
    excerpt: "Building loosely coupled systems with event streaming and CQRS.",
    readTime: "10 min read",
    category: "Architecture",
    type: "external",
    externalLink: "https://medium.com",
  },
  {
    id: "zero-downtime",
    title: "Zero Downtime Deploys",
    date: "Nov 03, 2024",
    excerpt: "Techniques to ship with confidence in large systems.",
    readTime: "7 min read",
    category: "DevOps",
    type: "native-simple",
    content:
      "<p>Achieving zero downtime requires a mix of strategy and tooling. Blue-Green deployments and Canary releases are the industry standards...</p>",
  },
];
