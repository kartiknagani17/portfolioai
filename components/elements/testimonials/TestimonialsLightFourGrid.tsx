import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function TestimonialsLightFourGrid({
  portfolioData,
}: Props) {
  const testimonials = portfolioData.testimonials ?? [];
  const display = testimonials.slice(0, 4);
  if (display.length === 0) return null;

  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ background: "#F0EDE8" }}
    >
      <h2 className="text-center text-2xl md:text-4xl font-bold mb-12" style={{ color: "var(--color-text)" }}>
        Testimonials
      </h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {display.map((t, i) => (
          <div
            key={i}
            className="rounded-2xl border p-7 bg-white"
            style={{ borderColor: "#E8E4DE" }}
          >
            <p
              className="text-5xl font-black"
              style={{ color: "var(--color-accent)", fontFamily: "Cabinet Grotesk, sans-serif" }}
            >
              &ldquo;
            </p>
            <p className="text-base mt-2" style={{ fontFamily: "Inter, sans-serif", color: "var(--color-text)" }}>
              {t.quote}
            </p>
            <div className="border-t border-[#E8E4DE] mt-4 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-border)]" />
              <div>
                <p className="font-semibold" style={{ color: "var(--color-text)" }}>{t.name}</p>
                <p className="text-sm" style={{ color: "var(--color-textMuted)" }}>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
