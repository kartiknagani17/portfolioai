"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ExperienceNumberedRuleList({
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
          setVisible(experience.length);
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
      className="py-12 md:py-16 px-4 md:px-12"
      style={{ background: "#EFEFEF", fontFamily: "DM Sans, sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">
        {experience.map((job, i) => (
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
                {String(i + 1).padStart(2, "0")} / {job.companyName.toUpperCase()}
              </p>
              <p
                className="text-sm font-light mt-2"
                style={{ color: "var(--color-text)" }}
              >
                {job.description}
              </p>
              <p
                className="text-xs font-light mt-2"
                style={{ color: "var(--color-textMuted)" }}
              >
                {job.startDate} – {job.endDate || "Present"}
              </p>
              <a
                href="#"
                className="text-sm underline mt-2 inline-block"
                style={{ color: "var(--color-text)" }}
              >
                More shots ↗
              </a>
            </div>
            <div
              className="aspect-[16/10] rounded-none bg-[#D0D0D0] overflow-hidden"
              style={{ background: "#D0D0D0" }}
            />
          </div>
        ))}
        <div className="border-b border-[#D0D0D0] h-0" />
      </div>
    </section>
  );
}
