"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

function parseBullets(desc: string): string[] {
  if (!desc) return [];
  const byNewline = desc.split(/\n/).filter(Boolean);
  if (byNewline.length > 1) return byNewline.slice(0, 4);
  const bySentence = desc.split(/(?<=[.!?])\s+/).filter(Boolean);
  return bySentence.slice(0, 4);
}

export default function ExperienceLogoBulletCards({
  portfolioData,
  layoutConfig,
}: Props) {
  const experience = portfolioData.experience ?? [];
  const heading =
    (layoutConfig.content as { experienceSectionHeading?: string })
      ?.experienceSectionHeading ?? "Where I've Worked";
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          experience.forEach((_, i) => {
            setTimeout(() => setVisible((v) => Math.max(v, i + 1)), i * 100);
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
      className="py-16 md:py-24 px-4"
      style={{ background: "#F0EDE8" }}
    >
      <h2
        className="text-center text-2xl md:text-3xl font-bold mb-12"
        style={{ color: "var(--color-text)" }}
      >
        {heading}
      </h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {experience.map((job, i) => {
          const bullets = parseBullets(job.description ?? "");
          return (
            <div
              key={i}
              className={`rounded-2xl border p-7 md:p-8 transition-all duration-300 hover:border-[#C8C4BE] ${
                i < visible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
              style={{
                background: "#fff",
                borderColor: "#E8E4DE",
              }}
            >
              <div className="flex justify-between items-start">
                <p
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "Cabinet Grotesk, sans-serif",
                    color: "var(--color-text)",
                  }}
                >
                  {job.roleTitle}
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: "var(--color-accent)" }}
                >
                  {job.companyName.slice(0, 1).toUpperCase()}
                </div>
              </div>
              <p
                className="text-[13px] mt-2"
                style={{ color: "var(--color-textMuted)", fontFamily: "Inter, sans-serif" }}
              >
                {job.startDate} – {job.endDate || "Present"}
              </p>
              {bullets.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex gap-2 text-sm"
                      style={{ fontFamily: "Inter, sans-serif", color: "var(--color-text)" }}
                    >
                      <span
                        className="w-1 h-1 rounded-full shrink-0 mt-1.5"
                        style={{ background: "var(--color-text)" }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <div
                className="mt-4 pt-4 border-t flex justify-between text-sm"
                style={{ borderColor: "#E8E4DE", color: "var(--color-textMuted)" }}
              >
                <span>{job.companyName}</span>
                {job.location && <span>{job.location}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
