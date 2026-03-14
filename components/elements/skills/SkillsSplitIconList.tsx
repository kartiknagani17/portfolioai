import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import {
  Code2,
  Palette,
  Database,
  Layout,
  Cpu,
  Globe,
} from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  Frontend: Code2,
  Design: Palette,
  Backend: Database,
  "UI/UX": Layout,
  Languages: Cpu,
  Other: Globe,
};

export default function SkillsSplitIconList({
  portfolioData,
}: Props) {
  const skills = portfolioData.skills ?? [];
  const byCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});
  const topCategories = Object.entries(byCategory).slice(0, 4);

  if (topCategories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[40%_60%] gap-12">
        <div>
          <div
            className="rounded-[50px] px-4 py-2 text-sm font-medium w-fit mb-6"
            style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}
          >
            My Skills
          </div>
          <h2 className="text-2xl md:text-4xl font-bold">
            <span style={{ color: "var(--color-text)" }}>
              Why Hire Me For Your Next Project?
            </span>
            <span style={{ color: "#22C55E" }}> Project?</span>
          </h2>
          <p className="text-base mt-4" style={{ color: "var(--color-textMuted)" }}>
            I bring a strong mix of technical and design skills to deliver
            results.
          </p>
          <button
            type="button"
            className="mt-6 rounded-[50px] px-6 py-3 font-medium text-white"
            style={{ background: "#22C55E" }}
          >
            Hire Me
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {topCategories.map(([cat, names], i) => {
            const Icon = CATEGORY_ICONS[cat] ?? Globe;
            return (
              <div
                key={cat}
                className="p-6 rounded-xl border border-[var(--color-border)]"
              >
                <Icon
                  size={28}
                  className="mb-3"
                  style={{ color: "#22C55E" }}
                />
                <h3
                  className="text-lg font-bold"
                  style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    color: "var(--color-text)",
                  }}
                >
                  {cat}
                </h3>
                <p
                  className="text-sm mt-2 line-clamp-2"
                  style={{ color: "var(--color-textMuted)" }}
                >
                  {names.join(", ")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
