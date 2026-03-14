"use client";

import { useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function TestimonialsStarsRow({
  portfolioData,
}: Props) {
  const testimonials = portfolioData.testimonials ?? [];
  const [index, setIndex] = useState(0);
  if (testimonials.length === 0) return null;

  const t = testimonials[index];

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div
            className="rounded-[50px] px-4 py-2 text-sm font-medium w-fit"
            style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}
          >
            Reviews
          </div>
          <h2 className="text-2xl md:text-4xl font-bold">
            <span style={{ color: "var(--color-text)" }}>What Clients </span>
            <span style={{ color: "#22C55E" }}>Say</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
            className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
            className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="flex overflow-hidden gap-0 md:gap-6">
        {testimonials.slice(index, index + 3).map((item, i) => (
          <div
            key={i}
            className="min-w-full md:min-w-[calc(33.333%-16px)] p-6 border-r border-[var(--color-border)] last:border-r-0"
          >
            <div className="flex gap-0.5 text-amber-500 mb-4">{"★".repeat(5)}</div>
            <p className="text-base" style={{ color: "var(--color-text)" }}>{item.quote}</p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-[var(--color-border)]" />
              <div>
                <p className="font-semibold" style={{ color: "var(--color-text)" }}>{item.author}</p>
                <p className="text-sm" style={{ color: "var(--color-textMuted)" }}>{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-8 md:hidden">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-[#22C55E]" : "bg-[var(--color-border)]"}`}
          />
        ))}
      </div>
    </section>
  );
}
