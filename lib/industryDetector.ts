export type Industry =
  | "design"
  | "software"
  | "business"
  | "creative"
  | "academia"
  | "general"

interface DetectionResult {
  industry: Industry
  confidence: number
  signals: string[]
}

const INDUSTRY_SIGNALS: Record<Industry, string[]> = {
  design: [
    "graphic designer", "art director", "brand designer", "visual designer",
    "ui designer", "ux designer", "product designer", "motion designer",
    "illustrator", "photographer", "creative director", "animator",
    "filmmaker", "architect", "interior designer", "fashion designer",
    "figma", "adobe", "illustrator", "photoshop", "indesign", "after effects",
    "cinema 4d", "sketch", "branding", "editorial", "typography",
    "visual identity", "brand identity", "print", "packaging",
  ],
  software: [
    "software engineer", "developer", "frontend", "backend", "fullstack",
    "full-stack", "full stack", "devops", "data engineer", "ml engineer",
    "machine learning", "data scientist", "cloud engineer", "sre",
    "react", "node", "python", "java", "typescript", "javascript",
    "golang", "rust", "kubernetes", "docker", "aws", "gcp", "azure",
    "api", "database", "postgresql", "mongodb", "redis",
  ],
  business: [
    "product manager", "project manager", "business analyst", "consultant",
    "strategy", "marketing manager", "growth", "sales", "account manager",
    "operations", "hr", "recruiter", "finance", "accountant",
    "lawyer", "legal", "attorney", "cfo", "coo", "vp", "director",
    "executive", "chief", "head of", "scrum master", "agile",
  ],
  creative: [
    "photographer", "videographer", "filmmaker", "video editor",
    "music producer", "sound designer", "writer", "copywriter",
    "content creator", "journalist", "editor", "illustrator",
    "3d artist", "concept artist", "game designer", "vfx",
    "copy writer", "content writer", "freelance writer",
    "brand voice", "email copy", "landing page copy", "ux copy",
    "content strategist", "blogger",
  ],
  academia: [
    "researcher", "professor", "phd", "postdoc", "lecturer",
    "scientist", "biologist", "chemist", "physicist", "engineer",
    "research associate", "lab", "university", "academic",
    "publications", "thesis", "dissertation",
  ],
  general: [],
}

export function detectIndustry(portfolioData: any): DetectionResult {
  const fields = [
    portfolioData?.personal?.professionalTitle || "",
    portfolioData?.personal?.bio || "",
    ...(portfolioData?.skills || []).map((s: any) => s.name),
    ...(portfolioData?.experience || []).map((e: any) =>
      `${e.roleTitle} ${e.companyName} ${e.description}`
    ),
  ]
  const allText = fields.join(" ").toLowerCase()

  const scores: Record<Industry, number> = {
    design: 0,
    software: 0,
    business: 0,
    creative: 0,
    academia: 0,
    general: 0,
  }

  const matchedSignals: Record<Industry, string[]> = {
    design: [],
    software: [],
    business: [],
    creative: [],
    academia: [],
    general: [],
  }

  for (const [industry, signals] of Object.entries(INDUSTRY_SIGNALS)) {
    for (const signal of signals) {
      if (allText.includes(signal)) {
        scores[industry as Industry]++
        matchedSignals[industry as Industry].push(signal)
      }
    }
  }

  // Title gets 3x weight — most reliable signal
  const title = (portfolioData?.personal?.professionalTitle || "").toLowerCase()
  for (const [industry, signals] of Object.entries(INDUSTRY_SIGNALS)) {
    for (const signal of signals) {
      if (title.includes(signal)) {
        scores[industry as Industry] += 3
      }
    }
  }

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)
  const topIndustry = sorted[0][0] as Industry
  const topScore = sorted[0][1]
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const confidence = totalScore > 0 ? topScore / totalScore : 0

  return {
    industry: topScore > 0 ? topIndustry : "general",
    confidence,
    signals: matchedSignals[topIndustry],
  }
}
