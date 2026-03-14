"use client";

import { useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { Menu, X } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

const LEFT_LINKS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Service", href: "#services" },
];
const RIGHT_LINKS = [
  { label: "Resume", href: "#resume" },
  { label: "Project", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function NavPillCentered({ portfolioData }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const name = portfolioData.personal?.fullName ?? "Portfolio";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <nav
        className="sticky z-[100] mx-4 md:mx-6 mt-4 rounded-[50px] flex items-center justify-between px-6 md:px-8 h-16 max-w-6xl mx-auto"
        style={{
          background: "#1C1C1C",
          margin: "16px 24px",
        }}
      >
        {/* Desktop: left links */}
        <div className="hidden md:flex items-center gap-6">
          {LEFT_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setActiveLink(l.label)}
              className="text-[15px] font-medium transition-colors duration-200 hover:opacity-90"
              style={{
                color: activeLink === l.label ? "#fff" : "#fff",
                background:
                  activeLink === l.label
                    ? "var(--color-accent)"
                    : "transparent",
                padding: activeLink === l.label ? "8px 24px" : "0",
                borderRadius: "50px",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Center logo */}
        <a
          href="#"
          className="flex items-center gap-2 shrink-0"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "var(--color-accent)" }}
          >
            {initials}
          </div>
          <span className="text-white text-[15px] font-medium hidden sm:inline">
            {name}
          </span>
        </a>

        {/* Desktop: right links */}
        <div className="hidden md:flex items-center gap-6">
          {RIGHT_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setActiveLink(l.label)}
              className="text-[15px] font-medium text-white transition-colors duration-200 hover:text-[var(--color-accent)]"
              style={{
                background:
                  activeLink === l.label
                    ? "var(--color-accent)"
                    : "transparent",
                padding: activeLink === l.label ? "8px 24px" : "0",
                borderRadius: "50px",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99] bg-[#1C1C1C] flex flex-col items-center justify-center gap-8 py-20 md:hidden"
          style={{ background: "#1C1C1C" }}
        >
          {[...LEFT_LINKS, ...RIGHT_LINKS].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-white text-xl font-medium"
              onClick={() => setMobileOpen(false)}
              style={{ color: "#fff" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
