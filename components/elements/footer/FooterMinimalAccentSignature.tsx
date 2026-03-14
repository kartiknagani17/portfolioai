import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function FooterMinimalAccentSignature({
  portfolioData,
}: Props) {
  const { personal } = portfolioData;
  const fullName = personal?.fullName ?? "Portfolio";
  const year = new Date().getFullYear();
  const links = [
    personal?.linkedinUrl && { label: "LinkedIn", href: personal.linkedinUrl },
    personal?.githubUrl && { label: "GitHub", href: personal.githubUrl },
    personal?.websiteUrl && { label: "Website", href: personal.websiteUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer
      className="py-5 px-6 md:px-8 border-t flex flex-col md:flex-row md:items-center justify-between gap-4"
      style={{ borderColor: "#D0D0D0", fontFamily: "DM Sans, sans-serif" }}
    >
      <p className="text-[13px] font-normal" style={{ color: "#4040A0" }}>
        {fullName} — {year}
      </p>
      <div className="flex flex-wrap gap-4 text-sm font-normal" style={{ color: "var(--color-text)" }}>
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {l.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
