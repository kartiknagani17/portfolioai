import TemplateTheAtlas from "@/components/templates/TemplateTheAtlas"
import type { PortfolioData } from "@/types/portfolio"

const data: PortfolioData = {
  personal: {
    fullName: "Maya Chen",
    professionalTitle: "Product Manager",
    email: "maya@mayachen.io",
    phone: "+1 (212) 540-7821",
    location: "New York, NY",
    bio: "I turn ambiguous problems into products people love. Five years building at the intersection of data, design, and engineering — most recently leading Notion's collaboration surface.",
    linkedinUrl: "https://linkedin.com/in/mayachen",
    githubUrl: "https://github.com/mayachen",
    websiteUrl: "https://mayachen.io",
    profilePhotoUrl: null,
  },

  tagline: "Products that feel inevitable — until I build them, nobody knew they were missing.",

  careerStory: "I started as a designer, which means I learned to be wrong in public before I learned to be right. My first PM role was at a Series A fintech where I shipped three features before discovering the first one had the wrong success metric entirely. That failure taught me more than any success since. Notion found me through a cold tweet in 2020. I joined as PM #4 and helped scale the product from 1M to 20M users. Now I'm looking for something earlier, messier, and more important.",

  workStyle: "I write everything down — decisions, assumptions, open questions — because memory is lossy and alignment is the hardest engineering problem. I believe the PM's job is to make the team's job easier, not to be the smartest person in the room. I run lean: weekly async updates, monthly strategy reviews, no meeting without an agenda. I'm most useful when the problem is undefined.",

  lookingFor: "Head of Product or VP Product at a Series A–B company working on developer tools, knowledge management, or productivity infrastructure. Mission-driven, strong engineering culture, remote-friendly.",

  experience: [
    {
      roleTitle: "Senior Product Manager",
      companyName: "Notion",
      location: "San Francisco, CA (Remote)",
      startDate: "2020",
      endDate: "",
      isCurrent: true,
      description: "Led the collaboration surface — real-time editing, comments, and permissions — used by 20M+ users. Shipped multiplayer presence (live cursors, typing indicators) which drove a 34% increase in team workspace creation. Defined the product strategy for Notion AI's first launch, coordinating a 12-person cross-functional team across 3 time zones.",
    },
    {
      roleTitle: "Product Manager",
      companyName: "Brex",
      location: "San Francisco, CA",
      startDate: "2018",
      endDate: "2020",
      isCurrent: false,
      description: "Owned the spend management product from 0→1. Designed and shipped the receipt matching engine, reducing finance team reconciliation time by 60%. Grew the business card product from 200 to 4,000 active companies in 14 months.",
    },
    {
      roleTitle: "Product Designer",
      companyName: "IDEO",
      location: "New York, NY",
      startDate: "2016",
      endDate: "2018",
      isCurrent: false,
      description: "Designed digital products for clients across healthcare, fintech, and education. Led a 6-month engagement with a top-5 US bank to redesign their SMB onboarding flow, reducing drop-off by 41%.",
    },
  ],

  projects: [
    {
      projectName: "Notion AI Launch",
      description: "Defined product vision, success metrics, and launch strategy for Notion AI. Coordinated ML, product, design, and marketing across 3 continents. 1M+ users in first week.",
      techStack: ["Product Strategy", "AI/ML", "Growth"],
      liveUrl: "https://notion.so/product/ai",
      githubUrl: "",
    },
    {
      projectName: "Multiplayer Presence",
      description: "Real-time live cursors, typing indicators, and collaborative awareness for Notion. Shipped to 20M users with zero downtime. +34% team workspace creation.",
      techStack: ["WebSockets", "CRDT", "Product Design"],
      liveUrl: "",
      githubUrl: "",
    },
    {
      projectName: "Brex Spend Management",
      description: "0→1 spend management product including receipt OCR, policy enforcement, and accounting integrations. Grew from 200 to 4,000 companies in 14 months.",
      techStack: ["Fintech", "OCR", "0→1"],
      liveUrl: "https://brex.com",
      githubUrl: "",
    },
    {
      projectName: "SMB Onboarding Redesign",
      description: "End-to-end redesign of a top-5 US bank's SMB account opening flow. Reduced drop-off 41% and time-to-open from 22 minutes to 8 minutes.",
      techStack: ["UX Research", "Prototyping", "Banking"],
      liveUrl: "",
      githubUrl: "",
    },
  ],

  skills: [
    { name: "Product Strategy", category: "Product" },
    { name: "Roadmapping", category: "Product" },
    { name: "User Research", category: "Research" },
    { name: "Data Analysis", category: "Research" },
    { name: "SQL", category: "Technical" },
    { name: "Figma", category: "Design" },
    { name: "A/B Testing", category: "Research" },
    { name: "Go-to-Market", category: "Product" },
    { name: "Stakeholder Management", category: "Leadership" },
    { name: "OKRs", category: "Product" },
    { name: "Python", category: "Technical" },
    { name: "Amplitude", category: "Technical" },
  ],

  languages: [
    { language: "English",  proficiency: "Native" },
    { language: "Mandarin", proficiency: "Native" },
    { language: "French",   proficiency: "Intermediate" },
  ],

  interests: ["Urban Sketching", "Speculative Fiction", "Ceramics", "Long-distance cycling", "Open source tools", "Documentary film"],

  education: [
    {
      degree: "B.A. Cognitive Science & Design",
      institution: "Brown University",
      startYear: "2012",
      endYear: "2016",
      fieldOfStudy: "Human-Computer Interaction",
    },
  ],
}

export default function Page() {
  return <TemplateTheAtlas portfolioData={data} />
}
