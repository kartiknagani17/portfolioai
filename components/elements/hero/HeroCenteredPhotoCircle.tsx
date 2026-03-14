"use client";

import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function HeroCenteredPhotoCircle({
  portfolioData,
  layoutConfig,
}: Props) {
  const { personal } = portfolioData;
  const content = layoutConfig.content;
  const fullName = personal?.fullName ?? "";
  const title = personal?.professionalTitle ?? "";
  const experienceYears =
    portfolioData.experience?.length ?? 0;

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative bg-white"
      style={{ background: "#fff" }}
    >
      {/* Greeting pill */}
      <div
        className="rounded-[50px] border px-4 py-1.5 text-sm mb-6"
        style={{
          background: "#fff",
          borderColor: "#E8ECF0",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Hello! 👋
      </div>

      {/* Headline two lines */}
      <h1
        className="text-4xl md:text-6xl lg:text-[72px] font-extrabold text-center leading-tight mb-4"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        <span style={{ color: "var(--color-text, #1A1A1A)" }}>
          I&apos;m {fullName},
        </span>
        <br />
        <span style={{ color: "var(--color-accent)" }}>{title}</span>
      </h1>

      {/* Photo on accent circle */}
      <div className="relative my-8 w-[280px] h-[280px] md:w-[320px] md:h-[320px] lg:w-[420px] lg:h-[420px]">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "var(--color-accent)",
            opacity: 0.6,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {personal?.profilePhotoUrl ? (
            <img
              src={personal.profilePhotoUrl}
              alt={fullName}
              className="w-[90%] h-[90%] object-cover"
            />
          ) : (
            <div
              className="w-[90%] h-[90%] rounded-full flex items-center justify-center text-4xl font-bold text-white"
              style={{ background: "var(--color-accent)" }}
            >
              {fullName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Left floating card - desktop only */}
        <div
          className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-[200px] p-4 rounded-lg border bg-white"
          style={{ borderColor: "#E8ECF0" }}
        >
          <span className="text-3xl text-[var(--color-accent)]">&ldquo;</span>
          <p className="text-sm mt-1" style={{ color: "var(--color-text)" }}>
            Great to work with.
          </p>
          <p className="text-xs mt-2 font-medium" style={{ color: "var(--color-textMuted)" }}>
            Highly Recommended
          </p>
        </div>

        {/* Right floating - desktop only */}
        <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 flex-col items-center">
          <div className="flex gap-0.5 text-[var(--color-accent)]">
            {"★".repeat(5)}
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--color-text)" }}>
            {experienceYears}+
          </p>
          <p className="text-xs" style={{ color: "var(--color-textMuted)" }}>
            Experience
          </p>
        </div>
      </div>

      {/* Mobile: show cards below */}
      <div className="lg:hidden flex flex-col items-center gap-4 my-6 max-w-[200px]">
        <div className="w-full p-4 rounded-lg border bg-white" style={{ borderColor: "#E8ECF0" }}>
          <span className="text-2xl text-[var(--color-accent)]">&ldquo;</span>
          <p className="text-sm">Highly Recommended</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex text-[var(--color-accent)]">{"★".repeat(5)}</div>
          <p className="text-2xl font-bold">{experienceYears}+ Experience</p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <a
          href="#projects"
          className="rounded-[50px] px-8 py-3 font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--color-accent)" }}
        >
          Portfolio ↗
        </a>
        <a
          href="#contact"
          className="rounded-[50px] px-8 py-3 font-medium border-2 transition-opacity hover:opacity-90"
          style={{ borderColor: "var(--color-text, #1A1A1A)", color: "var(--color-text)" }}
        >
          Hire me
        </a>
      </div>
    </section>
  );
}
