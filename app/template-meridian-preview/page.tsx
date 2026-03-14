"use client"
import TemplateMeridian from "@/components/templates/TemplateMeridian"
import type { PortfolioData } from "@/types/portfolio"

const MOCK_DATA: PortfolioData = {
  personal: {
    fullName: "Jordan Reeves",
    professionalTitle: "Senior Product Manager",
    email: "jordan@example.com",
    phone: "+1 (415) 000-0000",
    location: "San Francisco, CA",
    bio: "I turn ambiguous problems into shipped products. With 8 years leading cross-functional teams across fintech and consumer apps, I obsess over the gap between what users say and what they actually need.",
    linkedinUrl: "https://linkedin.com/in/jordanreeves",
    githubUrl: "https://github.com/jordanreeves",
    websiteUrl: "https://jordanreeves.co",
    profilePhotoUrl: null,
  },

  experience: [
    {
      companyName: "Stripe",
      roleTitle: "Senior Product Manager",
      startDate: "2021",
      isCurrent: true,
      location: "San Francisco, CA",
      description:
        "Led the 0→1 launch of Stripe's embedded finance suite, coordinating 3 engineering squads and 2 design pods. Grew adoption from 0 to 4,200 enterprise clients in 18 months.",
    },
    {
      companyName: "Robinhood",
      roleTitle: "Product Manager II",
      startDate: "2018",
      endDate: "2021",
      location: "Menlo Park, CA",
      description:
        "Owned the options trading product. Shipped 6 major feature releases, reduced onboarding drop-off by 34%, and collaborated daily with legal and compliance to navigate a heavily regulated space.",
    },
    {
      companyName: "Intuit",
      roleTitle: "Associate Product Manager",
      startDate: "2015",
      endDate: "2018",
      location: "Mountain View, CA",
      description:
        "Started on the QuickBooks mobile team. First role out of university — learned product craft the hard way: shipping, breaking things, and fixing them faster the next time.",
    },
  ],

  projects: [
    {
      projectName: "Meridian Finance Dashboard",
      description:
        "A real-time portfolio analytics dashboard built for retail investors. Ingests data from 12 broker APIs, surfaces AI-powered insights, and helped 40,000 users reduce their portfolio fees by an average of 31%.",
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "OpenAI API"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/jordanreeves/meridian",
    },
    {
      projectName: "Onboard OS",
      description:
        "No-code onboarding flow builder for SaaS products. Built as a side project, acquired 800 paying users in 4 months with zero marketing budget.",
      techStack: ["Next.js", "Supabase", "Stripe"],
      liveUrl: "https://example.com",
    },
    {
      projectName: "Clarity PRD",
      description:
        "Open-source PRD template system with AI-assisted spec generation. 2,300 stars on GitHub. Used by PMs at Figma, Notion, and Linear.",
      techStack: ["Python", "Claude API", "Markdown"],
      githubUrl: "https://github.com/jordanreeves/clarity-prd",
    },
  ],

  skills: [
    { name: "Product Strategy", category: "Product & Strategy" },
    { name: "Roadmapping", category: "Product & Strategy" },
    { name: "OKRs & KPIs", category: "Product & Strategy" },
    { name: "Go-to-Market", category: "Product & Strategy" },
    { name: "Competitive Analysis", category: "Product & Strategy" },
    { name: "A/B Testing", category: "Product & Strategy" },
    { name: "User Interviews", category: "Research & Data" },
    { name: "SQL", category: "Research & Data" },
    { name: "Mixpanel", category: "Research & Data" },
    { name: "Amplitude", category: "Research & Data" },
    { name: "Figma", category: "Research & Data" },
    { name: "React", category: "Engineering Fluency" },
    { name: "TypeScript", category: "Engineering Fluency" },
    { name: "REST APIs", category: "Engineering Fluency" },
    { name: "System Design", category: "Engineering Fluency" },
    { name: "Agile / Scrum", category: "Engineering Fluency" },
  ],

  education: [
    {
      institution: "UC Berkeley, College of Engineering",
      degree: "B.S.",
      fieldOfStudy: "Computer Science",
      startYear: "2011",
      endYear: "2015",
    },
    {
      institution: "Kellogg School of Management",
      degree: "Executive Program",
      fieldOfStudy: "Product Leadership",
      startYear: "2019",
      endYear: "2019",
    },
  ],

  certifications: [
    {
      name: "Certified Scrum Product Owner (CSPO)",
      issuer: "Scrum Alliance",
      date: "2022",
    },
    {
      name: "AWS Solutions Architect — Associate",
      issuer: "Amazon Web Services",
      date: "2021",
    },
    {
      name: "Google Analytics Individual Qualification",
      issuer: "Google",
      date: "2023",
    },
  ],

  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Spanish", proficiency: "Conversational" },
  ],

  interests: ["Long-distance running", "Mechanical keyboards", "Independent cinema", "Sourdough baking"],

  // ── AI-generated fields ──
  tagline:
    "The PM who ships before others finish planning — and still sleeps at night.",

  careerStory:
    "I started as an engineer who cared too much about the user experience to stay in the back end. Three roles later, I found that the most important skill in product isn't prioritisation or roadmapping — it's knowing which conversations to have before anyone writes a single line of code.",

  workStyle:
    "Clarity before velocity. I spend more time than most asking 'why are we doing this?' — and it shows in what doesn't ship as much as what does. Write everything down. Decisions, trade-offs, what we considered and rejected. Async cultures win, and they run on documentation. Disagree and commit. I'll push back hard in the room. Once a call is made, I execute with full energy — no passive resistance. Respect engineer time. Vague specs are a tax on engineering. I write PRDs that answer the question before it's asked.",

  lookingFor:
    "Ready to join a founding-stage team where I can shape the product from day zero — not inherit a roadmap.",
}

export default function TemplateMeridianPreview() {
  return <TemplateMeridian portfolioData={MOCK_DATA} />
}
