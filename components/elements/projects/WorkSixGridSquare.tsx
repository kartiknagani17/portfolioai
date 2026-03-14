"use client";

import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { ExternalLink } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function WorkSixGridSquare({
  portfolioData,
}: Props) {
  const projects = portfolioData.projects ?? [];
  const display = projects.slice(0, 6);

  if (projects.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <h2
        className="text-3xl md:text-[36px] font-bold mb-12"
        style={{ color: "var(--color-text)", fontFamily: "Inter, sans-serif" }}
      >
        My latest work
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {display.map((proj, i) => (
          <a
            key={i}
            href={proj.liveUrl || proj.githubUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="aspect-square overflow-hidden rounded-none bg-[#E5E5E5] relative">
              {proj.imageUrl ? (
                <img
                  src={proj.imageUrl}
                  alt=""
                  className="w-full h-full object-cover group-hover:opacity-85 group-hover:scale-[0.98] transition-all duration-300"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[var(--color-textMuted)] text-sm"
                  style={{ background: "var(--color-accent)", opacity: 0.2 }}
                >
                  {proj.projectName}
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-5 h-5 text-white drop-shadow" />
              </div>
            </div>
            <p
              className="text-[15px] font-bold mt-2"
              style={{ color: "var(--color-text)", fontFamily: "Inter, sans-serif" }}
            >
              {proj.projectName}
            </p>
            <p
              className="text-sm mt-0.5"
              style={{ color: "var(--color-textMuted)" }}
            >
              {(proj.techStack ?? [])[0] ?? "Project"}
            </p>
          </a>
        ))}
      </div>
      {projects.length > 6 && (
        <a
          href="#projects"
          className="inline-block mt-8 font-medium"
          style={{ color: "var(--color-accent)" }}
        >
          View all work →
        </a>
      )}
    </section>
  );
}
