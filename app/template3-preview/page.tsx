"use client"

import Template3 from "@/components/templates/Template3"

const MOCK_DATA = {
  personal: {
    fullName: "Arjun Mehta",
    professionalTitle: "Senior Software Engineer",
    email: "arjun@arjunmehta.dev",
    phone: "+1 (415) 555-0294",
    location: "San Francisco, CA",
    bio: "I build systems that scale to millions and interfaces that feel like magic. Five years shipping production code at hypergrowth startups — from zero to 2M users at Notion, to infrastructure that handles 50K req/s at Stripe. I care about code that reads like prose and architectures that don't wake you up at 3am.",
    linkedinUrl: "#",
    githubUrl: "#",
    websiteUrl: "#",
    profilePhotoUrl: null,
  },
  experience: [
    {
      companyName: "Stripe",
      roleTitle: "Senior Software Engineer — Payments Infrastructure",
      startDate: "Mar 2023",
      endDate: "",
      isCurrent: true,
      location: "San Francisco, CA",
      description:
        "Architecting the next-gen payment routing layer handling 50K+ req/s. Led migration of legacy monolith to event-driven microservices — reduced p99 latency from 420ms to 38ms. Own the on-call rotation for core payments and mentor 3 junior engineers.",
    },
    {
      companyName: "Notion",
      roleTitle: "Software Engineer — Real-time Collaboration",
      startDate: "Jun 2021",
      endDate: "Feb 2023",
      isCurrent: false,
      location: "San Francisco, CA",
      description:
        "Built the operational transform engine powering real-time collaboration for 20M users. Designed a custom CRDT that reduced conflict resolution overhead by 60%. Shipped multiplayer cursors and presence system from 0 to GA in 4 months.",
    },
    {
      companyName: "Razorpay",
      roleTitle: "Software Engineer",
      startDate: "Aug 2019",
      endDate: "May 2021",
      isCurrent: false,
      location: "Bengaluru, India",
      description:
        "Built fraud detection pipeline processing 10M transactions/day using ML-scored rules engine. Reduced chargebacks by 34% YoY. Contributed to the open-source payments SDK (3K GitHub stars). Graduated from the batch hiring program as top performer.",
    },
  ],
  projects: [
    {
      projectName: "Hyperion",
      description:
        "Open-source distributed tracing library for Node.js with zero-config setup. Automatic instrumentation for Express, Fastify, and Prisma. 12K GitHub stars, used in production at 200+ companies.",
      techStack: ["TypeScript", "OpenTelemetry", "gRPC", "Prometheus"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      projectName: "Quill",
      description:
        "Collaborative markdown editor with real-time sync, version history, and AI-assisted writing. Built the CRDT sync engine from scratch. 8K users in 3 months, fully bootstrapped.",
      techStack: ["React", "Rust (WASM)", "WebSockets", "PocketBase"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      projectName: "Drift",
      description:
        "Visual latency profiler for microservices. Upload a flamegraph, get an interactive dependency graph with bottleneck analysis. Used internally at 3 YC companies.",
      techStack: ["Go", "D3.js", "Kafka", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "",
    },
    {
      projectName: "Reflex",
      description:
        "CLI tool that hot-reloads Go applications with sub-100ms rebuild times using incremental compilation. 5K stars. Featured in Go Weekly #423.",
      techStack: ["Go", "fsnotify", "exec", "CLI"],
      liveUrl: "",
      githubUrl: "#",
    },
  ],
  skills: [
    { name: "TypeScript", category: "Languages" },
    { name: "Go", category: "Languages" },
    { name: "Rust", category: "Languages" },
    { name: "Python", category: "Languages" },
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Frontend" },
    { name: "WebSockets", category: "Frontend" },
    { name: "WebAssembly", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "gRPC", category: "Backend" },
    { name: "PostgreSQL", category: "Backend" },
    { name: "Redis", category: "Backend" },
    { name: "Kafka", category: "Infra" },
    { name: "Kubernetes", category: "Infra" },
    { name: "AWS", category: "Infra" },
    { name: "Terraform", category: "Infra" },
    { name: "OpenTelemetry", category: "Observability" },
    { name: "Prometheus", category: "Observability" },
  ],
  education: [
    {
      institution: "IIT Bombay",
      degree: "Bachelor of Technology",
      fieldOfStudy: "Computer Science & Engineering",
      startYear: "2015",
      endYear: "2019",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect — Professional",
      issuer: "Amazon Web Services",
      date: "Jan 2024",
      relevance: "Cloud architecture and distributed systems design",
    },
    {
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation",
      date: "Sep 2022",
      relevance: "Container orchestration and cluster management",
    },
  ],
  languages: [
    { language: "English", proficiency: "Fluent" },
    { language: "Hindi", proficiency: "Native" },
    { language: "Gujarati", proficiency: "Native" },
    { language: "German", proficiency: "Basic" },
  ],
  interests: [
    "Competitive programming",
    "Open source",
    "Mechanical keyboards",
    "Bouldering",
    "Astrophysics",
    "Homelab / self-hosting",
    "Sci-fi novels",
    "Sourdough baking",
  ],

  tagline: "The engineer who ships before others finish planning.",
  careerStory: "Arjun started at Razorpay fresh out of IIT Bombay, building fraud detection systems that processed millions of transactions daily — learning early that scale isn't a feature, it's a constraint that shapes everything. Notion pulled him west to work on real-time collaboration, where he fell in love with the elegance of CRDTs. At Stripe, he now owns the infrastructure that quietly powers global commerce, and he's never happier than when a gnarly distributed systems problem lands on his desk.",
  workStyle: "Arjun thinks in systems first, implementations second. He's the engineer who asks 'what breaks at 100x?' before writing a single line, and who leaves codebases measurably cleaner than he found them. He gravitates toward problems at the boundary of product and infrastructure — the unglamorous work that makes everything else possible. Open source keeps him honest: public code demands a standard he holds himself to everywhere.",
  lookingFor: "Looking to step into a staff or principal role where the technical decisions he makes ripple across an entire product. Deeply interested in early-stage infrastructure challenges — the kind where there's no playbook yet and the right architecture is still up for debate.",
}

export default function Template3Preview() {
  return <Template3 portfolioData={MOCK_DATA} />
}
