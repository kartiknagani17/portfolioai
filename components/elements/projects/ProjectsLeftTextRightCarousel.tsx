"use client";

import { useRef, useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ProjectsLeftTextRightCarousel({
  portfolioData,
}: Props) {
  const projects = portfolioData.projects ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  if (projects.length === 0) return null;

  const scroll = (dir: number) => {
    const next = Math.max(0, Math.min(index + dir, projects.length - 1));
    setIndex(next);
    scrollRef.current?.scrollTo({
      left: next * (280 + 24),
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[30%_70%] gap-12">
        <div>
          <div
            className="rounded-[50px] px-4 py-2 text-sm font-medium w-fit mb-6"
            style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}
          >
            Portfolio
          </div>
          <h2 className="text-2xl md:text-4xl font-bold">
            <span style={{ color: "var(--color-text)" }}>
              My Creative Works Latest{" "}
            </span>
            <span style={{ color: "#22C55E" }}>Projects</span>
          </h2>
          <p className="text-base mt-4" style={{ color: "var(--color-textMuted)" }}>
            Selected work and case studies.
          </p>
          <button
            type="button"
            className="mt-6 rounded-[50px] px-6 py-3 font-medium text-white"
            style={{ background: "#22C55E" }}
          >
            Show More
          </button>
        </div>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {projects.map((proj, i) => (
              <div
                key={i}
                className="shrink-0 w-[260px] md:w-[280px] h-[340px] md:h-[360px] snap-center rounded-xl overflow-hidden border border-[#E5E7EB]"
              >
                <div className="h-[200px] bg-[#E5E7EB]">
                  {proj.imageUrl ? (
                    <img
                      src={proj.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-textMuted)] text-sm">
                      {proj.projectName}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p
                    className="font-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {proj.projectName}
                  </p>
                  <p
                    className="text-sm mt-1 line-clamp-2"
                    style={{ color: "var(--color-textMuted)" }}
                  >
                    {proj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full border border-[#E5E7EB] flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {projects.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === index
                      ? "w-4 h-2 bg-[#22C55E]"
                      : "w-2 h-2 rounded-full bg-[#D1D5DB]"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full border border-[#E5E7EB] flex items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
