"use client";

import { useState, useEffect } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

const LINKS = [
  { label: "Home", href: "#" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function NavDarkTransparentScript({ portfolioData }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const name = portfolioData.personal?.fullName ?? "Portfolio";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`.nav-dark-gradient-hover:hover { background: linear-gradient(90deg, #60A5FA, #818CF8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }`}</style>
    <nav
      className="sticky top-0 z-[100] w-full py-5 px-6 md:px-10 flex items-center justify-between transition-all duration-300"
      style={{
        background: scrolled ? "rgba(20,20,20,0.85)" : "#141414",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <span
        className="text-[28px] font-bold text-white"
        style={{ fontFamily: '"Dancing Script", cursive' }}
      >
        {name}
      </span>
      <div className="flex items-center gap-8">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-[15px] font-medium opacity-80 transition-all duration-200 hover:opacity-100 nav-dark-gradient-hover"
            style={{ color: "#fff" }}
          >
            {l.label}
          </a>
        ))}
      </div>
      <div className="w-16" />
    </nav>
    </>
  );
}
