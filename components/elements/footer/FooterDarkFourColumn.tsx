import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function FooterDarkFourColumn({
  portfolioData,
}: Props) {
  const { personal } = portfolioData;
  const name = personal?.fullName ?? "Portfolio";

  return (
    <footer className="bg-white">
      <div className="max-w-6xl mx-auto py-12 px-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--color-border)]">
        <h3 className="text-3xl md:text-[40px] font-bold" style={{ fontFamily: "Poppins, sans-serif", color: "var(--color-text)" }}>
          Let&apos;s Connect
        </h3>
        <a
          href="#contact"
          className="rounded-[50px] px-8 py-4 font-medium text-white w-fit"
          style={{ background: "var(--color-accent)" }}
        >
          Hire me ↗
        </a>
      </div>
      <div
        className="rounded-t-[24px] py-12 md:py-16 px-6 md:px-12"
        style={{ background: "#1C1C1C" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="w-12 h-12 rounded-full mb-4" style={{ background: "var(--color-accent)" }} />
            <p className="font-semibold text-white">{name}</p>
            <p className="text-sm mt-2" style={{ color: "var(--color-textMuted)" }}>
              {personal?.bio?.slice(0, 80)}...
            </p>
            <div className="flex gap-2 mt-4">
              <a href={personal?.linkedinUrl ?? "#"} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[var(--color-accent)] hover:text-white transition-colors">in</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--color-accent)" }}>Navigation</h4>
            <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--color-textMuted)" }}>
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#services" className="hover:text-white transition-colors">Service</a>
              <a href="#resume" className="hover:text-white transition-colors">Resume</a>
              <a href="#projects" className="hover:text-white transition-colors">Project</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--color-accent)" }}>Contact</h4>
            <div className="flex flex-col gap-2 text-sm" style={{ color: "var(--color-textMuted)" }}>
              {personal?.phone && <a href={`tel:${personal.phone}`}>{personal.phone}</a>}
              {personal?.email && <a href={`mailto:${personal.email}`}>{personal.email}</a>}
              {personal?.websiteUrl && <a href={personal.websiteUrl}>Website</a>}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4" style={{ color: "var(--color-accent)" }}>Get the latest information</h4>
            <div className="flex rounded-lg overflow-hidden border border-white/20">
              <input type="email" placeholder="Email" className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none" />
              <button type="button" className="px-4 py-3" style={{ background: "var(--color-accent)", color: "#fff" }}>→</button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[#333] flex flex-col md:flex-row justify-between gap-4 text-[13px]" style={{ color: "var(--color-textMuted)" }}>
          <span>© {new Date().getFullYear()} {name}</span>
          <span>Terms · Privacy</span>
        </div>
      </div>
    </footer>
  );
}
