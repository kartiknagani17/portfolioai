"use client";

import { useState } from "react";
import type { PortfolioData, AssemblyConfig } from "@/types/portfolio";
import { Mail, MessageCircle } from "lucide-react";

interface Props {
  portfolioData: PortfolioData;
  layoutConfig: AssemblyConfig;
}

const DEFAULT_FAQS = [
  { q: "What services do you offer?", a: "Design, development, and consulting." },
  { q: "What's your availability?", a: "I'm available for new projects." },
  { q: "How do we get started?", a: "Send me a message and we'll schedule a call." },
];

export default function ContactFAQSplit({
  portfolioData,
  layoutConfig,
}: Props) {
  const [openIndex, setOpenIndex] = useState(0);
  const { personal } = portfolioData;
  const email = personal?.email ?? "";
  const phone = personal?.phone ?? "";
  const faqs = (layoutConfig.content as { faqs?: { q: string; a: string }[] })?.faqs ?? DEFAULT_FAQS;

  return (
    <section
      className="py-16 md:py-24 px-4"
      style={{ background: "#F0EDE8" }}
    >
      <h2 className="text-center text-2xl md:text-4xl font-bold mb-12" style={{ color: "var(--color-text)" }}>
        Get in Touch
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-2xl border p-8 bg-white" style={{ borderColor: "#E8E4DE" }}>
          <div className="w-16 h-16 rounded-full bg-[var(--color-border)] mb-6" />
          <h3 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
            Got a question? Let&apos;s chat.
          </h3>
          <p className="mt-2 text-base" style={{ color: "var(--color-textMuted)" }}>
            Reach out for projects or collaborations.
          </p>
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 mt-4" style={{ color: "var(--color-accent)" }}>
              <Mail size={20} /> {email}
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-2 mt-2" style={{ color: "#22C55E" }}>
              <MessageCircle size={20} /> {phone}
            </a>
          )}
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border overflow-hidden transition-all duration-300"
              style={{ borderColor: "#E8E4DE", background: "#fff" }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium" style={{ color: "var(--color-text)" }}>
                  {i + 1}. {faq.q}
                </span>
                <span className="text-xl">{openIndex === i ? "−" : "+"}</span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ height: openIndex === i ? "auto" : 0 }}
              >
                <p className="px-4 pb-4 text-sm" style={{ color: "var(--color-textMuted)" }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
