"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

function useCountUp(end: number, duration: number) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const startTime = performance.now();
          const step = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            setValue(Math.round(end * t));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { value, ref };
}

export default function StatsThreeDividerBar({
  portfolioData,
}: Props) {
  const exp = portfolioData.experience?.length ?? 0;
  const proj = portfolioData.projects?.length ?? 0;
  const s1 = useCountUp(exp + 10, 1500);
  const s2 = useCountUp(proj + 20, 1500);
  const s3 = useCountUp(exp + proj + 5, 1500);

  return (
    <section className="py-12 md:py-16 px-6 md:px-20 bg-white">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        <div ref={s1.ref} className="text-center">
          <p className="text-4xl md:text-5xl font-extrabold" style={{ color: "var(--color-accent)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {s1.value}+
          </p>
          <p className="text-base font-medium mt-1" style={{ color: "var(--color-text)" }}>Years</p>
        </div>
        <div className="w-px h-0 md:h-[60px] bg-[#D1D5DB] self-center" />
        <div ref={s2.ref} className="text-center">
          <p className="text-4xl md:text-5xl font-extrabold" style={{ color: "var(--color-accent)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {s2.value}+
          </p>
          <p className="text-base font-medium mt-1" style={{ color: "var(--color-text)" }}>Projects</p>
        </div>
        <div className="w-px h-0 md:h-[60px] bg-[#D1D5DB] self-center" />
        <div ref={s3.ref} className="text-center">
          <p className="text-4xl md:text-5xl font-extrabold" style={{ color: "var(--color-accent)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            {s3.value}+
          </p>
          <p className="text-base font-medium mt-1" style={{ color: "var(--color-text)" }}>Clients</p>
        </div>
      </div>
    </section>
  );
}
