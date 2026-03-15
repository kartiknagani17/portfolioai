"use client";

import { useState, useEffect } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function TestimonialsDarkCarousel({
  portfolioData,
}: Props) {
  const testimonials = portfolioData.testimonials ?? [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section
      className="py-16 md:py-24 px-4 rounded-[32px] overflow-hidden"
      style={{
        background: "#1C1C1C",
        backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 20px, rgba(255,255,255,0.015) 20px, rgba(255,255,255,0.015) 21px)",
      }}
    >
      <h2 className="text-center text-2xl md:text-4xl font-bold text-white mb-12">
        What People Say
      </h2>
      <div className="max-w-4xl mx-auto relative">
        <div className="flex overflow-hidden">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-full px-4 flex justify-center transition-opacity duration-300"
              style={{
                opacity: i === index ? 1 : 0.6,
                pointerEvents: i === index ? "auto" : "none",
              }}
            >
              <div
                className="w-full max-w-md rounded-2xl border p-7"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,0.12)",
                }}
              >
                <p className="text-4xl text-[var(--color-accent)]">&ldquo;</p>
                <p className="text-white mt-2">{t.quote}</p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-12 h-12 rounded-full bg-white/20" />
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-white/70">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-[var(--color-accent)] mt-2">
                  {"★".repeat(5)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === index ? "bg-[var(--color-accent)]" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
