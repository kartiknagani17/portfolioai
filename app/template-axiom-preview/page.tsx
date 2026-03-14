import TemplateAxiom from "@/components/templates/TemplateAxiom"
import type { PortfolioData } from "@/types/portfolio"

const data: PortfolioData = {
  name: "Arjun Mehta",
  email: "arjun@arjunmehta.dev",
  phone: "+1 (415) 882-4401",
  location: "San Francisco, CA",
  website: "https://arjunmehta.dev",
  linkedin: "https://linkedin.com/in/arjunmehta",
  github: "https://github.com/arjunmehta",
  currentRole: "Senior Software Engineer",
  openToWork: true,

  bio: "I build the infrastructure that moves money at scale. Eight years writing systems that need to be fast, correct, and boring — in the best possible way.",

  tagline: "I write code that banks trust with billions.",

  careerStory: "I started writing code at 14, building small games in Java that nobody played but me. UC Berkeley gave me the theory; my first internship at Google taught me that scale changes everything. After two years on Google's Payments infrastructure I joined Coinbase right as crypto was exploding — rebuilt their transaction settlement pipeline from scratch, cutting failure rates by 94%. Stripe came calling in 2021 and I've been here since, leading the team that keeps the Checkout product running for 200,000 merchants. The thing I keep learning is that the best systems are the ones nobody notices.",

  workStyle: "I believe the best engineering is invisible — if users notice the infrastructure, something has gone wrong. I default to simple and proven over clever and novel, because production humbles everyone eventually. I do my best thinking by writing; a clear design doc prevents more bugs than any code review. Collaboration is not a soft skill — it is the skill, and I invest in it deliberately.",

  lookingFor: "Staff or Principal Engineer roles at a Series B or later company working on developer tools, fintech infrastructure, or distributed systems. Remote-friendly, equity-meaningful, mission I can explain at dinner.",

  experience: [
    {
      title: "Senior Software Engineer",
      company: "Stripe",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "Present",
      current: true,
      description: "Tech lead for the Checkout reliability team. Designed and shipped a stateless session architecture that reduced P99 latency from 340ms to 58ms across 200,000 merchants. Built the automatic retry and idempotency framework now used across 12 Stripe products. Mentoring a team of 6 engineers across three time zones.",
      technologies: ["Go", "PostgreSQL", "Redis", "Kubernetes", "gRPC"],
    },
    {
      title: "Software Engineer II",
      company: "Coinbase",
      location: "San Francisco, CA",
      startDate: "2019",
      endDate: "2021",
      description: "Rebuilt the crypto transaction settlement pipeline during peak 2021 volume — 4× throughput improvement while reducing settlement failures by 94%. Introduced distributed tracing with OpenTelemetry across the payments stack, which cut mean time-to-resolve incidents from 47 minutes to 8 minutes.",
      technologies: ["TypeScript", "Node.js", "Kafka", "AWS", "React"],
    },
    {
      title: "Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      startDate: "2017",
      endDate: "2019",
      description: "Worked on Google Pay's backend fraud detection pipeline, processing 3M+ transactions per day. Contributed to the ML feature store that reduced false-positive fraud flags by 18%. Graduated from Google's SWE development program with a 'Strongly Exceeds' rating in both performance cycles.",
      technologies: ["Java", "Python", "BigQuery", "Spanner", "TensorFlow"],
    },
  ],

  projects: [
    {
      name: "Idempotency Engine",
      title: "Idempotency Engine",
      description: "Open-source library for building idempotent APIs in Go. Handles deduplication, state tracking, and retry logic with pluggable storage backends. 3,400 GitHub stars, used in production at 40+ companies.",
      technologies: ["Go", "Redis", "PostgreSQL"],
      url: "https://github.com/arjunmehta/idempotency",
      github: "https://github.com/arjunmehta/idempotency",
    },
    {
      name: "StreamLedger",
      title: "StreamLedger",
      description: "Real-time double-entry ledger built on Kafka Streams. Sub-10ms write latency at 50k TPS. Designed for event-sourced fintech systems where auditability is non-negotiable.",
      technologies: ["Java", "Kafka", "PostgreSQL", "Docker"],
      url: "https://github.com/arjunmehta/streamledger",
    },
    {
      name: "PGVault",
      title: "PGVault",
      description: "Zero-config secrets management for PostgreSQL-backed apps. Rotates credentials automatically, wraps the pg driver transparently, and integrates with Vault or AWS Secrets Manager.",
      technologies: ["TypeScript", "PostgreSQL", "AWS"],
      url: "https://github.com/arjunmehta/pgvault",
    },
    {
      name: "Loadr",
      title: "Loadr",
      description: "HTTP load testing CLI with percentile-accurate latency histograms. Inspired by wrk2 but with better reporting and native support for authenticated sessions.",
      technologies: ["Rust", "HTTP/2", "CLI"],
      url: "https://github.com/arjunmehta/loadr",
    },
  ],

  skills: [
    { name: "Go",           level: "Expert" },
    { name: "TypeScript",   level: "Expert" },
    { name: "PostgreSQL",   level: "Expert" },
    { name: "Distributed Systems", level: "Expert" },
    { name: "Kubernetes",   level: "Advanced" },
    { name: "Redis",        level: "Advanced" },
    { name: "Kafka",        level: "Advanced" },
    { name: "React",        level: "Intermediate" },
    { name: "Rust",         level: "Intermediate" },
    { name: "Python",       level: "Intermediate" },
  ],

  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Hindi",   proficiency: "Native" },
    { language: "French",  proficiency: "Conversational" },
    { language: "Mandarin",proficiency: "Elementary" },
  ],

  interests: [
    "Chess", "Open Source", "Trail Running", "Fermentation", "Sci-fi novels", "Mechanical keyboards",
  ],

  education: [
    {
      degree: "B.S. Computer Science",
      institution: "UC Berkeley",
      school: "UC Berkeley",
      startYear: "2013",
      endYear: "2017",
      fieldOfStudy: "Distributed Systems & Programming Languages",
    },
  ],
}

export default function Page() {
  return <TemplateAxiom data={data} />
}
