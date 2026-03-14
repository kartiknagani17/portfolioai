// This route no longer calls Gemini at all.
// Industry detection and template selection is pure JS — instant.

import { NextRequest, NextResponse } from "next/server"
import { pickTemplate } from "@/lib/templates"

const LOG = "[PortfolioAI]"

export async function POST(request: NextRequest) {
  try {
    const { portfolioData } = await request.json()
    console.log(`${LOG} generate-layout-config: start`, { hasData: !!portfolioData, name: portfolioData?.personal?.fullName })
    const templateId = pickTemplate(portfolioData)
    console.log(`${LOG} generate-layout-config: success`, { templateId })
    return NextResponse.json({ templateId })
  } catch (error: unknown) {
    console.error(`${LOG} generate-layout-config error:`, error)
    return NextResponse.json({ templateId: "template-3" })
  }
}
