import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createClient } from "@/lib/supabase/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// gemini-2.0-flash: stable (not preview), production-ready, $0.10/$0.40 per 1M tokens
const MODEL = "gemini-2.5-flash"

// ── Rate limiting (keyed by subdomain; no auth) ───────────────────────────────
const editCounts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(subdomain: string): boolean {
  const limit = 50
  const now   = Date.now()
  const entry = editCounts.get(subdomain)
  if (!entry || entry.resetAt < now) {
    editCounts.set(subdomain, { count: 1, resetAt: now + 86_400_000 })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a portfolio editor assistant. You help freelancers improve their portfolio websites by editing their portfolio data JSON.

The user will describe what they want to change. You will make the requested changes and return the result.

CRITICAL RULES:
- Return ONLY a valid raw JSON object — no markdown, no backticks, no explanation, no preamble
- Always return the COMPLETE portfolio data, not just the changed parts
- Preserve all fields that were not mentioned — never delete data unless explicitly asked
- When rewriting copy, match the tone and style of the existing content
- When adding items, use realistic data that fits the person's background
- Never invent fake company names or client names unless asked
- Keep changes focused — don't rewrite everything when only one thing was asked for

WHAT YOU CAN EDIT:
personal.bio, personal.professionalTitle, personal.availability, personal.location,
personal.email, personal.phone, personal.linkedinUrl, personal.twitterUrl,
personal.instagramUrl, personal.websiteUrl, projects[], experience[], skills[],
testimonials[], awards[], clients[], services[], process[], stats[], education[]

RESPONSE FORMAT — return exactly this JSON object, nothing else:
{
  "updatedData": { ...complete portfolio data... },
  "summary": "One or two sentences describing what changed, written conversationally to the user",
  "changesMade": ["Short label of change 1", "Short label of change 2"]
}`

export async function POST(req: NextRequest) {
  try {
    const { message, portfolioData, subdomain } = await req.json()

    if (!message || !portfolioData || !subdomain) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    if (!checkRateLimit(subdomain)) {
      return NextResponse.json(
        { error: "Daily edit limit reached. Please try again tomorrow.", limitReached: true },
        { status: 429 }
      )
    }

    // ── Call Gemini 2.0 Flash ────────────────────────────────────────────────
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",  // forces clean JSON — no markdown fences
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    })

    const result   = await model.generateContent(
      `Current portfolio data:\n${JSON.stringify(portfolioData, null, 2)}\n\nUser request: ${message}`
    )
    const text = result.response.text()

    // ── Parse ────────────────────────────────────────────────────────────────
    let parsed: { updatedData: any; summary: string; changesMade: string[] }

    try {
      parsed = JSON.parse(text)
    } catch {
      console.error("Gemini unparseable response:", text.slice(0, 500))
      return NextResponse.json({ error: "Failed to parse AI response. Please try again." }, { status: 500 })
    }

    if (!parsed.updatedData) {
      return NextResponse.json({ error: "Invalid AI response structure. Please try again." }, { status: 500 })
    }

    // ── Save to Supabase (no user_id; update by subdomain only) ───────────────
    const { error: updateError } = await supabase
      .from("portfolios")
      .update({ portfolio_data: parsed.updatedData, updated_at: new Date().toISOString() })
      .eq("subdomain", subdomain)

    if (updateError) {
      console.error("Supabase update error:", updateError)
      return NextResponse.json({ error: "Failed to save changes" }, { status: 500 })
    }

    return NextResponse.json({
      updatedData: parsed.updatedData,
      summary:     parsed.summary     || "Done. Your portfolio has been updated.",
      changesMade: parsed.changesMade || [],
    })

  } catch (err: any) {
    if (err?.message?.includes("API_KEY_INVALID") || err?.message?.includes("API_KEY")) {
      return NextResponse.json({ error: "AI service configuration error. Contact support." }, { status: 500 })
    }
    if (err?.message?.includes("RESOURCE_EXHAUSTED") || err?.status === 429) {
      return NextResponse.json({ error: "AI service is busy. Please try again in a moment." }, { status: 503 })
    }
    console.error("Edit portfolio API error:", err)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
