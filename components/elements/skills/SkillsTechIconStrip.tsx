"use client";

import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import * as Si from "react-icons/si";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  react: Si.SiReact,
  javascript: Si.SiJavascript,
  typescript: Si.SiTypescript,
  node: Si.SiNodedotjs,
  python: Si.SiPython,
  html: Si.SiHtml5,
  css: Si.SiCss3,
  tailwind: Si.SiTailwindcss,
  next: Si.SiNextdotjs,
  figma: Si.SiFigma,
  git: Si.SiGit,
  aws: Si.SiAmazon,
};

function getIcon(name: string) {
  const key = Object.keys(ICON_MAP).find(
    (k) => name.toLowerCase().includes(k)
  );
  return key ? ICON_MAP[key] : null;
}

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function SkillsTechIconStrip({
  portfolioData,
}: Props) {
  const skills = portfolioData.skills ?? [];
  const top = skills
    .sort((a, b) => {
      const order = ["Languages", "Frontend", "Backend", "Expert", "Tools"];
      const ai = order.indexOf(a.category);
      const bi = order.indexOf(b.category);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      return 0;
    })
    .slice(0, 8);

  if (top.length === 0) return null;

  return (
    <section
      className="py-10 md:py-12 px-4"
      style={{ background: "var(--color-background)" }}
    >
      <p
        className="text-center text-[13px] font-semibold uppercase tracking-[0.15em] mb-8"
        style={{ color: "var(--color-textMuted)", fontFamily: "Inter, sans-serif" }}
      >
        EXPERIENCE WITH
      </p>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {top.map((s, i) => {
          const Icon = getIcon(s.name);
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2 grayscale brightness-150 hover:grayscale-0 hover:brightness-100 transition-all duration-200"
              style={{ width: 48, height: 48 }}
            >
              {Icon ? (
                <Icon size={48} className="w-12 h-12" />
              ) : (
                <span
                  className="text-sm font-bold w-12 h-12 flex items-center justify-center rounded-lg"
                  style={{ background: "var(--color-border)" }}
                >
                  {s.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
