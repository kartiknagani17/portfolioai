import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import ConfettiDots from "@/components/elements/decoration/ConfettiDots";
import DotGridCorner from "@/components/elements/decoration/DotGridCorner";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function HeroSplitGreenFrame({
  portfolioData,
  layoutConfig,
}: Props) {
  const { personal } = portfolioData;
  const content = layoutConfig.content;
  const headline = content?.heroHeadline ?? personal?.fullName ?? "";
  const body = content?.heroSubline ?? personal?.bio ?? "";
  const dotColors = ["#22C55E", "#EF4444", "#3B82F6", "#EAB308", "#1A1A1A"];

  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-white relative overflow-hidden">
      <ConfettiDots dotColors={dotColors} />
      <DotGridCorner corner="top-left" color="#22C55E" />
      <DotGridCorner corner="bottom-right" color="#22C55E" />

      {/* Left column */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-16">
        <div
          className="rounded-[50px] px-4 py-2 text-sm font-medium w-fit mb-6"
          style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}
        >
          Hello
        </div>
        <h1
          className="text-3xl md:text-5xl font-bold leading-tight"
          style={{ color: "var(--color-text, #1A1A1A)" }}
        >
          {headline}
        </h1>
        <p className="text-base mt-6 max-w-md" style={{ color: "var(--color-textMuted)" }}>
          {body}
        </p>
        <div className="flex flex-wrap gap-4 mt-8">
          <a
            href="#contact"
            className="rounded-[50px] px-6 py-3 font-medium text-white"
            style={{ background: "#22C55E" }}
          >
            Contact Me
          </a>
          <a
            href="#projects"
            className="text-[#22C55E] font-medium underline"
          >
            View Portfolio ↗
          </a>
        </div>
      </div>

      {/* Right column - layered photo */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-8 md:p-12">
        <div
          className="absolute w-[280px] h-[340px] md:w-[320px] md:h-[380px]"
          style={{ background: "#22C55E" }}
        />
        {personal?.profilePhotoUrl ? (
          <img
            src={personal.profilePhotoUrl}
            alt={personal.fullName}
            className="relative w-[280px] h-[340px] md:w-[320px] md:h-[380px] object-cover border-[3px] border-[#1A1A1A] z-10"
            style={{ marginRight: 20, marginTop: -20 }}
          />
        ) : (
          <div
            className="relative w-[280px] h-[340px] md:w-[320px] md:h-[380px] bg-[#1A1A1A] flex items-center justify-center text-white text-4xl font-bold z-10"
            style={{ marginRight: 20, marginTop: -20, border: "3px solid #1A1A1A" }}
          >
            {personal?.fullName?.slice(0, 2).toUpperCase() ?? "ME"}
          </div>
        )}
      </div>
    </section>
  );
}
