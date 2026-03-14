export const COLOR_PALETTES: Record<string, any> = {
  'palette-orange-noir': {
    name: 'Orange Noir',
    mood: ['warm', 'bold', 'approachable', 'modern'],
    industry_fit: ['design', 'creative'],
    colors: {
      background: '#FFFFFF',
      backgroundAlt: '#F2F4F7',
      surface: '#FFFFFF',
      surfaceDark: '#1C1C1C',
      surfaceDarkElevated: '#2A2A2A',
      text: '#1A2332',
      textOnDark: '#FFFFFF',
      textMuted: '#6B7A8D',
      textMutedOnDark: '#A0A8B4',
      accent: '#F47B2B',
      accentHover: '#E06820',
      border: '#E8ECF0',
      borderDark: '#333333',
    }
  },
  'palette-cream-noir': {
    name: 'Cream Noir',
    mood: ['minimal', 'confident', 'understated', 'warm'],
    industry_fit: ['software', 'design', 'business'],
    colors: {
      background: '#F0EDE8',
      backgroundAlt: '#E8E4DE',
      surface: '#FFFFFF',
      surfaceDark: '#1A1A1A',
      text: '#1A1A1A',
      textMuted: '#888888',
      accent: '#E8442A',
      border: '#E0DDD8',
      navBackground: '#FFFFFF',
    }
  },
  'palette-void-gradient': {
    name: 'Void Gradient',
    mood: ['dark', 'dramatic', 'premium', 'bold'],
    industry_fit: ['software', 'creative'],
    colors: {
      background: '#141414',
      backgroundAlt: '#1A1A1A',
      surface: '#1E1E1E',
      text: '#FFFFFF',
      textSecondary: '#E0E0E0',
      textMuted: '#888888',
      accentGradientFrom: '#FF6B6B',
      accentGradientMid: '#FF4E8A',
      accentGradientTo: '#8B5CF6',
      accentFlat: '#FF6B6B',
      border: '#2A2A2A',
    }
  },
  'palette-white-geometric': {
    name: 'White Geometric',
    mood: ['minimal', 'playful', 'creative', 'editorial'],
    industry_fit: ['design', 'creative'],
    colors: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textMuted: '#888888',
      accent: '#1A1A1A',
      border: '#E8E8E8',
      testimonialBorder: '#F5C842',
      submitButton: '#1A1A1A',
    },
    geometricPalette: {
      teal: '#2D9B83',
      lavender: '#B8A9D9',
      yellow: '#F5C842',
      pink: '#F472B6',
      orange: '#F5A623',
      periwinkle: '#6B7AE8',
    }
  },
  'palette-green-energy': {
    name: 'Green Energy',
    mood: ['vibrant', 'energetic', 'professional', 'modern'],
    industry_fit: ['design', 'creative', 'business'],
    colors: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textMuted: '#666666',
      accent: '#22C55E',
      accentHover: '#16A34A',
      accentLight: '#DCFCE7',
      border: '#E5E7EB',
      pillBorder: '#22C55E',
      pillText: '#22C55E',
      dotColors: ['#22C55E', '#EF4444', '#3B82F6', '#EAB308', '#1A1A1A'],
    }
  },
  'palette-grey-silence': {
    name: 'Grey Silence',
    mood: ['minimal', 'artistic', 'intellectual', 'gallery'],
    industry_fit: ['creative', 'design', 'academia'],
    colors: {
      background: '#EFEFEF',
      surface: '#EFEFEF',
      surfaceWhite: '#FFFFFF',
      text: '#1A1A1A',
      textMuted: '#888888',
      accent: 'none',
      footerAccent: '#4040A0',
      border: '#D0D0D0',
      rule: '#D8D8D8',
    }
  },
}

export const TYPOGRAPHY_PAIRINGS: Record<string, any> = {
  'type-poppins-inter': {
    name: 'Poppins + Inter',
    heading_font: 'Poppins',
    body_font: 'Inter',
    industry_fit: ['design', 'creative', 'business'],
    google_fonts_import: 'https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;500&display=swap',
  },
  'type-cabinet-inter': {
    name: 'Cabinet Grotesk + Inter',
    heading_font: 'Cabinet Grotesk',
    body_font: 'Inter',
    industry_fit: ['software', 'design'],
    google_fonts_import: 'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,900&f[]=inter@400,500&display=swap',
    fallback: '"Sora", "Plus Jakarta Sans", sans-serif',
  },
  'type-space-grotesk-inter': {
    name: 'Space Grotesk + Inter',
    heading_font: 'Space Grotesk',
    body_font: 'Inter',
    industry_fit: ['software', 'creative'],
    google_fonts_import: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Inter:wght@400;500&family=Dancing+Script:wght@700&display=swap',
  },
  'type-inter-black': {
    name: 'Inter Black',
    heading_font: 'Inter',
    body_font: 'Inter',
    industry_fit: ['design', 'creative', 'business'],
    google_fonts_import: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap',
  },
  'type-plus-jakarta-sans': {
    name: 'Plus Jakarta Sans',
    heading_font: 'Plus Jakarta Sans',
    body_font: 'Plus Jakarta Sans',
    industry_fit: ['design', 'creative', 'business'],
    google_fonts_import: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap',
  },
  'type-matter-light': {
    name: 'DM Sans Light',
    heading_font: 'DM Sans',
    body_font: 'DM Sans',
    industry_fit: ['creative', 'design', 'academia'],
    google_fonts_import: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;700&display=swap',
  },
}

export const ELEMENT_LIBRARY = [
  // ─── NAVIGATION ──────────────────────────────────────────────────────────
  {
    id: 'nav-pill-centered',
    category: 'navigation',
    tags: {
      industries: ['design', 'creative'],
      goals: ['freelance_clients', 'get_hired'],
      personalityFit: ['bold', 'modern', 'approachable'],
      dataRequirements: [],
      pairsWellWith: ['palette-orange-noir'],
      conflictsWith: ['palette-void-gradient', 'palette-grey-silence'],
    }
  },
  {
    id: 'nav-float-minimal-pill',
    category: 'navigation',
    tags: {
      industries: ['software', 'design', 'business'],
      goals: ['get_hired', 'freelance_clients', 'showcase_projects'],
      personalityFit: ['minimal', 'clean', 'confident'],
      dataRequirements: [],
      pairsWellWith: ['palette-cream-noir', 'palette-orange-noir'],
      conflictsWith: ['palette-void-gradient'],
    }
  },
  {
    id: 'nav-dark-transparent-script',
    category: 'navigation',
    tags: {
      industries: ['software', 'creative'],
      goals: ['get_hired', 'showcase_projects', 'thought_leadership'],
      personalityFit: ['dark', 'dramatic', 'personal-brand'],
      dataRequirements: [],
      pairsWellWith: ['palette-void-gradient'],
      conflictsWith: ['palette-cream-noir', 'palette-white-geometric'],
    }
  },
  {
    id: 'nav-white-ultraminimal',
    category: 'navigation',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'showcase_projects'],
      personalityFit: ['minimal', 'editorial', 'confident'],
      dataRequirements: [],
      pairsWellWith: ['palette-white-geometric'],
      conflictsWith: ['palette-void-gradient'],
    }
  },
  {
    id: 'nav-white-logo-pill-cv',
    category: 'navigation',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['get_hired', 'freelance_clients'],
      personalityFit: ['modern', 'professional', 'energetic'],
      dataRequirements: [],
      pairsWellWith: ['palette-green-energy'],
      conflictsWith: ['palette-void-gradient'],
    }
  },
  {
    id: 'nav-grey-bare-minimal',
    category: 'navigation',
    tags: {
      industries: ['creative', 'design', 'academia'],
      goals: ['showcase_projects', 'academic_applications'],
      personalityFit: ['minimal', 'intellectual', 'gallery'],
      dataRequirements: [],
      pairsWellWith: ['palette-grey-silence'],
      conflictsWith: ['palette-void-gradient', 'palette-green-energy'],
    }
  },

  // ─── HEROES ──────────────────────────────────────────────────────────────
  {
    id: 'hero-centered-photo-circle',
    category: 'hero',
    tags: {
      industries: ['design', 'creative'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: ['profile_photo'],
      personalityFit: ['warm', 'bold', 'approachable'],
      avoidIf: ['no_photo', 'academia', 'software'],
      pairsWellWith: ['palette-orange-noir'],
      conflictsWith: ['palette-void-gradient', 'palette-grey-silence'],
    }
  },
  {
    id: 'hero-statement-avatar-card',
    category: 'hero',
    tags: {
      industries: ['software', 'design'],
      goals: ['get_hired', 'showcase_projects', 'freelance_clients'],
      dataRequirements: [],
      personalityFit: ['confident', 'witty', 'minimal', 'bold'],
      avoidIf: ['academia'],
      pairsWellWith: ['palette-cream-noir'],
      conflictsWith: ['palette-void-gradient'],
    }
  },
  {
    id: 'hero-dark-gradient-avatar',
    category: 'hero',
    tags: {
      industries: ['software', 'creative'],
      goals: ['get_hired', 'showcase_projects', 'thought_leadership'],
      dataRequirements: [],
      personalityFit: ['dark', 'dramatic', 'bold'],
      avoidIf: ['academia'],
      pairsWellWith: ['palette-void-gradient'],
      conflictsWith: ['palette-cream-noir', 'palette-white-geometric'],
    }
  },
  {
    id: 'hero-editorial-geometric',
    category: 'hero',
    tags: {
      industries: ['design', 'creative'],
      goals: ['freelance_clients', 'showcase_projects'],
      dataRequirements: [],
      personalityFit: ['minimal', 'playful', 'creative', 'editorial'],
      avoidIf: ['software', 'academia'],
      pairsWellWith: ['palette-white-geometric'],
      conflictsWith: ['palette-void-gradient'],
    }
  },
  {
    id: 'hero-split-green-frame',
    category: 'hero',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: ['profile_photo'],
      personalityFit: ['vibrant', 'energetic', 'modern'],
      avoidIf: ['no_photo', 'academia'],
      pairsWellWith: ['palette-green-energy'],
      conflictsWith: ['palette-void-gradient'],
    }
  },
  {
    id: 'hero-grey-text-split',
    category: 'hero',
    tags: {
      industries: ['creative', 'design', 'academia'],
      goals: ['showcase_projects', 'academic_applications'],
      dataRequirements: [],
      personalityFit: ['minimal', 'intellectual', 'gallery'],
      avoidIf: ['business_formal'],
      pairsWellWith: ['palette-grey-silence'],
      conflictsWith: ['palette-void-gradient', 'palette-green-energy'],
    }
  },

  // ─── EXPERIENCE ──────────────────────────────────────────────────────────
  {
    id: 'experience-dashed-center-timeline',
    category: 'experience',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['get_hired', 'freelance_clients'],
      dataRequirements: ['experience'],
      personalityFit: ['clean', 'professional', 'structured'],
      pairsWellWith: ['palette-orange-noir'],
    }
  },
  {
    id: 'experience-logo-bullet-cards',
    category: 'experience',
    tags: {
      industries: ['software', 'business', 'design'],
      goals: ['get_hired'],
      dataRequirements: ['experience'],
      personalityFit: ['clean', 'comprehensive', 'professional'],
      pairsWellWith: ['palette-cream-noir'],
    }
  },
  {
    id: 'experience-logo-paragraph-dark',
    category: 'experience',
    tags: {
      industries: ['software', 'business', 'creative'],
      goals: ['get_hired'],
      dataRequirements: ['experience'],
      personalityFit: ['dark', 'clean', 'minimal', 'confident'],
      pairsWellWith: ['palette-void-gradient'],
    }
  },
  {
    id: 'experience-numbered-rule-list',
    category: 'experience',
    tags: {
      industries: ['creative', 'design', 'academia'],
      goals: ['showcase_projects', 'academic_applications'],
      dataRequirements: ['experience'],
      personalityFit: ['minimal', 'catalogue', 'intellectual'],
      pairsWellWith: ['palette-grey-silence'],
    }
  },

  // ─── PROJECTS ────────────────────────────────────────────────────────────
  {
    id: 'projects-screenshot-carousel',
    category: 'projects',
    tags: {
      industries: ['design', 'creative'],
      goals: ['freelance_clients', 'showcase_projects'],
      dataRequirements: ['projects'],
      personalityFit: ['visual', 'bold', 'modern'],
      pairsWellWith: ['palette-orange-noir'],
    }
  },
  {
    id: 'projects-dark-feature-cards',
    category: 'projects',
    tags: {
      industries: ['software', 'design'],
      goals: ['get_hired', 'showcase_projects'],
      dataRequirements: ['projects'],
      personalityFit: ['bold', 'technical', 'premium'],
      pairsWellWith: ['palette-cream-noir'],
    }
  },
  {
    id: 'projects-thumbnail-two-column',
    category: 'projects',
    tags: {
      industries: ['software', 'creative'],
      goals: ['showcase_projects', 'get_hired'],
      dataRequirements: ['projects'],
      personalityFit: ['dark', 'visual', 'bold'],
      pairsWellWith: ['palette-void-gradient'],
    }
  },
  {
    id: 'work-six-grid-square',
    category: 'projects',
    tags: {
      industries: ['design', 'creative'],
      goals: ['showcase_projects', 'freelance_clients'],
      dataRequirements: ['projects'],
      personalityFit: ['visual', 'editorial', 'minimal', 'gallery'],
      avoidIf: ['software', 'academia'],
      pairsWellWith: ['palette-white-geometric'],
    }
  },
  {
    id: 'projects-left-text-right-carousel',
    category: 'projects',
    tags: {
      industries: ['design', 'creative'],
      goals: ['showcase_projects', 'freelance_clients'],
      dataRequirements: ['projects'],
      personalityFit: ['vibrant', 'visual', 'agency', 'modern'],
      pairsWellWith: ['palette-green-energy'],
    }
  },
  {
    id: 'projects-numbered-rule-list',
    category: 'projects',
    tags: {
      industries: ['creative', 'design', 'academia'],
      goals: ['showcase_projects', 'academic_applications'],
      dataRequirements: ['projects'],
      personalityFit: ['minimal', 'gallery', 'catalogue'],
      pairsWellWith: ['palette-grey-silence'],
    }
  },

  // ─── SKILLS ──────────────────────────────────────────────────────────────
  {
    id: 'skills-category-table',
    category: 'skills',
    tags: {
      industries: ['software', 'academia'],
      goals: ['get_hired', 'showcase_projects'],
      dataRequirements: ['skills'],
      personalityFit: ['technical', 'structured', 'comprehensive', 'minimal'],
      avoidIf: ['design', 'creative'],
      pairsWellWith: ['palette-cream-noir'],
    }
  },
  {
    id: 'skills-tech-icon-strip',
    category: 'skills',
    tags: {
      industries: ['software', 'design'],
      goals: ['get_hired', 'showcase_projects'],
      dataRequirements: ['skills'],
      personalityFit: ['technical', 'visual', 'developer'],
      pairsWellWith: ['palette-void-gradient', 'palette-cream-noir'],
    }
  },
  {
    id: 'skills-label-value-pairs',
    category: 'skills',
    tags: {
      industries: ['creative', 'design', 'academia'],
      goals: ['showcase_projects', 'academic_applications'],
      dataRequirements: ['skills'],
      personalityFit: ['minimal', 'catalogue', 'intellectual'],
      pairsWellWith: ['palette-grey-silence'],
    }
  },
  {
    id: 'skills-split-icon-list',
    category: 'skills',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: ['skills'],
      personalityFit: ['modern', 'energetic', 'structured'],
      pairsWellWith: ['palette-green-energy'],
    }
  },
  {
    id: 'marquee-skills-ticker',
    category: 'skills',
    tags: {
      industries: ['design', 'creative', 'business'],
      dataRequirements: ['skills'],
      personalityFit: ['bold', 'energetic', 'modern'],
      pairsWellWith: ['palette-orange-noir'],
    }
  },

  // ─── TESTIMONIALS ────────────────────────────────────────────────────────
  {
    id: 'testimonials-dark-carousel-cards',
    category: 'testimonials',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients'],
      dataRequirements: ['testimonials'],
      personalityFit: ['bold', 'premium', 'social-proof'],
      pairsWellWith: ['palette-orange-noir'],
    }
  },
  {
    id: 'testimonials-light-four-grid',
    category: 'testimonials',
    tags: {
      industries: ['software', 'business', 'design'],
      goals: ['get_hired', 'freelance_clients'],
      dataRequirements: ['testimonials'],
      personalityFit: ['clean', 'social-proof', 'professional'],
      pairsWellWith: ['palette-cream-noir'],
    }
  },
  {
    id: 'testimonials-yellow-border-cards',
    category: 'testimonials',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: ['testimonials'],
      personalityFit: ['minimal', 'warm', 'editorial'],
      pairsWellWith: ['palette-white-geometric'],
    }
  },
  {
    id: 'testimonials-stars-row',
    category: 'testimonials',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: ['testimonials'],
      personalityFit: ['vibrant', 'professional', 'energetic'],
      pairsWellWith: ['palette-green-energy'],
    }
  },

  // ─── ABOUT / STATS ───────────────────────────────────────────────────────
  {
    id: 'stats-split-photo-card',
    category: 'about',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: ['profile_photo'],
      personalityFit: ['warm', 'confident', 'approachable'],
      pairsWellWith: ['palette-orange-noir'],
    }
  },
  {
    id: 'about-illustration-split',
    category: 'about',
    tags: {
      industries: ['software', 'creative'],
      goals: ['get_hired', 'freelance_clients'],
      dataRequirements: [],
      personalityFit: ['warm', 'human', 'approachable', 'witty'],
      pairsWellWith: ['palette-cream-noir'],
    }
  },
  {
    id: 'about-grey-split-photo',
    category: 'about',
    tags: {
      industries: ['creative', 'design', 'academia'],
      goals: ['showcase_projects', 'academic_applications'],
      dataRequirements: [],
      personalityFit: ['minimal', 'intellectual', 'artistic'],
      pairsWellWith: ['palette-grey-silence'],
    }
  },
  {
    id: 'stats-three-divider-bar',
    category: 'about',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: [],
      personalityFit: ['confident', 'results-focused', 'modern'],
      pairsWellWith: ['palette-green-energy', 'palette-orange-noir'],
    }
  },

  // ─── CONTACT ─────────────────────────────────────────────────────────────
  {
    id: 'contact-cta-email-inline',
    category: 'contact',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: ['email'],
      personalityFit: ['direct', 'approachable'],
      pairsWellWith: ['palette-orange-noir'],
    }
  },
  {
    id: 'contact-faq-split',
    category: 'contact',
    tags: {
      industries: ['software', 'business', 'design'],
      goals: ['get_hired', 'freelance_clients'],
      dataRequirements: ['email'],
      personalityFit: ['approachable', 'direct', 'thorough'],
      pairsWellWith: ['palette-cream-noir'],
    }
  },
  {
    id: 'contact-split-form',
    category: 'contact',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: ['email'],
      personalityFit: ['minimal', 'professional', 'direct'],
      pairsWellWith: ['palette-white-geometric'],
    }
  },
  {
    id: 'contact-info-blocks-form-grid',
    category: 'contact',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: ['email'],
      personalityFit: ['professional', 'complete', 'modern'],
      pairsWellWith: ['palette-green-energy'],
    }
  },
  {
    id: 'contact-footer-statement',
    category: 'contact',
    tags: {
      industries: ['creative', 'design', 'academia'],
      goals: ['showcase_projects', 'freelance_clients'],
      dataRequirements: ['email'],
      personalityFit: ['minimal', 'confident', 'intellectual'],
      pairsWellWith: ['palette-grey-silence'],
    }
  },
  {
    id: 'contact-dark-minimal-social',
    category: 'contact',
    tags: {
      industries: ['software', 'creative', 'design'],
      goals: ['get_hired', 'freelance_clients'],
      dataRequirements: ['email'],
      personalityFit: ['dark', 'minimal', 'personal-brand'],
      pairsWellWith: ['palette-void-gradient'],
    }
  },

  // ─── FOOTER ──────────────────────────────────────────────────────────────
  {
    id: 'footer-dark-four-column',
    category: 'footer',
    tags: {
      industries: ['design', 'creative', 'business', 'software'],
      dataRequirements: [],
      personalityFit: ['professional', 'complete'],
      pairsWellWith: ['palette-orange-noir'],
    }
  },
  {
    id: 'footer-minimal-accent-signature',
    category: 'footer',
    tags: {
      industries: ['creative', 'design', 'academia'],
      dataRequirements: [],
      personalityFit: ['minimal', 'artistic', 'intellectual'],
      pairsWellWith: ['palette-grey-silence'],
    }
  },

  // ─── SOCIAL PROOF ────────────────────────────────────────────────────────
  {
    id: 'logos-horizontal-divider-strip',
    category: 'social_proof',
    tags: {
      industries: ['design', 'creative', 'business'],
      goals: ['freelance_clients', 'get_hired'],
      dataRequirements: [],
      personalityFit: ['minimal', 'confident', 'editorial'],
      pairsWellWith: ['palette-white-geometric', 'palette-cream-noir'],
    }
  },

  // ─── SERVICES ────────────────────────────────────────────────────────────
  {
    id: 'services-dark-glassmorphism-carousel',
    category: 'services',
    tags: {
      industries: ['design', 'creative'],
      goals: ['freelance_clients'],
      dataRequirements: [],
      personalityFit: ['bold', 'modern', 'premium'],
      pairsWellWith: ['palette-orange-noir'],
    }
  },
  {
    id: 'services-three-column-illustration',
    category: 'services',
    tags: {
      industries: ['design', 'creative'],
      goals: ['freelance_clients'],
      dataRequirements: [],
      personalityFit: ['minimal', 'clean', 'editorial'],
      pairsWellWith: ['palette-white-geometric'],
    }
  },
]
