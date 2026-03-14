import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function NavWhiteUltraMinimal({ portfolioData }: Props) {
  const name = portfolioData.personal?.fullName ?? "Portfolio";

  return (
    <nav
      className="sticky top-0 z-[100] w-full py-5 px-6 md:px-10 flex items-center justify-between backdrop-blur-md"
      style={{
        background: "rgba(255,255,255,0.95)",
      }}
    >
      <span
        className="text-lg font-bold text-black"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {name}
      </span>
      <div className="flex items-center gap-10">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-[15px] font-medium text-black transition-all duration-200 hover:underline"
            style={{ textUnderlineOffset: 4 }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
