import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function SkillsLabelValuePairs({
  portfolioData,
}: Props) {
  const skills = portfolioData.skills ?? [];
  if (skills.length === 0) return null;

  const byCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});
  const entries = Object.entries(byCategory).slice(0, 4);

  return (
    <div
      className="grid gap-4 py-4"
      style={{
        gridTemplateColumns: "120px 1fr",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div className="border-t border-[var(--color-border)] col-span-2 h-0 mt-0" />
      {entries.map(([cat, names]) => (
        <div key={cat} className="contents">
          <p
            className="text-xs font-normal underline underline-offset-2"
            style={{ color: "var(--color-textMuted)" }}
          >
            {cat}
          </p>
          <p
            className="text-xs font-light"
            style={{ color: "var(--color-textMuted)" }}
          >
            {names.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}
