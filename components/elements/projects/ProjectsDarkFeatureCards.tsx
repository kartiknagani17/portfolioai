import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { ArrowUpRight } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ProjectsDarkFeatureCards({
  portfolioData,
  layoutConfig,
}: Props) {
  const projects = portfolioData.projects ?? [];
  const heading =
    (layoutConfig.content as { projectsSectionHeading?: string })
      ?.projectsSectionHeading ?? "Things I've Built";
  const display = projects.slice(0, 3);

  if (projects.length === 0) return null;

  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ background: "#F0EDE8" }}
    >
      <h2
        className="text-center text-2xl md:text-4xl font-bold mb-12"
        style={{ color: "var(--color-text)", fontFamily: "Cabinet Grotesk, sans-serif" }}
      >
        {heading}
      </h2>
      <div className="max-w-4xl mx-auto space-y-8">
        {display.map((proj, i) => {
          const bullets = (proj.description ?? "")
            .split(/(?<=[.!?])\s+/)
            .filter(Boolean)
            .slice(0, 3);
          return (
            <div
              key={i}
              className="rounded-[20px] p-8 md:p-10 grid grid-cols-1 md:grid-cols-[45%_55%] gap-8 items-center"
              style={{ background: "#1A1A1A" }}
            >
              <div className="rounded-lg overflow-hidden border border-white/10">
                <div className="flex gap-1.5 p-2" style={{ background: "#2A2A2A" }}>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="aspect-video bg-[#2A2A2A]">
                  {proj.imageUrl ? (
                    <img
                      src={proj.imageUrl}
                      alt=""
                      className="w-full h-full object-cover rounded-b-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">
                      Screenshot
                    </div>
                  )}
                </div>
              </div>
              <div className="relative">
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-0 right-0 text-white hover:text-[var(--color-accent)] transition-colors"
                  >
                    <ArrowUpRight size={24} />
                  </a>
                )}
                <h3
                  className="text-2xl md:text-[28px] font-extrabold text-white"
                  style={{ fontFamily: "Cabinet Grotesk, sans-serif" }}
                >
                  {proj.projectName}
                </h3>
                <p
                  className="text-[15px] mt-2"
                  style={{ color: "#CCCCCC", fontFamily: "Inter, sans-serif" }}
                >
                  {proj.description}
                </p>
                {bullets.length > 0 && (
                  <ul className="mt-4 space-y-1 text-sm text-white/80">
                    {bullets.map((b, j) => (
                      <li key={j}>+ {b}</li>
                    ))}
                  </ul>
                )}
                {(proj.techStack ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {proj.techStack!.slice(0, 5).map((t, j) => (
                      <span
                        key={j}
                        className="text-[13px] px-2.5 py-1 rounded-md border border-white/15 text-white"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {projects.length > 3 && (
          <a
            href="#projects"
            className="block text-center font-medium"
            style={{ color: "var(--color-accent)" }}
          >
            See all →
          </a>
        )}
      </div>
    </section>
  );
}
