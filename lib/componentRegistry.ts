// This file maps every element ID to its React component.
// Import each component as it is built and add it to the registry.
// The portfolio renderer uses this to load components dynamically by ID.

import dynamic from 'next/dynamic'

const registry: Record<string, any> = {
  // Navigation
  'nav-pill-centered': dynamic(() => import('@/components/elements/navigation/NavPillCentered')),
  'nav-float-minimal-pill': dynamic(() => import('@/components/elements/navigation/NavFloatMinimalPill')),
  'nav-dark-transparent-script': dynamic(() => import('@/components/elements/navigation/NavDarkTransparentScript')),
  'nav-white-ultraminimal': dynamic(() => import('@/components/elements/navigation/NavWhiteUltraMinimal')),
  'nav-white-logo-pill-cv': dynamic(() => import('@/components/elements/navigation/NavWhiteLogoPillCV')),
  'nav-grey-bare-minimal': dynamic(() => import('@/components/elements/navigation/NavGreyBareMinimal')),

  // Heroes
  'hero-centered-photo-circle': dynamic(() => import('@/components/elements/hero/HeroCenteredPhotoCircle')),
  'hero-statement-avatar-card': dynamic(() => import('@/components/elements/hero/HeroStatementAvatarCard')),
  'hero-dark-gradient-avatar': dynamic(() => import('@/components/elements/hero/HeroDarkGradientAvatar')),
  'hero-editorial-geometric': dynamic(() => import('@/components/elements/hero/HeroEditorialGeometric')),
  'hero-split-green-frame': dynamic(() => import('@/components/elements/hero/HeroSplitGreenFrame')),
  'hero-grey-text-split': dynamic(() => import('@/components/elements/hero/HeroGreyTextSplit')),

  // Experience
  'experience-dashed-center-timeline': dynamic(() => import('@/components/elements/experience/ExperienceDashedCenterTimeline')),
  'experience-logo-bullet-cards': dynamic(() => import('@/components/elements/experience/ExperienceLogoBulletCards')),
  'experience-logo-paragraph-dark': dynamic(() => import('@/components/elements/experience/ExperienceLogoParagraphDark')),
  'experience-numbered-rule-list': dynamic(() => import('@/components/elements/experience/ExperienceNumberedRuleList')),

  // Projects
  'projects-screenshot-carousel': dynamic(() => import('@/components/elements/projects/ProjectsScreenshotCarousel')),
  'projects-dark-feature-cards': dynamic(() => import('@/components/elements/projects/ProjectsDarkFeatureCards')),
  'projects-thumbnail-two-column': dynamic(() => import('@/components/elements/projects/ProjectsThumbnailTwoColumn')),
  'work-six-grid-square': dynamic(() => import('@/components/elements/projects/WorkSixGridSquare')),
  'projects-left-text-right-carousel': dynamic(() => import('@/components/elements/projects/ProjectsLeftTextRightCarousel')),
  'projects-numbered-rule-list': dynamic(() => import('@/components/elements/projects/ProjectsNumberedRuleList')),

  // Skills
  'skills-category-table': dynamic(() => import('@/components/elements/skills/SkillsCategoryTable')),
  'skills-tech-icon-strip': dynamic(() => import('@/components/elements/skills/SkillsTechIconStrip')),
  'skills-label-value-pairs': dynamic(() => import('@/components/elements/skills/SkillsLabelValuePairs')),
  'skills-split-icon-list': dynamic(() => import('@/components/elements/skills/SkillsSplitIconList')),
  'marquee-skills-ticker': dynamic(() => import('@/components/elements/skills/MarqueeSkillsTicker')),

  // Testimonials
  'testimonials-dark-carousel-cards': dynamic(() => import('@/components/elements/testimonials/TestimonialsDarkCarousel')),
  'testimonials-light-four-grid': dynamic(() => import('@/components/elements/testimonials/TestimonialsLightFourGrid')),
  'testimonials-yellow-border-cards': dynamic(() => import('@/components/elements/testimonials/TestimonialsYellowBorderCards')),
  'testimonials-stars-row': dynamic(() => import('@/components/elements/testimonials/TestimonialsStarsRow')),

  // About / Stats
  'stats-split-photo-card': dynamic(() => import('@/components/elements/about/StatsPhotoCard')),
  'about-illustration-split': dynamic(() => import('@/components/elements/about/AboutIllustrationSplit')),
  'about-grey-split-photo': dynamic(() => import('@/components/elements/about/AboutGreySplitPhoto')),
  'stats-three-divider-bar': dynamic(() => import('@/components/elements/about/StatsThreeDividerBar')),

  // Contact
  'contact-cta-email-inline': dynamic(() => import('@/components/elements/contact/ContactCTAEmailInline')),
  'contact-faq-split': dynamic(() => import('@/components/elements/contact/ContactFAQSplit')),
  'contact-split-form': dynamic(() => import('@/components/elements/contact/ContactSplitForm')),
  'contact-info-blocks-form-grid': dynamic(() => import('@/components/elements/contact/ContactInfoBlocksFormGrid')),
  'contact-footer-statement': dynamic(() => import('@/components/elements/contact/ContactFooterStatement')),
  'contact-dark-minimal-social': dynamic(() => import('@/components/elements/contact/ContactDarkMinimalSocial')),

  // Footer
  'footer-dark-four-column': dynamic(() => import('@/components/elements/footer/FooterDarkFourColumn')),
  'footer-minimal-accent-signature': dynamic(() => import('@/components/elements/footer/FooterMinimalAccentSignature')),

  // Social proof / Services
  'logos-horizontal-divider-strip': dynamic(() => import('@/components/elements/social_proof/LogosHorizontalDividerStrip')),
  'services-dark-glassmorphism-carousel': dynamic(() => import('@/components/elements/services/ServicesDarkGlassmorphismCarousel')),
  'services-three-column-illustration': dynamic(() => import('@/components/elements/services/ServicesThreeColumnIllustration')),
}

export function getComponent(elementId: string) {
  return registry[elementId] || null
}

export const COMPONENT_REGISTRY = registry
