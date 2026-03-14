import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Portfolio", href: "#projects" },
  { label: "Testimonial", href: "#testimonials" },
];

export default function NavWhiteLogoPillCV({ portfolioData }: Props) {
  const name = portfolioData.personal?.fullName ?? "Portfolio";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav
      className="sticky top-0 z-[100] w-full py-4 px-6 md:px-10 flex items-center justify-between border-b bg-white"
      style={{ borderColor: "#F0F0F0" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: "var(--color-accent)" }}
        >
          {initials}
        </div>
        <span
          className="text-lg font-bold hidden sm:inline"
          style={{ color: "var(--color-accent)" }}
        >
          {name}
        </span>
      </div>
      <div className="hidden md:flex items-center gap-6">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-[15px] font-medium transition-colors duration-200"
            style={{ color: "var(--color-text, #1A1A1A)" }}
          >
            {l.label}
          </a>
        ))}
      </div>
      <a
        href="#resume"
        className="rounded-lg px-4 py-2 text-sm font-medium border-2 border-[#1A1A1A] bg-transparent transition-all duration-200 hover:bg-[#1A1A1A] hover:text-white"
      >
        Download CV
      </a>
    </nav>
  );
}
