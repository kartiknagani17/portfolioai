"use client";

import { useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { Phone, Mail, MapPin } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

export default function ContactInfoBlocksFormGrid({
  portfolioData,
}: Props) {
  const { personal } = portfolioData;
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", budget: "", message: "" });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/portfolio-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-[50px] px-4 py-2 text-sm font-medium w-fit mb-6" style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}>
          Contact
        </div>
        <h2 className="text-center text-2xl md:text-4xl font-bold mb-4">
          <span style={{ color: "var(--color-text)" }}>Let&apos;s Discuss Your </span>
          <span style={{ color: "#22C55E" }}>Project</span>
        </h2>
        <p className="text-center mb-12" style={{ color: "var(--color-textMuted)" }}>
          Get in touch for a quote or collaboration.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-12">
          <div className="space-y-6">
            {personal?.phone && (
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: "var(--color-accent)" }}>
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase" style={{ color: "var(--color-textMuted)" }}>Phone</p>
                  <p className="text-[15px] font-semibold" style={{ color: "var(--color-text)" }}>{personal.phone}</p>
                </div>
              </div>
            )}
            {personal?.email && (
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: "var(--color-accent)" }}>
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase" style={{ color: "var(--color-textMuted)" }}>Email</p>
                  <p className="text-[15px] font-semibold" style={{ color: "var(--color-text)" }}>{personal.email}</p>
                </div>
              </div>
            )}
            {personal?.location && (
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: "var(--color-accent)" }}>
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase" style={{ color: "var(--color-textMuted)" }}>Location</p>
                  <p className="text-[15px] font-semibold" style={{ color: "var(--color-text)" }}>{personal.location}</p>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full name" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className="px-4 py-3 rounded border border-[var(--color-border)] focus:border-[#22C55E] focus:ring-2 focus:ring-green-200" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="px-4 py-3 rounded border border-[var(--color-border)] focus:border-[#22C55E] focus:ring-2 focus:ring-green-200" />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="px-4 py-3 rounded border border-[var(--color-border)] focus:border-[#22C55E] focus:ring-2 focus:ring-green-200" />
            <input type="text" placeholder="Budget" value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} className="px-4 py-3 rounded border border-[var(--color-border)] focus:border-[#22C55E] focus:ring-2 focus:ring-green-200" />
            <textarea placeholder="Message" rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="md:col-span-2 px-4 py-3 rounded border border-[var(--color-border)] focus:border-[#22C55E] focus:ring-2 focus:ring-green-200 resize-none" />
            <button type="submit" className="md:col-span-2 w-full py-4 font-medium text-white rounded" style={{ background: "#22C55E" }}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
