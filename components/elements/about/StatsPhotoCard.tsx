"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

function useCountUp(end: number, duration: number, trigger: boolean) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || end === 0) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const start = 0;
          const startTime = performance.now();
          const step = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            setValue(Math.round(start + (end - start) * t));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, trigger]);

  return { value, ref };
}

export default function StatsPhotoCard({
  portfolioData,
  layoutConfig,
}: Props) {
  const { personal } = portfolioData;
  const bio = layoutConfig.content?.rewrittenBio ?? personal?.bio ?? "";
  const expCount = portfolioData.experience?.length ?? 0;
  const projCount = portfolioData.projects?.length ?? 0;
  const stat1 = useCountUp(expCount + projCount + 450, 1500, true);
  const stat2 = useCountUp(expCount + 5, 1500, true);

  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ background: "#F2F4F7" }}
    >
      <div className="max-w-5xl mx-auto rounded-[24px] p-8 md:p-12 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative">
            <div
              className="absolute inset-0 w-3/4 h-3/4 -rotate-3 rounded-2xl"
              style={{ background: "var(--color-accent)" }}
            />
            {personal?.profilePhotoUrl ? (
              <img
                src={personal.profilePhotoUrl}
                alt={personal.fullName}
                className="relative w-full max-w-sm aspect-square object-cover rounded-xl"
              />
            ) : (
              <div
                className="relative w-full max-w-sm aspect-square rounded-xl flex items-center justify-center text-4xl font-bold text-white"
                style={{ background: "var(--color-accent)" }}
              >
                {personal?.fullName?.slice(0, 2).toUpperCase() ?? "ME"}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl font-bold">
              <span style={{ color: "var(--color-text)" }}>Why Hire </span>
              <span style={{ color: "var(--color-accent)" }}>me?</span>
            </h2>
            <p className="mt-4 text-base" style={{ color: "var(--color-textMuted)" }}>
              {bio}
            </p>
            <div className="flex gap-8 mt-8">
              <div ref={stat1.ref}>
                <p className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>
                  {stat1.value}+
                </p>
                <p className="text-sm" style={{ color: "var(--color-textMuted)" }}>Projects</p>
              </div>
              <div ref={stat2.ref}>
                <p className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>
                  {stat2.value}+
                </p>
                <p className="text-sm" style={{ color: "var(--color-textMuted)" }}>Experience</p>
              </div>
            </div>
            <a
              href="#contact"
              className="inline-block mt-8 rounded-[50px] px-6 py-3 font-medium border-2 border-[var(--color-text)]"
              style={{ color: "var(--color-text)" }}
            >
              Hire me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
