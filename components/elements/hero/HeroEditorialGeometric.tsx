import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import GeometricCluster from "./GeometricCluster";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function HeroEditorialGeometric({
  portfolioData,
  layoutConfig,
}: Props) {
  const content = layoutConfig.content as { heroLabel?: string; heroHasNoCTA?: boolean; heroHeadline?: string; heroSubline?: string };
  const label = content?.heroLabel ?? "CREATIVE";
  const headline = content?.heroHeadline ?? layoutConfig.content?.heroHeadline ?? portfolioData.personal?.professionalTitle ?? "";
  const subline = content?.heroSubline ?? layoutConfig.content?.heroSubline ?? portfolioData.personal?.bio?.split(".")[0] ?? "";
  const hideCTA = content?.heroHasNoCTA === true;

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center px-4 py-16 md:px-12 bg-white">
      <div className="w-full md:w-[55%] order-2 md:order-1">
        <p
          className="text-sm uppercase tracking-widest mb-4"
          style={{ color: "var(--color-textMuted)", fontFamily: "Inter, sans-serif" }}
        >
          {label}
        </p>
        <h1
          className="text-4xl md:text-6xl lg:text-[72px] font-black text-black leading-tight"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {headline}
        </h1>
        <p
          className="text-base mt-6 max-w-lg"
          style={{ color: "var(--color-textMuted)", fontFamily: "Inter, sans-serif" }}
        >
          {subline}
        </p>
        {!hideCTA && (
          <div className="mt-8 flex gap-4">
            <a
              href="#contact"
              className="rounded-[50px] px-6 py-3 font-medium text-white"
              style={{ background: "var(--color-accent)" }}
            >
              Get in touch
            </a>
          </div>
        )}
      </div>
      <div className="w-full md:w-[45%] order-1 md:order-2 flex justify-center md:justify-end mt-12 md:mt-0 scale-90 md:scale-100">
        <GeometricCluster />
      </div>
    </section>
  );
}
