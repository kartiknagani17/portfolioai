import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function TestimonialsYellowBorderCards({
  portfolioData,
}: Props) {
  const testimonials = portfolioData.testimonials ?? [];
  const display = testimonials.slice(0, 3);
  if (display.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <h2 className="text-center text-2xl md:text-4xl font-bold mb-12" style={{ color: "var(--color-text)" }}>
        Clients
      </h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {display.map((t, i) => (
          <div
            key={i}
            className="border-2 rounded-none p-7"
            style={{ borderColor: "#F5C842" }}
          >
            <p className="text-[15px]" style={{ fontFamily: "Inter, sans-serif", color: "var(--color-text)" }}>
              {t.quote}
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-border)]" />
              <div>
                <p className="font-semibold" style={{ color: "var(--color-text)" }}>{t.author}</p>
                <p className="text-sm" style={{ color: "var(--color-textMuted)" }}>{t.company ?? t.role}</p>
              </div>
            </div>
            <div className="flex gap-0.5 text-[#F5C842] mt-2">{"★".repeat(5)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
