import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const LOG = "[PortfolioAI]";

function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");
  return createClient(url, key);
}

function generateSubdomain(fullName: string): string {
  return fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}

async function getUniqueSubdomain(base: string, supabase: SupabaseClient): Promise<string> {
  let subdomain = base;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("portfolios")
      .select("id")
      .eq("subdomain", subdomain)
      .single();

    if (!data) return subdomain;

    counter++;
    subdomain = `${base}-${counter}`;
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { subdomain, status, userId } = await request.json()
    const updates: Record<string, string> = {}
    if (status)  updates.status  = status
    if (userId)  updates.user_id = userId
    if (Object.keys(updates).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    const { error } = await supabase.from("portfolios").update(updates).eq("subdomain", subdomain)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { portfolioData, layoutConfig, userId } = await request.json();

    const baseName = portfolioData?.personal?.fullName || "portfolio";
    console.log(`${LOG} portfolios: start`, { baseName, templateId: layoutConfig?.templateId });
    const baseSubdomain = generateSubdomain(baseName);
    const subdomain = await getUniqueSubdomain(baseSubdomain, supabase);
    console.log(`${LOG} portfolios: subdomain reserved`, { subdomain });

    const insertPayload: Record<string, unknown> = {
      subdomain,
      portfolio_data: portfolioData,
      layout_config: layoutConfig,
      template_id: layoutConfig?.templateId || "template-1",
    };
    if (userId) insertPayload.user_id = userId;

    let result = await supabase
      .from("portfolios")
      .insert(insertPayload)
      .select("id, subdomain")
      .single();

    // If user_id column doesn't exist yet (migration not run), retry without it
    if (result.error && result.error.message?.includes("user_id")) {
      console.warn(`${LOG} portfolios: user_id column missing, inserting without it`);
      const { user_id: _dropped, ...payloadWithoutUserId } = insertPayload;
      result = await supabase
        .from("portfolios")
        .insert(payloadWithoutUserId)
        .select("id, subdomain")
        .single();
    }

    const { data, error } = result;
    if (error) {
      console.error(`${LOG} portfolios: Supabase insert error`, error);
      throw error;
    }

    console.log(`${LOG} portfolios: success`, { id: data.id, subdomain: data.subdomain });
    return NextResponse.json({ id: data.id, subdomain: data.subdomain });
  } catch (error: unknown) {
    console.error(`${LOG} portfolios error:`, error);
    const msg =
      error instanceof Error
        ? error.message
        : (error as any)?.message ?? JSON.stringify(error) ?? "Failed to create portfolio";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
