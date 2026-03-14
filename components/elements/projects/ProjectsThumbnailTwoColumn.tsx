"use client";

import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ProjectsThumbnailTwoColumn({
  portfolioData,
}: Props) {
  const projects = portfolioData.projects ?? [];
  const display = projects.length > 6 ? projects.slice(0, 4) : projects;

  if (projects.length === 0) return null;

  const gridCols =
    projects.length === 1
      ? "grid-cols-1"
      : projects.length === 3
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2";

  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ background: "#141414" }}
    >
      <h2
        className="text-center mb-12 font-extrabold uppercase tracking-wider"
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          background: "linear-gradient(135deg, #FF6B6B, #FF4E8A, #8B5CF6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        PROJECTS
      </h2>
      <div className={`max-w-5xl mx-auto grid ${gridCols} gap-5`}>
        {display.map((proj, i) => (
          <a
            key={i}
            href={proj.liveUrl || proj.githubUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            style={{ background: "#1E1E1E" }}
          >
            <div className="h-60 overflow-hidden bg-[#2A2A2A]">
              {proj.imageUrl ? (
                <img
                  src={proj.imageUrl}
                  alt=""
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white/40"
                  style={{
                    background: "linear-gradient(135deg, #2A2A2A, #1E1E1E)",
                  }}
                >
                  {proj.projectName}
                </div>
              )}
            </div>
            <div className="p-4 md:p-5 flex items-center justify-between">
              <div>
                <p
                  className="text-[11px] uppercase"
                  style={{ color: "var(--color-textMuted)" }}
                >
                  CLICK HERE TO VISIT
                </p>
                <p
                  className="text-lg font-bold text-white mt-1"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {proj.projectName} ↗
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
      {projects.length > 6 && (
        <p className="text-center mt-8">
          <a
            href="#projects"
            className="font-medium"
            style={{
              background: "linear-gradient(135deg, #FF6B6B, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            View All →
          </a>
        </p>
      )}
    </section>
  );
}
