import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Playground", href: "#playground" },
  { label: "Contact", href: "#contact" },
];

export default function NavGreyBareMinimal({ portfolioData }: Props) {
  const name = portfolioData.personal?.fullName ?? "Portfolio";
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toLowerCase()
      .slice(0, 2) + ".";

  return (
    <nav
      className="sticky top-0 z-[100] w-full py-6 px-6 md:px-8"
      style={{
        background: "#EFEFEF",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-black lowercase">
          {initials}
        </span>
        <div className="flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-normal text-black transition-all duration-200 hover:underline"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
