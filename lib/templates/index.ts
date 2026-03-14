import dynamic from "next/dynamic"

// ─── Template component registry ─────────────────────────────────────────────
// Add new templates here as they are built.

export const TEMPLATE_COMPONENTS: Record<string, any> = {
  "template-1": dynamic(() => import("@/components/templates/Template1")),
  "template-2": dynamic(() => import("@/components/templates/Template2")),
  "template-3": dynamic(() => import("@/components/templates/Template3")),
  "template-meridian": dynamic(() => import("@/components/templates/TemplateMeridian")),
  "template-the-current": dynamic(() => import("@/components/templates/TemplateTheCurrent")),
  "template-canvas": dynamic(() => import("@/components/templates/TemplateCanvas")),
  "template-depth": dynamic(() => import("@/components/templates/TemplateDepth")),
  "template-axiom": dynamic(() => import("@/components/templates/TemplateAxiom")),
  "template-the-atlas": dynamic(() => import("@/components/templates/TemplateTheAtlas")),
  "template-pulse": dynamic(() => import("@/components/templates/TemplatePulse")),
}

export function pickTemplate(_portfolioData: any): string {
  return "template-1"
}

export function getTemplateComponent(templateId: string) {
  return TEMPLATE_COMPONENTS[templateId] || TEMPLATE_COMPONENTS["template-1"]
}
