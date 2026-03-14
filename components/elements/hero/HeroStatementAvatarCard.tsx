import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function HeroStatementAvatarCard({
  portfolioData,
  layoutConfig,
}: Props) {
  const { personal } = portfolioData;
  const content = layoutConfig.content;
  const fullName = personal?.fullName ?? "";
  const headline = content?.heroHeadline ?? `${fullName} — ready to create.`;
  const subline = content?.heroSubline ?? personal?.bio?.split(".")[0] ?? "";

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-[#F0EDE8]"
      style={{
        background: "#F0EDE8",
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Avatar card */}
      <div
        className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-2xl border flex items-center justify-center overflow-hidden shrink-0"
        style={{
          background: "#FAF8F4",
          borderColor: "#E8E4DE",
        }}
      >
        {personal?.profilePhotoUrl ? (
          <img
            src={personal.profilePhotoUrl}
            alt={fullName}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span
            className="text-2xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            {fullName.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name badge */}
      <div className="flex items-center gap-2 mt-4 rounded-[50px] bg-white px-4 py-2">
        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
        <span className="text-sm" style={{ color: "var(--color-text)" }}>
          Hey! I&apos;m {fullName}
        </span>
      </div>

      {/* Headline - bold statement */}
      <h1
        className="text-2xl md:text-4xl lg:text-5xl font-black text-center mt-6 max-w-3xl"
        style={{ color: "var(--color-text, #1A1A1A)" }}
      >
        {headline}
      </h1>

      {/* Subline */}
      <p
        className="text-base text-center mt-4 max-w-[440px]"
        style={{ color: "var(--color-textMuted)", fontFamily: "Inter, sans-serif" }}
      >
        {subline}
      </p>

      {/* CTA */}
      <a
        href="#contact"
        className="mt-8 rounded-[50px] px-8 py-4 font-medium text-white transition-opacity hover:opacity-90"
        style={{ background: "#1A1A1A" }}
      >
        Contact me &gt;
      </a>
    </section>
  );
}
