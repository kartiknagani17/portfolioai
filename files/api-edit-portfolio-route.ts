import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// ── Rate limiting — simple in-memory store ────────────────────────────────────
// In production replace with Redis or Upstash
const editCounts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(subdomain: string, isPro: boolean): boolean {
  const limit = isPro ? 999 : 10   // free: 10/day, pro: unlimited
  const now   = Date.now()
  const entry = editCounts.get(subdomain)

  if (!entry || entry.resetAt < now) {
    editCounts.set(subdomain, { count: 1, resetAt: now + 86400000 }) // reset in 24h
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a portfolio editor assistant. You help freelancers improve their portfolio websites by editing their portfolio data.

The user will describe what they want to change. You will:
1. Make the requested changes to the portfolio data JSON
2. Return the complete updated JSON
3. Provide a brief human-friendly summary of what you changed
4. List specific fields that were changed

CRITICAL RULES:
- Return ONLY valid JSON in the "updatedData" field — no markdown, no backticks, no explanation inside the JSON
- Always return the COMPLETE portfolio data, not just the changed parts
- Preserve all fields that were not mentioned — never delete data unless explicitly asked
- When rewriting copy, match the tone and style of the existing content
- When adding items (projects, testimonials, etc.), use realistic placeholder data that fits the person's background
- Never invent fake company names or client names — use generic descriptions if needed
- Keep changes focused and precise — don't make sweeping changes when only one thing was asked for

WHAT YOU CAN EDIT:
- personal.bio, personal.professionalTitle, personal.availability, personal.location
- personal.email, personal.phone, personal.linkedinUrl, personal.twitterUrl, personal.instagramUrl, personal.websiteUrl
- projects[] — add, remove, reorder, or edit any project fields
- experience[] — add, remove, reorder, or edit any experience fields
- skills[] — add or remove skills
- testimonials[] — add, remove, or edit testimonials
- awards[] — add or remove awards
- clients[] — add or remove client names
- services[] — add, remove, or edit services
- process[] — edit process steps
- stats[] — edit stat values and labels
- education[] — add or remove education entries

RESPONSE FORMAT — return exactly this JSON structure, nothing else:
{
  "updatedData": { ...complete portfolio data object... },
  "summary": "One or two sentences describing what was changed, written conversationally",
  "changesMade": ["field1 updated", "field2 added", "field3 reordered"]
}`

export async function POST(req: NextRequest) {
  try {
    const { message, portfolioData, subdomain } = await req.json()

    if (!message || !portfolioData || !subdomain) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // ── Auth check ───────────────────────────────────────────────────────────
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ── Verify portfolio belongs to user ─────────────────────────────────────
    const { data: portfolio } = await supabase
      .from("portfolios")
      .select("subdomain, user_id")
      .eq("subdomain", subdomain)
      .eq("user_id", user.id)
      .single()

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // ── Check pro status for rate limiting ───────────────────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single()

    const isPro = profile?.plan === "pro" || profile?.plan === "business"

    // ── Rate limit ───────────────────────────────────────────────────────────
    if (!checkRateLimit(subdomain, isPro)) {
      return NextResponse.json({
        error: "Daily edit limit reached. Upgrade to Pro for unlimited edits.",
        limitReached: true,
      }, { status: 429 })
    }

    // ── Call Claude ──────────────────────────────────────────────────────────
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here is the current portfolio data:

\`\`\`json
${JSON.stringify(portfolioData, null, 2)}
\`\`\`

User request: ${message}

Return the complete updated portfolio data as JSON following the exact response format specified.`,
        },
      ],
    })

    // ── Parse response ───────────────────────────────────────────────────────
    const text = response.content[0].type === "text" ? response.content[0].text : ""

    let parsed: { updatedData: any; summary: string; changesMade: string[] }

    try {
      // Strip any accidental markdown fences
      const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim()

      parsed = JSON.parse(cleaned)
    } catch {
      console.error("Claude returned unparseable JSON:", text.slice(0, 500))
      return NextResponse.json({ error: "Failed to parse response. Please try again." }, { status: 500 })
    }

    if (!parsed.updatedData) {
      return NextResponse.json({ error: "Invalid response structure" }, { status: 500 })
    }

    // ── Save updated data to Supabase ────────────────────────────────────────
    const { error: updateError } = await supabase
      .from("portfolios")
      .update({
        portfolio_data: parsed.updatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("subdomain", subdomain)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Supabase update error:", updateError)
      return NextResponse.json({ error: "Failed to save changes" }, { status: 500 })
    }

    // ── Return response ──────────────────────────────────────────────────────
    return NextResponse.json({
      updatedData:  parsed.updatedData,
      summary:      parsed.summary      || "Done. Your portfolio has been updated.",
      changesMade:  parsed.changesMade  || [],
    })

  } catch (err) {
    console.error("Edit portfolio API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
