"use client";

import { useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { Mail } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ContactCTAEmailInline({
  portfolioData,
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/portfolio-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <h2 className="text-center text-2xl md:text-4xl font-bold mb-8">
        <span style={{ color: "var(--color-text)" }}>
          Have an Awesome Project Idea? Let&apos;s{" "}
        </span>
        <span style={{ color: "var(--color-accent)" }}>Discuss</span>
      </h2>
      <form onSubmit={handleSubmit} className="max-w-[480px] mx-auto">
        <div className="flex rounded-[50px] border-2 border-[var(--color-border)] overflow-hidden bg-white">
          <span className="pl-5 flex items-center text-[var(--color-textMuted)]">
            <Mail size={20} />
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-4 py-4 outline-none"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-6 py-4 font-medium text-white shrink-0"
            style={{ background: "var(--color-accent)" }}
          >
            Send
          </button>
        </div>
        {status === "success" && <p className="text-center mt-4 text-green-600">Thanks! We&apos;ll be in touch.</p>}
        {status === "error" && <p className="text-center mt-4 text-red-600">Please enter a valid email.</p>}
      </form>
      <p className="text-center mt-8 text-sm" style={{ color: "var(--color-textMuted)" }}>
        ⭐ 4.9/5 Average Ratings · 🏆 25+ Winning Awards · ✅ Certified
      </p>
    </section>
  );
}
