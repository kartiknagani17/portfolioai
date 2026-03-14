"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ProjectsNumberedRuleList({
  portfolioData,
}: Props) {
  const projects = portfolioData.projects ?? [];
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(projects.length);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [projects.length]);

  if (projects.length === 0) return null;

  return (
    <section
      ref={ref}
      className="py-12 md:py-16 px-4 md:px-12"
      style={{ background: "#EFEFEF", fontFamily: "DM Sans, sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">
        {projects.map((proj, i) => (
          <div
            key={i}
            className={`grid grid-cols-1 md:grid-cols-[35%_65%] gap-8 py-12 border-t border-[#D0D0D0] transition-opacity duration-500 ${
              i <= visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div>
              <p
                className="text-[11px] uppercase tracking-wider"
                style={{ color: "var(--color-textMuted)" }}
              >
                {String(i + 1).padStart(2, "0")} / {proj.projectName.toUpperCase()}
              </p>
              <p
                className="text-sm font-light mt-2"
                style={{ color: "var(--color-text)" }}
              >
                {proj.description}
              </p>
              {(proj.techStack ?? []).length > 0 && (
                <p
                  className="text-xs font-light mt-2"
                  style={{ color: "var(--color-textMuted)" }}
                >
                  {proj.techStack!.join(", ")}
                </p>
              )}
              {proj.liveUrl ? (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline mt-2 inline-block"
                  style={{ color: "var(--color-text)" }}
                >
                  See case study →
                </a>
              ) : proj.githubUrl ? (
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline mt-2 inline-block"
                  style={{ color: "var(--color-text)" }}
                >
                  More shots ↗
                </a>
              ) : (
                <span className="text-sm mt-2 inline-block" style={{ color: "var(--color-textMuted)" }}>
                  Project WIP
                </span>
              )}
            </div>
            <div
              className="aspect-[16/10] rounded-none overflow-hidden"
              style={{ background: "#D0D0D0" }}
            >
              {proj.imageUrl ? (
                <img
                  src={proj.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
          </div>
        ))}
        <div className="border-b border-[#D0D0D0] h-0" />
      </div>
    </section>
  );
}
