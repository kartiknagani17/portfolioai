"use client";

import { useRef, useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { ChevronRight } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ProjectsScreenshotCarousel({
  portfolioData,
}: Props) {
  const projects = portfolioData.projects ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const allTech = Array.from(
    new Set(projects.flatMap((p) => p.techStack ?? []))
  ).slice(0, 8);
  const filtered =
    activeFilter === null
      ? projects
      : projects.filter((p) => (p.techStack ?? []).includes(activeFilter));

  if (projects.length === 0) return null;

  const cardWidth = 380;
  const gap = 24;
  const visibleCards = 2.5;

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-4xl font-bold">
            <span style={{ color: "var(--color-text)" }}>
              Let&apos;s have a look at my{" "}
            </span>
            <span style={{ color: "var(--color-accent)" }}>Portfolio</span>
          </h2>
          <button
            type="button"
            className="rounded-[50px] px-6 py-2.5 text-sm font-medium text-white"
            style={{ background: "var(--color-accent)" }}
          >
            See All
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
          onScroll={() => {
            if (scrollRef.current) {
              const idx = Math.round(
                scrollRef.current.scrollLeft / (cardWidth + gap)
              );
              setScrollIndex(idx);
            }
          }}
        >
          {filtered.map((proj, i) => (
            <div
              key={i}
              className="shrink-0 w-[340px] md:w-[380px] snap-center rounded-2xl overflow-hidden border border-[var(--color-border)]"
            >
              <div className="relative h-[220px] md:h-[280px] bg-[#E5E5E5]">
                {proj.imageUrl ? (
                  <img
                    src={proj.imageUrl}
                    alt={proj.projectName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-[var(--color-textMuted)]"
                    style={{ background: "#E5E5E5" }}
                  >
                    {proj.projectName}
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent"
                />
                <p
                  className="absolute bottom-4 left-4 text-2xl font-bold text-white"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {proj.projectName}
                </p>
                <button
                  type="button"
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-[var(--color-accent)]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {allTech.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              className={`rounded-[50px] px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === null
                  ? "text-white"
                  : "border border-[var(--color-border)]"
              }`}
              style={{
                background: activeFilter === null ? "var(--color-accent)" : "transparent",
              }}
            >
              All
            </button>
            {allTech.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => setActiveFilter(tech)}
                className={`rounded-[50px] px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === tech
                    ? "text-white"
                    : "border border-[var(--color-border)]"
                }`}
                style={{
                  background: activeFilter === tech ? "var(--color-accent)" : "transparent",
                }}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-2 mt-6">
          {filtered.slice(0, 5).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                scrollRef.current?.scrollTo({
                  left: i * (cardWidth + gap),
                  behavior: "smooth",
                });
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === scrollIndex ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
