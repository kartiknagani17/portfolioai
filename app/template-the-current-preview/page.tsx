"use client"
import TemplateTheCurrent from "@/components/templates/TemplateTheCurrent"
import type { PortfolioData } from "@/types/portfolio"

const MOCK_DATA: PortfolioData = {
  personal: {
    fullName: "Nadia Osei",
    professionalTitle: "Senior Investigative Journalist",
    email: "nadia@nadiaosei.com",
    phone: "+1 (917) 555-0182",
    location: "New York, NY",
    bio: "Investigative journalist covering tech, power, and society for a decade. My work has prompted congressional hearings, corporate policy changes, and two book deals. I believe the best stories aren't found — they're excavated.",
    linkedinUrl: "https://linkedin.com/in/nadiaosei",
    githubUrl: "",
    websiteUrl: "https://nadiaosei.com",
    profilePhotoUrl: null,
  },
  experience: [
    {
      companyName: "The Atlantic",
      roleTitle: "Senior Investigative Reporter",
      startDate: "2021-03",
      endDate: "",
      isCurrent: true,
      location: "New York, NY",
      description:
        "Lead investigative unit covering big tech and regulatory capture. Broke three major stories in 2023 that drove Senate subcommittee hearings on AI accountability. Manage a team of two junior reporters and one researcher.",
    },
    {
      companyName: "The Guardian US",
      roleTitle: "Staff Reporter, Technology",
      startDate: "2018-06",
      endDate: "2021-02",
      isCurrent: false,
      location: "New York, NY",
      description:
        "Covered Silicon Valley power structures, platform policy, and algorithmic harm. Co-authored the Guardian's landmark series on social media and teen mental health, reaching 4.2M readers and cited in 12 peer-reviewed studies.",
    },
    {
      companyName: "ProPublica",
      roleTitle: "Reporter",
      startDate: "2015-09",
      endDate: "2018-05",
      isCurrent: false,
      location: "New York, NY",
      description:
        "Data-driven accountability journalism on healthcare pricing and criminal justice. Pulitzer finalist 2017 for a year-long investigation into hospital billing practices across 14 states.",
    },
    {
      companyName: "BuzzFeed News",
      roleTitle: "Staff Writer",
      startDate: "2013-07",
      endDate: "2015-08",
      isCurrent: false,
      location: "New York, NY",
      description:
        "General assignment reporter pivoting into longform. Developed the sourcing networks and FOIA muscle that define my current practice.",
    },
  ],
  projects: [
    {
      projectName: "The Algorithm Audit",
      description:
        "12-month investigation into hiring algorithm bias at Fortune 500 companies. Obtained internal documents through 47 FOIA requests, interviewed 200+ affected workers, and worked with three university researchers to independently audit six platforms. Led to two class-action lawsuits and a proposed FTC rulemaking.",
      techStack: ["FOIA", "Data Analysis", "Source Development", "Legal Research"],
      liveUrl: "https://theatlantic.com/algorithm-audit",
      githubUrl: "",
    },
    {
      projectName: "Platform Power Series",
      description:
        "Six-part narrative series examining how five tech platforms shape global information flows — from content moderation outsourcing in the Philippines to disinformation laundering in Eastern Europe. Finalist for the George Polk Award in Investigative Reporting.",
      techStack: ["Longform Narrative", "International Reporting", "Source Protection"],
      liveUrl: "https://guardian.com/platform-power",
      githubUrl: "",
    },
    {
      projectName: "Hospital Bill Roulette",
      description:
        "Data investigation into opaque hospital billing practices across 14 US states. Scraped and cleaned 2.3M billing records, built a public-facing lookup tool, and partnered with NPR for audio reporting. Pulitzer Prize finalist 2017.",
      techStack: ["Python", "Data Scraping", "Public Records", "NPR Partnership"],
      liveUrl: "https://propublica.org/hospital-bills",
      githubUrl: "",
    },
    {
      projectName: "Teen & Screen",
      description:
        "Guardian's landmark series on the documented psychological effects of social media on adolescents. Synthesized 200+ studies and conducted 80 interviews with teens, parents, and platform employees. 4.2M readers, cited in 12 academic papers.",
      techStack: ["Narrative Reporting", "Research Synthesis", "Source Development"],
      liveUrl: "https://theguardian.com/teen-screen",
      githubUrl: "",
    },
  ],
  skills: [
    { name: "Investigative Reporting", category: "Core Craft" },
    { name: "FOIA & Public Records", category: "Core Craft" },
    { name: "Source Development", category: "Core Craft" },
    { name: "Longform Narrative", category: "Core Craft" },
    { name: "Data Journalism", category: "Technical" },
    { name: "Python / Pandas", category: "Technical" },
    { name: "SQL", category: "Technical" },
    { name: "DocumentCloud", category: "Technical" },
    { name: "Datawrapper", category: "Technical" },
    { name: "Signal / SecureDrop", category: "Technical" },
    { name: "Editorial Strategy", category: "Leadership" },
    { name: "Team Management", category: "Leadership" },
    { name: "Media Law & Ethics", category: "Leadership" },
    { name: "French", category: "Languages" },
    { name: "Twi (conversational)", category: "Languages" },
  ],
  education: [
    {
      institution: "Columbia University Graduate School of Journalism",
      degree: "Master of Science",
      fieldOfStudy: "Journalism",
      startYear: "2011",
      endYear: "2013",
    },
    {
      institution: "University of Ghana, Legon",
      degree: "Bachelor of Arts",
      fieldOfStudy: "Political Science & English",
      startYear: "2007",
      endYear: "2011",
    },
  ],
  certifications: [
    {
      name: "IRE NICAR Data Journalism Certificate",
      issuer: "Investigative Reporters and Editors",
      date: "2016",
      relevance: "Advanced data analysis techniques for accountability journalism",
    },
    {
      name: "Digital Security for Journalists",
      issuer: "Freedom of the Press Foundation",
      date: "2019",
      relevance: "Source protection, encrypted communications, operational security",
    },
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "French", proficiency: "Professional" },
    { language: "Twi", proficiency: "Conversational" },
  ],
  interests: [
    "Afrobeats",
    "Street photography",
    "Long-distance running",
    "Speculative fiction",
    "Fermentation",
  ],

  // AI-generated personality fields
  tagline: "The journalist power forgets is watching.",
  careerStory:
    "Nadia started her career chasing breaking news at BuzzFeed, learning to move fast without losing accuracy. But she quickly realized the stories that mattered most weren't the ones that happened overnight — they were the ones nobody wanted told. She spent years at ProPublica and The Guardian building the FOIA muscle, source networks, and data skills to excavate them. Today at The Atlantic, she leads investigations that don't just describe power — they hold it accountable.",
  workStyle:
    "Nadia works from the documents out. Before she talks to a single source, she wants to know what the paper trail says — because people lie, but records rarely do. She's patient in a way that makes subjects underestimate her, and relentless in a way that eventually unnerves them. She thinks the best investigative journalism is 20% inspiration and 80% FOIA follow-up.",
  lookingFor:
    "Nadia is open to editorial leadership roles, book projects, and fellowships that give her the runway to pursue investigations that take 12–18 months to get right. She's not interested in traffic optimization. She's interested in impact.",
}

export default function TemplateTheCurrentPreview() {
  return <TemplateTheCurrent portfolioData={MOCK_DATA} />
}
