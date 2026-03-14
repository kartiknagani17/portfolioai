import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function HeroGreyTextSplit({
  portfolioData,
  layoutConfig,
}: Props) {
  const { personal } = portfolioData;
  const content = layoutConfig.content;
  const fullName = personal?.fullName ?? "";
  const title = personal?.professionalTitle ?? "";
  const subline = content?.heroSubline ?? personal?.bio ?? "";

  return (
    <section
      className="py-20 md:py-24 px-4 md:px-12"
      style={{ background: "#EFEFEF", padding: "80px 0 60px" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16">
        <div className="md:col-span-2">
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{
              fontFamily: "DM Sans, sans-serif",
              color: "var(--color-text, #1A1A1A)",
              lineHeight: 1.1,
            }}
          >
            Hello, I&apos;m {fullName}, {title}.
          </h1>
          <div
            className="text-xl mt-10"
            style={{ color: "var(--color-textMuted)" }}
          >
            ↓
          </div>
        </div>
        <div className="md:col-span-3">
          <p
            className="text-base leading-relaxed"
            style={{
              fontFamily: "DM Sans, sans-serif",
              color: "#888888",
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            {subline}
          </p>
        </div>
      </div>
    </section>
  );
}
