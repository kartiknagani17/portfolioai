import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function LogosHorizontalDividerStrip({
  portfolioData,
}: Props) {
  const experience = portfolioData.experience ?? [];
  const companies = [...new Set(experience.map((e) => e.companyName))].slice(0, 6);
  if (companies.length === 0) return null;

  return (
    <section className="py-8 border-t border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-evenly gap-8">
        {companies.map((name, i) => (
          <span
            key={i}
            className="text-sm md:text-base font-medium opacity-70 hover:opacity-100 transition-opacity duration-200"
            style={{ color: "var(--color-text)", fontFamily: "Inter, sans-serif" }}
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
