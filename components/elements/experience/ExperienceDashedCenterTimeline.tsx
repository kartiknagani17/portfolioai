"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ExperienceDashedCenterTimeline({
  portfolioData,
}: Props) {
  const experience = portfolioData.experience ?? [];
  const [visible, setVisible] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let i = 0;
          const id = setInterval(() => {
            setVisible((v) => Math.min(v + 1, experience.length));
            i++;
            if (i >= experience.length) clearInterval(id);
          }, 150);
          return () => clearInterval(id);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [experience.length]);

  if (experience.length === 0) return null;

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 px-4 bg-white"
      style={{ background: "#fff" }}
    >
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-12 md:mb-16">
        <span style={{ color: "var(--color-text, #1A1A1A)" }}>My </span>
        <span style={{ color: "var(--color-accent)" }}>Work</span>
        <span style={{ color: "var(--color-text)" }}> Experience</span>
      </h2>

      <div className="max-w-4xl mx-auto relative pl-0 md:pl-8">
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 hidden md:block"
          style={{ borderLeft: "2px dashed #D0D5DD", left: 0 }}
        />
        {experience.map((job, i) => (
          <div
            key={i}
            className={`flex flex-col md:flex-row gap-4 md:gap-8 mb-16 transition-all duration-500 ${
              i < visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div
              className="absolute left-0 top-6 w-3 h-3 rounded-full hidden md:block -translate-x-[5px]"
              style={{
                background: i === 0 ? "var(--color-accent)" : "var(--color-accent)",
                border: i === 0 ? "3px solid #1A1A1A" : "3px solid #fff",
                boxSizing: "border-box",
              }}
            />
            <div className="md:w-1/2 md:text-right md:pr-12 pl-8 md:pl-0">
              <p
                className="text-lg md:text-xl font-bold"
                style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text)" }}
              >
                {job.companyName}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-textMuted)" }}
              >
                {job.startDate} – {job.endDate || "Present"}
              </p>
            </div>
            <div className="md:w-1/2 pl-8 md:pl-0">
              <p
                className="text-lg md:text-xl font-bold"
                style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text)" }}
              >
                {job.roleTitle}
              </p>
              <p
                className="text-sm mt-2 line-clamp-3"
                style={{ color: "var(--color-textMuted)" }}
              >
                {job.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
