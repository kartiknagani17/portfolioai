"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { GradientHeading } from "@/components/elements/ui/GradientHeading";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ExperienceLogoParagraphDark({
  portfolioData,
}: Props) {
  const experience = portfolioData.experience ?? [];
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          experience.forEach((_, i) => {
            setTimeout(() => setVisible((v) => Math.max(v, i + 1)), i * 200);
          });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [experience.length]);

  if (experience.length === 0) return null;

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 px-4 md:px-12"
      style={{ background: "#141414" }}
    >
      <GradientHeading>EXPERIENCE</GradientHeading>
      <div className="max-w-3xl mx-auto space-y-0">
        {experience.map((job, i) => (
          <div
            key={i}
            className={`transition-all duration-500 ${
              i < visible ? "opacity-100" : "opacity-0"
            } ${i < experience.length - 1 ? "pb-10 mb-10 border-b border-[#2A2A2A]" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: "var(--color-accent)" }}
                >
                  {job.companyName.slice(0, 1).toUpperCase()}
                </div>
                <p
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {job.roleTitle} at {job.companyName}
                </p>
              </div>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {job.startDate} – {job.endDate || "Present"}
              </p>
            </div>
            <p
              className="mt-4 text-base leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.65)",
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.7,
              }}
            >
              {job.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
