"use client";

import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function MarqueeSkillsTicker({
  portfolioData,
}: Props) {
  const skills = portfolioData.skills ?? [];
  const names = skills.slice(0, 10).map((s) => s.name);
  if (names.length === 0) return null;

  const segment = (
    <>
      {names.map((n, i) => (
        <span key={i} className="mx-6 whitespace-nowrap">
          {n.toUpperCase()}
        </span>
      ))}
    </>
  );

  return (
    <section
      className="h-[52px] overflow-hidden flex items-center w-full"
      style={{
        background: "var(--color-accent)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="flex animate-marquee-ticker hover:[animation-play-state:paused] whitespace-nowrap text-white text-base font-semibold tracking-wider">
        <span className="flex items-center"> {segment} <span className="mx-4">✦</span> </span>
        <span className="flex items-center"> {segment} <span className="mx-4">✦</span> </span>
      </div>
      <style>{`
        @keyframes marquee-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee-ticker {
          animation: marquee-ticker 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
