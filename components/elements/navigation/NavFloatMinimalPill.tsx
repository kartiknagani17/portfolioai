"use client";

import { useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { Menu, X } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Blogs", href: "#blog" },
];

export default function NavFloatMinimalPill({ portfolioData }: Props) {
  const [open, setOpen] = useState(false);
  const name = portfolioData.personal?.fullName ?? "Portfolio";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const resumeUrl =
    portfolioData.personal?.websiteUrl ?? "#resume";

  return (
    <>
      <nav
        className="sticky z-[100] max-w-[680px] mx-auto my-4 rounded-[50px] flex items-center justify-between px-4 md:px-6 h-14 shadow-lg"
        style={{
          background: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          margin: "16px auto",
        }}
      >
        <div
          className="rounded-[20px] px-3.5 py-1.5 text-white text-sm font-medium shrink-0"
          style={{ background: "var(--color-accent)" }}
        >
          {initials}
        </div>

        <div className="hidden md:flex items-center gap-8">
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

        <div className="flex items-center gap-2">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block rounded-[50px] px-5 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "#1A1A1A" }}
          >
            My resume
          </a>
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="md:hidden absolute left-4 right-4 top-full mt-2 rounded-xl border bg-white py-4 shadow-lg z-[100]"
          style={{ borderColor: "var(--color-border)" }}
        >
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="block px-6 py-2 text-[15px] font-medium"
              style={{ color: "var(--color-text)" }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href={resumeUrl}
            className="block px-6 py-2 text-[15px] font-medium"
            style={{ color: "var(--color-accent)" }}
            onClick={() => setOpen(false)}
          >
            My resume
          </a>
        </div>
      )}
    </>
  );
}
