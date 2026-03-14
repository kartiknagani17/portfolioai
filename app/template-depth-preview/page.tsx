"use client"
import TemplateDepth from "@/components/templates/TemplateDepth"
import type { PortfolioData } from "@/types/portfolio"

const MOCK_DATA: PortfolioData = {
  personal: {
    fullName: "Reza Tehrani",
    professionalTitle: "Principal Architect",
    email: "reza@rezatehrani.com",
    phone: "+1 (212) 555-0138",
    location: "New York, NY",
    bio: "I design buildings that negotiate between the forces of nature, culture, and urban life. My practice spans civic institutions, housing, and public space — always asking how architecture can be generous to the city around it.",
    linkedinUrl: "https://linkedin.com/in/rezatehrani",
    githubUrl: "",
    websiteUrl: "https://rezatehrani.com",
    profilePhotoUrl: null,
  },
  experience: [
    {
      companyName: "Bjarke Ingels Group (BIG)",
      roleTitle: "Principal Architect",
      startDate: "2019-03",
      endDate: "",
      isCurrent: true,
      location: "New York, NY",
      description:
        "Lead design principal on three concurrent projects across North America and the Middle East. Oversee a studio of 22 architects and designers. Currently directing the Urban Nexus Tower (New York) and the Oman Cultural Center — both under construction.",
    },
    {
      companyName: "Zaha Hadid Architects",
      roleTitle: "Senior Associate",
      startDate: "2014-07",
      endDate: "2019-02",
      isCurrent: false,
      location: "London, UK",
      description:
        "Senior designer on the Sleuk Rith Institute (Phnom Penh) and the Morpheus Hotel (Macau). Developed the parametric facade system for the Morpheus — a 150,000m² free-form exoskeleton resolved entirely in Grasshopper and fabricated with 2,500 unique steel nodes.",
    },
    {
      companyName: "Snøhetta",
      roleTitle: "Project Architect",
      startDate: "2011-09",
      endDate: "2014-06",
      isCurrent: false,
      location: "Oslo, Norway",
      description:
        "Project architect on the National Museum of Norway expansion and the Ryerson University Student Learning Centre. Responsible for design development, consultant coordination, and construction administration across both projects.",
    },
    {
      companyName: "Kengo Kuma & Associates",
      roleTitle: "Architectural Designer",
      startDate: "2009-04",
      endDate: "2011-08",
      isCurrent: false,
      location: "Tokyo, Japan",
      description:
        "Worked on cultural and hospitality projects across Japan and China. Contributed to material research and detail development for the Asakusa Culture Tourist Information Center and Yusuhara Wooden Bridge Museum.",
    },
  ],
  projects: [
    {
      projectName: "Urban Nexus Tower — New York",
      description:
        "A 62-storey mixed-use tower in Hudson Yards integrating residential, office, and a public cultural hall at grade. The tower's diagrid exoskeleton eliminates interior columns, creating column-free floor plates of up to 3,800m². Targeting LEED Platinum. Due for completion 2027.",
      techStack: ["Rhino", "Grasshopper", "Revit", "BIM 360", "Structural Optimisation"],
      liveUrl: "https://rezatehrani.com/nexus",
      githubUrl: "",
    },
    {
      projectName: "Oman National Cultural Center",
      description:
        "A 45,000m² civic campus in Muscat housing a national museum, performing arts hall, and public library. The project draws on traditional Omani mashrabiya screens, reinterpreted as a computational ceramic facade system. Winner of the Aga Khan Award shortlist 2024.",
      techStack: ["Parametric Design", "Ceramic Fabrication", "AutoCAD", "V-Ray"],
      liveUrl: "https://rezatehrani.com/oman",
      githubUrl: "",
    },
    {
      projectName: "Hudson Yards Public Pavilion",
      description:
        "A ground-level public pavilion and water feature integrated into the Hudson Yards development. The folded steel canopy shelters an outdoor market and performance space. Completed 2022. Winner — AIA New York Design Award.",
      techStack: ["Structural Steel", "Rhino", "Enscape", "Fabrication Drawing"],
      liveUrl: "https://rezatehrani.com/pavilion",
      githubUrl: "",
    },
    {
      projectName: "Ecological Housing Prototype",
      description:
        "A research-led housing prototype exploring mass-timber construction for mid-rise urban infill. Built in collaboration with the ETH Zurich Future Cities Lab. The prototype achieves a 74% reduction in embodied carbon versus concrete equivalent. Published in Architectural Review.",
      techStack: ["Mass Timber", "Carbon Analysis", "Computational Structures", "Research"],
      liveUrl: "https://rezatehrani.com/eco-housing",
      githubUrl: "",
    },
  ],
  skills: [
    { name: "Architectural Design",    category: "Design" },
    { name: "Urban Planning",          category: "Design" },
    { name: "Parametric Design",       category: "Design" },
    { name: "Sustainable Architecture",category: "Design" },
    { name: "Rhino + Grasshopper",     category: "Software" },
    { name: "Revit / BIM",            category: "Software" },
    { name: "AutoCAD",                 category: "Software" },
    { name: "V-Ray / Enscape",         category: "Software" },
    { name: "Adobe Creative Suite",    category: "Software" },
    { name: "Project Leadership",      category: "Practice" },
    { name: "Client Management",       category: "Practice" },
    { name: "Construction Administration", category: "Practice" },
    { name: "Consultant Coordination", category: "Practice" },
    { name: "Grant Writing",           category: "Practice" },
  ],
  education: [
    {
      institution: "Harvard Graduate School of Design",
      degree: "Master of Architecture",
      fieldOfStudy: "Architecture",
      startYear: "2007",
      endYear: "2009",
    },
    {
      institution: "University of Tehran",
      degree: "Bachelor of Architecture",
      fieldOfStudy: "Architecture & Urban Design",
      startYear: "2002",
      endYear: "2007",
    },
  ],
  certifications: [
    {
      name: "LEED Accredited Professional BD+C",
      issuer: "U.S. Green Building Council",
      date: "2013",
      relevance: "Sustainable design and green building certification",
    },
    {
      name: "AIA New York Design Award",
      issuer: "American Institute of Architects — New York",
      date: "2022",
      relevance: "Hudson Yards Public Pavilion",
    },
  ],
  languages: [
    { language: "Farsi",   proficiency: "Native" },
    { language: "English", proficiency: "Fluent" },
    { language: "French",  proficiency: "Intermediate" },
    { language: "Japanese",proficiency: "Conversational" },
    { language: "German",  proficiency: "Basic" },
  ],
  interests: [
    "Analogue photography",
    "Persian calligraphy",
    "Long-distance cycling",
    "Computational art",
    "Sufi poetry",
  ],

  tagline: "Architecture is the slowest art — and the most permanent argument.",
  careerStory:
    "Reza began his career studying the geometry of Persian bazaars in Tehran, drawn to the way pre-modern builders solved complex structural and social problems simultaneously. A Harvard MArch brought him to Kengo Kuma's Tokyo studio, where he spent two years understanding how material restraint creates emotional depth. Zaha Hadid's London office followed — five years learning to resolve the beautiful and the buildable at scale. Today at BIG in New York, he leads a studio that believes the best architecture is simultaneously inevitable and surprising.",
  workStyle:
    "Reza designs from the section first. He believes the plan is a promise and the section is the truth. He pushes his team to resolve structural logic and spatial experience as a single system — never decoration applied after the fact. He runs a studio where every junior architect presents directly to clients, because he thinks presentation is design thinking made audible.",
  lookingFor:
    "Reza is open to civic commissions, museum and cultural institution projects, and research collaborations with universities. He is particularly interested in projects that address housing affordability and ecological construction in dense urban contexts. He is not available for single-family residential work.",
}

export default function TemplateDepthPreview() {
  return <TemplateDepth portfolioData={MOCK_DATA} />
}
