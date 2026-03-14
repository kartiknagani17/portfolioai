import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { getTemplateComponent } from "@/lib/templates";

const LOG = "[PortfolioAI]";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");
  return createClient(url, key);
}

export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { subdomain } = await params;
  const sp = await searchParams;
  console.log(`${LOG} portfolio-page: fetch`, { subdomain });
  const supabase = getSupabase();

  const { data: portfolio, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("subdomain", subdomain)
    .single();

  if (error) {
    console.error(`${LOG} portfolio-page: Supabase error`, { subdomain, error: error.message });
  }
  if (!portfolio) {
    console.warn(`${LOG} portfolio-page: not found`, { subdomain });
    notFound();
  }

  const templateId =
    (typeof sp?.template === "string" ? sp.template : undefined) ||
    portfolio.template_id ||
    portfolio.layout_config?.templateId ||
    "template-3";

  const isPreview = sp?.preview === "true"
  const accentColor = (typeof sp?.accent === "string" ? sp.accent : undefined) || portfolio.accent_color || "#FF3B00"

  console.log(`${LOG} portfolio-page: render`, { subdomain, templateId, isPreview });
  const TemplateComponent = getTemplateComponent(templateId);

  return (
    <>
      {isPreview && (
        <style>{`
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden;
          }
        `}</style>
      )}
      <TemplateComponent portfolioData={portfolio.portfolio_data} />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;
  const supabase = getSupabase();

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("portfolio_data")
    .eq("subdomain", subdomain)
    .single();

  if (!portfolio) return { title: "Portfolio" };

  const personal = portfolio.portfolio_data?.personal ?? {};
  const fullName = personal.fullName ?? "Portfolio";
  const professionalTitle = personal.professionalTitle ?? "";
  const bio = personal.bio ?? "";

  return {
    title: `${fullName} — ${professionalTitle}`,
    description: bio,
  };
}
