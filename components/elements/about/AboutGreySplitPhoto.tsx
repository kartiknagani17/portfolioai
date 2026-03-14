import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import SkillsLabelValuePairs from "@/components/elements/skills/SkillsLabelValuePairs";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function AboutGreySplitPhoto({
  portfolioData,
  layoutConfig,
}: Props) {
  const { personal } = portfolioData;
  const content = layoutConfig.content;
  const fullName = personal?.fullName ?? "";
  const title = personal?.professionalTitle ?? "";
  const bio = content?.rewrittenBio ?? personal?.bio ?? "";

  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ background: "#EFEFEF", fontFamily: "DM Sans, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[55%_45%] gap-12">
        <div>
          <h2 className="text-3xl md:text-[40px] font-bold leading-tight" style={{ color: "var(--color-text)" }}>
            Hi I&apos;m {fullName}, {title}.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] font-light" style={{ color: "#888888" }}>
            {bio.split(/\n\n/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-8">
            <SkillsLabelValuePairs portfolioData={portfolioData} layoutConfig={layoutConfig} />
          </div>
        </div>
        <div className="aspect-[3/4] overflow-hidden rounded-none bg-[#D0D0D0]">
          {personal?.profilePhotoUrl ? (
            <img
              src={personal.profilePhotoUrl}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
