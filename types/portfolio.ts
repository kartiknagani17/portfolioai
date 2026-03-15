export interface PortfolioData {
  personal: {
    fullName: string
    professionalTitle: string
    email: string
    phone: string
    location: string
    bio: string
    linkedinUrl: string
    githubUrl: string
    websiteUrl: string
    profilePhotoUrl: string | null
  }
  experience: {
    companyName: string
    roleTitle: string
    startDate: string
    endDate: string
    isCurrent: boolean
    location: string
    description: string
  }[]
  projects: {
    projectName: string
    description: string
    techStack: string[]
    liveUrl: string
    githubUrl: string
    imageUrl?: string
  }[]
  skills: {
    name: string
    category: string
  }[]
  education: {
    institution: string
    degree: string
    fieldOfStudy: string
    startYear: string
    endYear: string
  }[]
  certifications?: {
    name: string
    issuer: string
    date: string
    relevance?: string
  }[]
  languages?: {
    language: string
    proficiency: string
  }[]
  interests?: string[]
  testimonials?: {
    name: string
    role: string
    company: string
    quote: string
    avatarUrl?: string
  }[]

  // ── AI-generated personality fields ──────────────────────────────────────
  // Gemini synthesizes these from the full resume. Always rendered — never conditional.
  tagline: string       // One punchy sentence capturing who they are
  careerStory: string   // 2–4 sentence narrative arc: start → drive → now
  workStyle: string     // How they think and work, inferred from career patterns
  lookingFor: string    // What they want next, inferred from trajectory
}

export interface AssemblyConfig {
  sectionsOrder?: string[]
  content?: Record<string, string | undefined>
}

export interface LayoutConfig {
  templateId: string
}
