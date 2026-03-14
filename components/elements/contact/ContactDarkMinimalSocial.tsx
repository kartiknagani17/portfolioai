import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ContactDarkMinimalSocial({
  portfolioData,
  layoutConfig,
}: Props) {
  const content = layoutConfig.content;
  const bio = (content as { contactBio?: string })?.contactBio ?? portfolioData.personal?.bio ?? "";
  const email = portfolioData.personal?.email ?? "";
  const fullName = portfolioData.personal?.fullName ?? "";
  const linkedinUrl = portfolioData.personal?.linkedinUrl;
  const githubUrl = portfolioData.personal?.githubUrl;
  const websiteUrl = portfolioData.personal?.websiteUrl;

  return (
    <section
      className="py-20 md:py-24 px-4 max-w-[680px]"
      style={{ background: "#141414" }}
    >
      <h2
        className="text-[28px] font-bold text-white mb-6"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        Contact
      </h2>
      <p
        className="text-[15px] mb-8"
        style={{ color: "rgba(255,255,255,0.55)", fontFamily: "Inter, sans-serif" }}
      >
        {bio}
      </p>
      {email && (
        <a
          href={`mailto:${email}`}
          className="text-base font-medium text-white hover:opacity-90 transition-opacity"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {email}
        </a>
      )}
      <div className="flex gap-5 mt-8">
        {websiteUrl && (
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:scale-110 transition-all" aria-label="Website">
            <span className="text-white text-sm">Web</span>
          </a>
        )}
        {linkedinUrl && (
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:scale-110 transition-all" aria-label="LinkedIn">
            <span className="text-white text-sm">LinkedIn</span>
          </a>
        )}
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:scale-110 transition-all" aria-label="GitHub">
            <span className="text-white text-sm">GitHub</span>
          </a>
        )}
      </div>
      <p className="mt-16 text-[13px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Inter, sans-serif" }}>
        © {new Date().getFullYear()} {fullName}. All rights reserved.
      </p>
    </section>
  );
}
