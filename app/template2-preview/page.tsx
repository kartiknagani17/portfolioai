"use client"

import Template2 from "@/components/templates/Template2"

const MOCK_DATA = {
  personal: {
    fullName: "Maya Chen",
    professionalTitle: "Brand & Experience Designer",
    email: "maya@mayachen.co",
    phone: "+1 (212) 555-0187",
    location: "New York, NY",
    bio: "I design the spaces between products and people — visual systems that feel inevitable in hindsight. Obsessed with type, motion, and the quiet moments of delight that turn users into advocates. Previously at Pentagram and Mailchimp.",
    linkedinUrl: "#",
    githubUrl: "#",
    websiteUrl: "#",
    profilePhotoUrl: null,
  },
  experience: [
    {
      companyName: "Pentagram",
      roleTitle: "Senior Brand Designer",
      startDate: "Feb 2022",
      endDate: "",
      isCurrent: true,
      location: "New York, NY",
      description: "Leading identity work for Fortune 500 rebrandings and cultural institutions. Directed a 14-month visual identity system for a global financial services firm — launched across 60 markets. Mentoring a team of 5 junior designers.",
    },
    {
      companyName: "Mailchimp",
      roleTitle: "Brand Experience Designer",
      startDate: "Aug 2019",
      endDate: "Jan 2022",
      isCurrent: false,
      location: "Atlanta, GA",
      description: "Owned the brand expression across product touchpoints — email templates, in-app illustrations, and campaign creative. Built Mailchimp's first motion design system used by 200+ designers globally. Grew brand NPS by 18 points in 18 months.",
    },
    {
      companyName: "Wolff Olins",
      roleTitle: "Junior Designer",
      startDate: "Jun 2017",
      endDate: "Jul 2019",
      isCurrent: false,
      location: "London, UK",
      description: "Contributed to identity and brand strategy for clients including Tate Modern and a major UK retail chain. Developed visual systems, brand guidelines, and multi-channel campaign assets.",
    },
  ],
  projects: [
    {
      projectName: "Forma Type",
      description: "A variable typeface built for editorial use — 3 optical sizes, 9 weights, contextual alternates. Used by two independent magazines and a design studio in Berlin.",
      techStack: ["Glyphs App", "Python", "FontTools", "Variable OTF"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      projectName: "Still Life",
      description: "A generative art series exploring botanical structure through code. 40 unique prints sold at Christie's 2023 Digital Art sale. All pieces are on-chain.",
      techStack: ["p5.js", "IPFS", "Smart Contracts", "SVG"],
      liveUrl: "#",
      githubUrl: "",
    },
    {
      projectName: "Hue",
      description: "Colour palette tool for designers. Generates perceptually balanced palettes from a seed colour with WCAG contrast checking built-in. 8K monthly users.",
      techStack: ["React", "Chroma.js", "Tailwind", "Vercel"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      projectName: "Layers Podcast",
      description: "Weekly design interview series I host. 80+ episodes, 40K subscribers. Guests include Jessica Walsh, Erik Spiekermann, and the design team at Apple.",
      techStack: ["Substack", "Riverside FM", "Adobe Audition"],
      liveUrl: "#",
      githubUrl: "",
    },
  ],
  skills: [
    { name: "Brand Identity",   category: "Design" },
    { name: "Visual Systems",   category: "Design" },
    { name: "Typography",       category: "Design" },
    { name: "Motion Design",    category: "Design" },
    { name: "Art Direction",    category: "Design" },
    { name: "Figma",            category: "Tools" },
    { name: "After Effects",    category: "Tools" },
    { name: "Illustrator",      category: "Tools" },
    { name: "Glyphs App",       category: "Tools" },
    { name: "React",            category: "Frontend" },
    { name: "p5.js",            category: "Frontend" },
    { name: "CSS / GSAP",       category: "Frontend" },
    { name: "Brand Strategy",   category: "Strategy" },
    { name: "Workshop Facilitation", category: "Strategy" },
    { name: "Creative Direction",    category: "Strategy" },
  ],
  education: [
    {
      institution: "Royal College of Art",
      degree: "Master of Arts",
      fieldOfStudy: "Visual Communication",
      startYear: "2015",
      endYear: "2017",
    },
    {
      institution: "Rhode Island School of Design",
      degree: "Bachelor of Fine Arts",
      fieldOfStudy: "Graphic Design",
      startYear: "2011",
      endYear: "2015",
    },
  ],
  certifications: [
    {
      name: "Google UX Research Certificate",
      issuer: "Google",
      date: "Apr 2022",
      relevance: "User research methods and synthesis",
    },
    {
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "Nov 2021",
      relevance: "Cloud fundamentals for design-engineering collaboration",
    },
  ],
  languages: [
    { language: "English",  proficiency: "Native" },
    { language: "Mandarin", proficiency: "Fluent" },
    { language: "French",   proficiency: "Conversational" },
    { language: "Italian",  proficiency: "Basic" },
  ],
  interests: [
    "Letterpress printing",
    "Competitive swimming",
    "Japanese ceramics",
    "Rare book collecting",
    "Urban foraging",
    "Film photography",
    "Jazz piano",
  ],

  tagline: "The designer who makes billion-dollar brands feel human.",
  careerStory: "Maya started as a junior at Wolff Olins in London, learning that great design isn't decoration — it's architecture. A move to Mailchimp pushed her into motion and digital systems at scale, where she discovered her obsession with brand continuity across mediums. Today at Pentagram, she leads identity work for global institutions and believes the best brands are the ones people don't notice until they're gone.",
  workStyle: "Maya works from constraints outward — the tighter the brief, the sharper the thinking. She spends more time with type specimens and colour theory than in Figma, and her best work usually starts with a pencil. She runs collaborative crits that feel more like jazz improvisation than critique, and she's been known to redesign a logo at midnight because something felt slightly off.",
  lookingFor: "Ready to take creative direction at the principal level — either leading a studio's identity practice or founding something of her own. Drawn to projects where design has genuine cultural consequence, not just commercial return.",
}

export default function Template2Preview() {
  return <Template2 portfolioData={MOCK_DATA} />
}
