import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ContactFooterStatement({
  portfolioData,
  layoutConfig,
}: Props) {
  const content = layoutConfig.content;
  const statement = (content as { contactStatement?: string })?.contactStatement ?? "I am thrilled to answer to your next project →";
  const email = portfolioData.personal?.email ?? "";
  const websiteUrl = portfolioData.personal?.websiteUrl ?? "";

  return (
    <section
      className="py-16 md:py-24 px-6 md:px-8 border-t border-[var(--color-border)]"
      style={{ background: "#F0EDE8", padding: "60px 32px 40px" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[55%_45%] gap-12">
        <div>
          <a
            href={email ? `mailto:${email}` : "#"}
            className="text-2xl md:text-[28px] font-light hover:underline"
            style={{ fontFamily: "DM Sans, sans-serif", color: "var(--color-text)" }}
          >
            {statement}
          </a>
        </div>
        <div>
          {email && (
            <a href={`mailto:${email}`} className="block text-lg hover:underline" style={{ color: "var(--color-text)" }}>
              {email}
            </a>
          )}
          {websiteUrl && (
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-sm font-light underline" style={{ color: "var(--color-textMuted)" }}>
              View Resume
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
