"use client";

import { useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { ArrowRight } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ServicesDarkGlassmorphismCarousel({
  portfolioData,
}: Props) {
  const skills = portfolioData.skills ?? [];
  const byCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || "Service";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});
  const services = Object.entries(byCategory).slice(0, 3).map(([name, items]) => ({
    name,
    description: items.join(", "),
  }));
  const [index, setIndex] = useState(0);

  if (services.length === 0) return null;

  return (
    <section
      className="py-16 md:py-24 px-4 rounded-[32px] overflow-hidden"
      style={{
        background: "#1C1C1C",
        backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 20px, rgba(255,255,255,0.015) 20px, rgba(255,255,255,0.015) 21px)",
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
        <h2 className="text-2xl md:text-4xl font-bold">
          <span style={{ color: "var(--color-text)" }}>My </span>
          <span style={{ color: "var(--color-accent)" }}>Services</span>
        </h2>
        <p className="max-w-md text-sm" style={{ color: "var(--color-textMuted)" }}>
          What I can do for you.
        </p>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-6 md:overflow-visible">
        {services.map((svc, i) => (
          <div
            key={i}
            className="shrink-0 w-[280px] md:w-[320px] rounded-[20px] border p-8 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            <h3 className="text-lg font-semibold text-white">{svc.name}</h3>
            <div className="mt-4 h-32 bg-white/5 rounded-lg" />
            <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors">
              <ArrowRight size={18} className="text-white" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {services.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-[var(--color-accent)]" : "bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
