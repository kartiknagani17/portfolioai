import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import ServiceIllustration from "./ServiceIllustration";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ServicesThreeColumnIllustration({
  portfolioData,
}: Props) {
  const skills = portfolioData.skills ?? [];
  const byCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});
  const services = Object.entries(byCategory).slice(0, 3).map(([title, items]) => ({
    title,
    description: items.join(", "),
  }));

  if (services.length === 0) {
    const bio = portfolioData.personal?.bio ?? "";
    if (!bio) return null;
    services.push(
      { title: "Consulting", description: bio.slice(0, 120) + "..." },
      { title: "Design", description: "Creative solutions." },
      { title: "Development", description: "Build something great." }
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {services.map((svc, i) => (
          <div key={i}>
            <ServiceIllustration variant={(i % 3) === 0 ? 1 : (i % 3) === 1 ? 2 : 3} />
            <h3 className="text-xl font-bold mt-6" style={{ fontFamily: "Inter, sans-serif", color: "var(--color-text)" }}>
              {svc.title}
            </h3>
            <p className="text-[15px] mt-2 line-clamp-3" style={{ color: "var(--color-textMuted)", fontFamily: "Inter, sans-serif" }}>
              {svc.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
