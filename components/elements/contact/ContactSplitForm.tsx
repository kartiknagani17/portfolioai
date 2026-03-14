"use client";

import { useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ContactSplitForm({
  portfolioData,
}: Props) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { personal } = portfolioData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    try {
      const res = await fetch("/api/portfolio-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-white border-t border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[38%_58%] gap-12">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold" style={{ color: "var(--color-text)" }}>
            Let&apos;s work
            <br />
            together
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--color-textMuted)" }}>
            Send a message and I&apos;ll get back to you.
          </p>
          <div className="flex gap-4 mt-6">
            {personal?.linkedinUrl && <a href={personal.linkedinUrl} className="text-[var(--color-textMuted)] hover:text-[var(--color-accent)]">LinkedIn</a>}
            {personal?.githubUrl && <a href={personal.githubUrl} className="text-[var(--color-textMuted)] hover:text-[var(--color-accent)]">GitHub</a>}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 rounded border-0 focus:bg-[#EEEEEE] transition-colors"
              style={{ background: "#F5F5F5" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 rounded border-0 focus:bg-[#EEEEEE] transition-colors"
              style={{ background: "#F5F5F5" }}
            />
          </div>
          <textarea
            placeholder="Message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full px-4 py-3 rounded border-0 focus:bg-[#EEEEEE] transition-colors resize-none"
            style={{ background: "#F5F5F5" }}
          />
          <button
            type="submit"
            className="w-full py-4 font-medium text-white rounded"
            style={{ background: "#1A1A1A" }}
          >
            Submit
          </button>
          {status === "success" && <p className="text-green-600 text-sm">Sent!</p>}
          {status === "error" && <p className="text-red-600 text-sm">Something went wrong.</p>}
        </form>
      </div>
    </section>
  );
}
