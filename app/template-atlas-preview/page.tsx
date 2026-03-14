import TemplateTheAtlas from "@/components/templates/TemplateTheAtlas"
import type { PortfolioData } from "@/types/portfolio"

const data: PortfolioData = {
  name: "Maya Chen",
  email: "maya@mayachen.io",
  phone: "+1 (212) 540-7821",
  location: "New York, NY",
  website: "https://mayachen.io",
  linkedin: "https://linkedin.com/in/mayachen",
  github: "https://github.com/mayachen",
  currentRole: "Product Manager",
  openToWork: true,

  bio: "I turn ambiguous problems into products people love. Five years building at the intersection of data, design, and engineering — most recently leading Notion's collaboration surface.",

  tagline: "Products that feel inevitable — until I build them, nobody knew they were missing.",

  careerStory: "I started as a designer, which means I learned to be wrong in public before I learned to be right. My first PM role was at a Series A fintech where I shipped three features before discovering the first one had the wrong success metric entirely. That failure taught me more than any success since. Notion found me through a cold tweet in 2020. I joined as PM #4 and helped scale the product from 1M to 20M users. Now I'm looking for something earlier, messier, and more important.",

  workStyle: "I write everything down — decisions, assumptions, open questions — because memory is lossy and alignment is the hardest engineering problem. I believe the PM's job is to make the team's job easier, not to be the smartest person in the room. I run lean: weekly async updates, monthly strategy reviews, no meeting without an agenda. I'm most useful when the problem is undefined.",

  lookingFor: "Head of Product or VP Product at a Series A–B company working on developer tools, knowledge management, or productivity infrastructure. Mission-driven, strong engineering culture, remote-friendly.",

  experience: [
    {
      title: "Senior Product Manager",
      company: "Notion",
      location: "San Francisco, CA (Remote)",
      startDate: "2020",
      endDate: "Present",
      current: true,
      description: "Led the collaboration surface — real-time editing, comments, and permissions — used by 20M+ users. Shipped multiplayer presence (live cursors, typing indicators) which drove a 34% increase in team workspace creation. Defined the product strategy for Notion AI's first launch, coordinating a 12-person cross-functional team across 3 time zones.",
    },
    {
      title: "Product Manager",
      company: "Brex",
      location: "San Francisco, CA",
      startDate: "2018",
      endDate: "2020",
      description: "Owned the spend management product from 0→1. Designed and shipped the receipt matching engine, reducing finance team reconciliation time by 60%. Grew the business card product from 200 to 4,000 active companies in 14 months.",
    },
    {
      title: "Product Designer",
      company: "IDEO",
      location: "New York, NY",
      startDate: "2016",
      endDate: "2018",
      description: "Designed digital products for clients across healthcare, fintech, and education. Led a 6-month engagement with a top-5 US bank to redesign their SMB onboarding flow, reducing drop-off by 41%.",
    },
  ],

  projects: [
    {
      name: "Notion AI Launch",
      description: "Defined product vision, success metrics, and launch strategy for Notion AI. Coordinated ML, product, design, and marketing across 3 continents. 1M+ users in first week.",
      technologies: ["Product Strategy", "AI/ML", "Growth"],
      url: "https://notion.so/product/ai",
    },
    {
      name: "Multiplayer Presence",
      description: "Real-time live cursors, typing indicators, and collaborative awareness for Notion. Shipped to 20M users with zero downtime. +34% team workspace creation.",
      technologies: ["WebSockets", "CRDT", "Product Design"],
    },
    {
      name: "Brex Spend Management",
      description: "0→1 spend management product including receipt OCR, policy enforcement, and accounting integrations. Grew from 200 to 4,000 companies in 14 months.",
      technologies: ["Fintech", "OCR", "0→1"],
      url: "https://brex.com",
    },
    {
      name: "SMB Onboarding Redesign",
      description: "End-to-end redesign of a top-5 US bank's SMB account opening flow. Reduced drop-off 41% and time-to-open from 22 minutes to 8 minutes.",
      technologies: ["UX Research", "Prototyping", "Banking"],
    },
  ],

  skills: [
    { name: "Product Strategy" },
    { name: "Roadmapping" },
    { name: "User Research" },
    { name: "Data Analysis" },
    { name: "SQL" },
    { name: "Figma" },
    { name: "A/B Testing" },
    { name: "Go-to-Market" },
    { name: "Stakeholder Management" },
    { name: "OKRs" },
    { name: "Python" },
    { name: "Amplitude" },
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
  return <TemplateTheAtlas data={data} />
}
