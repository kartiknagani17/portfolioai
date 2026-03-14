import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { subdomain, templateId } = await req.json()
    if (!subdomain || !templateId) {
      return NextResponse.json({ error: "subdomain and templateId are required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from("portfolios")
      .update({
        template_id: templateId,
        layout_config: { templateId },
        updated_at: new Date().toISOString(),
      })
      .eq("subdomain", subdomain)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("update-template error:", err)
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}
