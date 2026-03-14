import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function HeroDarkGradientAvatar({
  portfolioData,
  layoutConfig,
}: Props) {
  const { personal } = portfolioData;
  const content = layoutConfig.content;
  const headline = content?.heroHeadline ?? personal?.fullName ?? "";
  const body = content?.heroSubline ?? personal?.bio ?? personal?.professionalTitle ?? "";

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "#141414" }}
    >
      {/* Avatar with gradient and glow */}
      <div
        className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 40% 30%, #FF6B6B, #FF4E8A 50%, #8B5CF6)",
          boxShadow:
            "0 0 60px rgba(139,92,246,0.3), 0 0 120px rgba(255,78,138,0.15)",
        }}
      >
        {personal?.profilePhotoUrl ? (
          <img
            src={personal.profilePhotoUrl}
            alt={personal.fullName}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-4xl font-bold text-white">
            {personal?.fullName?.slice(0, 2).toUpperCase() ?? "ME"}
          </span>
        )}
      </div>

      {/* Headline with gradient on last phrase */}
      <h1
        className="text-4xl md:text-5xl lg:text-[60px] font-extrabold text-center text-white mt-8 max-w-3xl"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        {headline}
      </h1>

      {/* Body */}
      <p
        className="text-base text-center mt-6 max-w-[580px]"
        style={{
          color: "rgba(255,255,255,0.7)",
          fontFamily: "Inter, sans-serif",
          lineHeight: 1.6,
        }}
      >
        {body}
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
        <a
          href="#contact"
          className="rounded-[50px] px-9 py-4 font-medium bg-white text-[#141414] transition-opacity hover:opacity-90"
        >
          Get In Touch
        </a>
        <a
          href="#resume"
          className="rounded-[50px] px-9 py-4 font-medium border-2 border-white text-white bg-transparent transition-opacity hover:opacity-90"
        >
          Download CV
        </a>
      </div>
    </section>
  );
}
