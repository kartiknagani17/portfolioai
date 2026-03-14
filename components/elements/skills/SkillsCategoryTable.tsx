import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function SkillsCategoryTable({ portfolioData }: Props) {
  const skills = portfolioData.skills ?? [];
  if (skills.length === 0) return null;

  const byCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});
  const entries = Object.entries(byCategory).slice(0, 8);

  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ background: "#F0EDE8" }}
    >
      <h2
        className="text-center text-2xl md:text-3xl font-bold mb-12"
        style={{ color: "var(--color-text)" }}
      >
        My Skills &amp; Stack
      </h2>
      <div className="max-w-3xl mx-auto rounded-2xl border overflow-hidden">
        <table className="w-full" style={{ fontFamily: "Inter, sans-serif" }}>
          <thead>
            <tr
              className="text-[13px] font-semibold uppercase"
              style={{
                background: "#FAFAF8",
                borderBottom: "1px solid #E8E4DE",
                color: "var(--color-textMuted)",
              }}
            >
              <td className="p-4">Category</td>
              <td className="p-4 text-right">Tools &amp; Tech</td>
            </tr>
          </thead>
          <tbody>
            {entries.map(([cat, names], i) => (
              <tr
                key={cat}
                className="transition-colors hover:bg-[#FAFAF8] border-b border-[#F0EDE8] last:border-b-0"
              >
                <td
                  className="p-4 text-base"
                  style={{ color: "var(--color-textMuted)" }}
                >
                  {cat}
                </td>
                <td
                  className="p-4 text-right text-[15px]"
                  style={{ color: "var(--color-text)" }}
                >
                  {names.join(" ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
