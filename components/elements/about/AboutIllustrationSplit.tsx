import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function AboutIllustrationSplit({
  portfolioData,
  layoutConfig,
}: Props) {
  const content = layoutConfig.content;
  const bio = content?.rewrittenBio ?? portfolioData.personal?.bio ?? "";
  const subtitle = (content as { aboutSubtitle?: string })?.aboutSubtitle ?? "";

  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ background: "#F0EDE8" }}
    >
      <div className="max-w-5xl mx-auto rounded-[24px] p-10 md:p-14 bg-white flex flex-col md:flex-row gap-12 md:gap-16">
        <div className="w-full md:w-1/2">
          <div
            className="aspect-square max-w-[300px] rounded-[20px] overflow-hidden"
            style={{ background: "#F5F0E8" }}
          />
        </div>
        <div className="w-full md:w-1/2">
          <h2
            className="text-3xl md:text-[36px] font-extrabold"
            style={{ fontFamily: "Cabinet Grotesk, sans-serif", color: "var(--color-text)" }}
          >
            A Bit About Me
          </h2>
          {subtitle && (
            <p className="text-lg mt-2 italic" style={{ color: "var(--color-textMuted)" }}>
              ({subtitle})
            </p>
          )}
          <div className="mt-6 space-y-4 text-base" style={{ color: "var(--color-text)" }}>
            {bio.split(/\n\n/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <a
            href="#contact"
            className="inline-block mt-8 rounded-[50px] px-6 py-3 font-medium text-white"
            style={{ background: "var(--color-text)" }}
          >
            Contact me &gt;
          </a>
        </div>
      </div>
    </section>
  );
}
