"use client"

import { useEffect, useRef, useState } from "react"
import type { PortfolioData } from "@/types/portfolio"

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 4) // quartic ease-out
      setVal(Math.round(ease * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])
  return val
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/** Slides text up from beneath a clip mask — luxury-brand style reveal */
function Lift({
  children, delay = 0, visible, tag = "div", style = {},
}: {
  children: React.ReactNode; delay?: number; visible: boolean
  tag?: "div" | "h2" | "span"; style?: React.CSSProperties
}) {
  const Tag = tag as any
  return (
    <div style={{ overflow: "hidden" }}>
      <Tag style={{
        display: "block",
        transform: visible ? "translateY(0)" : "translateY(110%)",
        transition: `transform 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}>{children}</Tag>
    </div>
  )
}

/** Section header — label + big italic title + drawing underline */
function SectionHeader({ label, title }: { label: string; title: string }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{ marginBottom: 72 }}>
      <div style={{ overflow: "hidden", marginBottom: 14 }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.24em",
          textTransform: "uppercase", color: "var(--t2-accent)",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}>{label}</div>
      </div>
      <div style={{ overflow: "hidden", marginBottom: 14 }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
          fontWeight: 400, fontStyle: "italic",
          color: "#1A1A1A", lineHeight: 1.08, margin: 0,
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.95s cubic-bezier(0.16,1,0.3,1) 0.08s",
        }}>{title}</h2>
      </div>
      {/* Drawing underline */}
      <svg width="100%" height="3" style={{ display: "block", overflow: "visible" }}>
        <line x1="0" y1="1.5" x2="100%" y2="1.5" stroke="#E5DED5" strokeWidth="1" />
        <line x1="0" y1="1.5" x2="100%" y2="1.5"
          stroke="var(--t2-accent)" strokeWidth="2" strokeLinecap="round"
          strokeDasharray="3000" strokeDashoffset={visible ? 0 : 3000}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1) 0.45s" }} />
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT — big decorative quote + counting stats
// ─────────────────────────────────────────────────────────────────────────────

function StatCount({ value, label }: { value: number; label: string }) {
  const { ref, visible } = useReveal()
  const count = useCountUp(value, visible)
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
        fontStyle: "italic", color: "#1A1A1A",
        lineHeight: 1, letterSpacing: "-0.02em",
      }}>{count}</div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
        textTransform: "uppercase", color: "#A09890", marginTop: 10,
      }}>{label}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE — editorial cards with ghost stroke company name
// ─────────────────────────────────────────────────────────────────────────────

function ExpCard({ exp, index }: { exp: PortfolioData["experience"][0]; index: number }) {
  const { ref, visible } = useReveal()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        marginBottom: 16, borderRadius: 20,
        background: hovered ? "#F0F7F4" : "#FFFCF7",
        border: "1px solid #E0D9D0",
        overflow: "hidden",
        transition: `background 0.5s ease, opacity 0.75s ease ${index * 100}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${index % 2 === 0 ? "-52px" : "52px"})`,
      }}
    >
      {/* ── Animated left border bar ── */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: 3, borderRadius: "0 3px 3px 0",
        background: "linear-gradient(180deg, var(--t2-accent), #52B788)",
        height: visible ? "100%" : "0%",
        transition: `height 1.1s cubic-bezier(0.16,1,0.3,1) ${index * 100 + 250}ms`,
      }} />

      {/* ── Ghost stroke company name ── */}
      <div style={{
        position: "absolute",
        right: -12, top: "50%",
        transform: hovered ? "translateY(-50%) translateX(-8px)" : "translateY(-50%) translateX(0)",
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(3rem, 5.5vw, 5.5rem)",
        fontStyle: "italic",
        color: "transparent",
        WebkitTextStroke: `1px ${hovered ? "rgba(45,106,79,0.18)" : "rgba(0,0,0,0.065)"}`,
        whiteSpace: "nowrap",
        userSelect: "none", pointerEvents: "none",
        letterSpacing: "-0.02em", lineHeight: 1,
        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}>{exp.companyName}</div>

      {/* ── Content grid ── */}
      <div className="t2-exp-inner" style={{
        position: "relative",
        display: "grid", gridTemplateColumns: "220px 1fr",
        gap: "0 44px", padding: "36px 40px",
      }}>
        <div>
          {/* Date badge */}
          <div style={{
            display: "inline-block",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--t2-accent)",
            background: "rgba(45,106,79,0.1)",
            padding: "5px 12px", borderRadius: 100,
            marginBottom: 14,
          }}>
            {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
          </div>

          {/* Role — clip reveal */}
          <div style={{ overflow: "hidden", marginBottom: 8 }}>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.15rem, 2vw, 1.45rem)",
              fontStyle: "italic", color: "#1A1A1A",
              lineHeight: 1.25,
              transform: visible ? "translateY(0)" : "translateY(110%)",
              transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 100 + 120}ms`,
            }}>{exp.roleTitle}</div>
          </div>

          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 600,
            color: "#5A5248",
          }}>{exp.companyName}</div>
          {exp.location && (
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, color: "#9A9189", marginTop: 3,
            }}>{exp.location}</div>
          )}
        </div>

        {/* Description — fades in */}
        <div style={{
          display: "flex", alignItems: "center",
          opacity: visible ? 1 : 0,
          transition: `opacity 0.8s ease ${index * 100 + 350}ms`,
        }}>
          {exp.description && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, color: "#5A5248",
              lineHeight: 1.82, margin: 0,
            }}>{exp.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — full-width editorial rows with sweep hover + marquee ticker
// ─────────────────────────────────────────────────────────────────────────────

function ProjectRow({ proj, index }: { proj: PortfolioData["projects"][0]; index: number }) {
  const { ref, visible } = useReveal()
  const [hovered, setHovered] = useState(false)
  const num = String(index + 1).padStart(2, "0")

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "40px 16px",
        borderBottom: "1px solid #DDD5C8",
        overflow: "hidden",
        cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
      }}
    >
      {/* Hover color sweep from left */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(105deg, rgba(45,106,79,0.07) 0%, rgba(82,183,136,0.03) 100%)",
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)",
      }} />

      {/* Row 1: index + big project name */}
      <div style={{
        position: "relative",
        display: "flex", alignItems: "baseline",
        gap: 20, marginBottom: 18,
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 13, fontStyle: "italic",
          color: hovered ? "var(--t2-accent)" : "#C0B8B0",
          transition: "color 0.35s ease",
          flexShrink: 0, minWidth: 28,
        }}>{num}</span>

        <div style={{ overflow: "hidden", flex: 1 }}>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.75rem, 3.2vw, 2.8rem)",
            fontStyle: "italic", lineHeight: 1.1, color: "#1A1A1A",
            letterSpacing: hovered ? "0.02em" : "0em",
            transform: visible ? "translateY(0)" : "translateY(110%)",
            transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 100 + 80}ms, letter-spacing 0.5s ease`,
          }}>{proj.projectName}</div>
        </div>
      </div>

      {/* Row 2: description + tech + links */}
      <div
        className="t2-proj-detail"
        style={{
          position: "relative",
          display: "grid", gridTemplateColumns: "1fr auto",
          gap: "0 40px", alignItems: "center",
          marginLeft: 48,
          opacity: visible ? 1 : 0,
          transition: `opacity 0.7s ease ${index * 100 + 250}ms`,
        }}
      >
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, color: "#6B6259", lineHeight: 1.78, margin: 0,
          maxWidth: 560,
        }}>{proj.description}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", minWidth: 140 }}>
          {/* Tech ticker */}
          {proj.techStack.length > 0 && (
            <div style={{ overflow: "hidden", maxWidth: 200, textAlign: "right" }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11, color: "#9A9189",
                letterSpacing: "0.04em", lineHeight: 1.7,
                whiteSpace: "normal", textAlign: "right",
              }}>
                {proj.techStack.join("  ·  ")}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 14 }}>
            {proj.liveUrl && (
              <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 700, color: "var(--t2-accent)",
                textDecoration: "none", borderBottom: "1.5px solid var(--t2-accent)",
                paddingBottom: 1,
              }}>Live ↗</a>
            )}
            {proj.githubUrl && (
              <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 700, color: "#8A8078",
                textDecoration: "none", borderBottom: "1.5px solid #DDD5C8",
                paddingBottom: 1,
              }}>Code ↗</a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS — staggered chip pop-in with group headings
// ─────────────────────────────────────────────────────────────────────────────

function SkillChip({ name, delay, visible }: { name: string; delay: number; visible: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, fontWeight: 500,
        color: hov ? "#FFFCF7" : "#3A3530",
        background: hov ? "var(--t2-accent)" : "#FFFCF7",
        border: `1.5px solid ${hov ? "var(--t2-accent)" : "#D8D0C7"}`,
        padding: "8px 18px", borderRadius: 100,
        cursor: "default",
        // Entry animation
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.82) translateY(14px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, background 0.22s, color 0.22s, border-color 0.22s`,
      }}
    >{name}</span>
  )
}

function SkillGroup({
  category, items, groupIdx, visible,
}: { category: string; items: string[]; groupIdx: number; visible: boolean }) {
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.65s ease ${groupIdx * 90}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${groupIdx * 90}ms`,
    }}>
      <div style={{ overflow: "hidden", marginBottom: 16 }}>
        <div style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 18, fontStyle: "italic",
          color: "var(--t2-accent)",
          paddingBottom: 10,
          borderBottom: "1px solid #DDD5C8",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${groupIdx * 90 + 60}ms`,
        }}>{category}</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((skill, si) => (
          <SkillChip
            key={si} name={skill} visible={visible}
            delay={groupIdx * 80 + si * 45}
          />
        ))}
      </div>
    </div>
  )
}

function SkillsGrid({ skills }: { skills: PortfolioData["skills"] }) {
  const { ref, visible } = useReveal()
  const grouped: Record<string, string[]> = {}
  skills.forEach(s => {
    if (!grouped[s.category]) grouped[s.category] = []
    grouped[s.category].push(s.name)
  })
  return (
    <div ref={ref} style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
      gap: "44px 32px",
    }}>
      {Object.entries(grouped).map(([cat, items], gi) => (
        <SkillGroup key={cat} category={cat} items={items} groupIdx={gi} visible={visible} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION — ghost year + animated gradient rule
// ─────────────────────────────────────────────────────────────────────────────

function EduRow({ edu, index }: { edu: PortfolioData["education"][0]; index: number }) {
  const { ref, visible } = useReveal()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "52px 0",
        borderBottom: "1px solid #DDD5C8",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-32px)",
        transition: `opacity 0.75s ease ${index * 100}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
      }}
    >
      {/* Ghost year — massive stroke text in background */}
      {(edu.endYear || edu.startYear) && (
        <div style={{
          position: "absolute",
          right: -16, top: "50%",
          transform: hovered ? "translateY(-50%) translateX(-10px)" : "translateY(-50%) translateX(0)",
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(5rem, 12vw, 10rem)",
          fontStyle: "italic", lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `1.5px ${hovered ? "rgba(45,106,79,0.14)" : "rgba(0,0,0,0.055)"}`,
          userSelect: "none", pointerEvents: "none",
          transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
          opacity: visible ? 1 : 0,
          transitionDelay: `${index * 100 + 300}ms, ${index * 100 + 300}ms`,
        }}>{edu.endYear || edu.startYear}</div>
      )}

      {/* Content */}
      <div style={{ position: "relative", maxWidth: "70%" }}>
        <div style={{ overflow: "hidden", marginBottom: 10 }}>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.5rem, 3vw, 2.3rem)",
            fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.15,
            transform: visible ? "translateY(0)" : "translateY(110%)",
            transition: `transform 0.95s cubic-bezier(0.16,1,0.3,1) ${index * 100 + 80}ms`,
          }}>
            {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
          </div>
        </div>

        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 600,
          color: "var(--t2-accent)", marginBottom: 6,
          opacity: visible ? 1 : 0,
          transition: `opacity 0.7s ease ${index * 100 + 200}ms`,
        }}>{edu.institution}</div>

        {(edu.startYear || edu.endYear) && (
          <div style={{
            display: "inline-block",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#9A9189", background: "#EDE8E1",
            padding: "5px 14px", borderRadius: 100,
            opacity: visible ? 1 : 0,
            transition: `opacity 0.7s ease ${index * 100 + 280}ms`,
          }}>
            {edu.startYear && edu.endYear
              ? `${edu.startYear} – ${edu.endYear}`
              : edu.endYear || edu.startYear}
          </div>
        )}
      </div>

      {/* Animated gradient rule */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 2, borderRadius: 2,
        background: "linear-gradient(90deg, var(--t2-accent) 0%, rgba(82,183,136,0.4) 60%, transparent 100%)",
        width: visible ? (hovered ? "75%" : "45%") : "0%",
        transition: hovered
          ? "width 0.5s cubic-bezier(0.16,1,0.3,1)"
          : `width 1.3s cubic-bezier(0.16,1,0.3,1) ${index * 100 + 400}ms`,
      }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATIONS — premium cards with shimmer hover
// ─────────────────────────────────────────────────────────────────────────────

function CertCard({ cert, index }: { cert: NonNullable<PortfolioData["certifications"]>[0]; index: number }) {
  const { ref, visible } = useReveal()
  const [hov, setHov] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        padding: "28px 32px", borderRadius: 16,
        background: "#FFFCF7",
        border: `1.5px solid ${hov ? "var(--t2-accent)" : "#DDD5C8"}`,
        overflow: "hidden",
        cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms, border-color 0.3s`,
      }}
    >
      {/* Top accent strip that grows on hover */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        height: 3, borderRadius: "16px 16px 0 0",
        background: "linear-gradient(90deg, var(--t2-accent), #52B788)",
        width: hov ? "100%" : "0%",
        transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
      }} />

      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, fontWeight: 700, color: "#1A1A1A",
        marginBottom: 8, lineHeight: 1.4,
      }}>{cert.name}</div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12, fontWeight: 600,
        color: "var(--t2-accent)",
        marginBottom: cert.relevance ? 8 : 0,
      }}>{cert.issuer}{cert.date ? `  ·  ${cert.date}` : ""}</div>
      {cert.relevance && (
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: "#8A8078", lineHeight: 1.6,
        }}>{cert.relevance}</div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGES — animated fill bars with bold typographic treatment
// ─────────────────────────────────────────────────────────────────────────────

const PROF_PCT: Record<string, number> = {
  Native: 100, Fluent: 85, Professional: 70, Conversational: 50, Basic: 28,
}

function LangBar({ language, proficiency, index }: {
  language: string; proficiency: string; index: number
}) {
  const { ref, visible } = useReveal()
  const pct = PROF_PCT[proficiency] ?? 50

  return (
    <div ref={ref} style={{
      display: "grid", gridTemplateColumns: "1fr auto",
      gap: "0 32px", alignItems: "center",
      padding: "22px 0", borderBottom: "1px solid #EDE8E1",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(18px)",
      transition: `opacity 0.65s ease ${index * 110}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms`,
    }}>
      <div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, fontWeight: 600, color: "#1A1A1A",
          marginBottom: 10,
        }}>{language}</div>
        {/* Track */}
        <div style={{ height: 5, borderRadius: 100, background: "#EDE8E1", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 100,
            background: `linear-gradient(90deg, var(--t2-accent) 0%, #52B788 100%)`,
            width: visible ? `${pct}%` : "0%",
            transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${index * 110 + 200}ms`,
          }} />
        </div>
      </div>
      <div style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 17, fontStyle: "italic",
        color: "var(--t2-accent)",
        whiteSpace: "nowrap",
      }}>{proficiency}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERESTS — scattered rotation cloud with hover snap
// ─────────────────────────────────────────────────────────────────────────────

const ROT  = [-2.2, 1.8, -1, 3, -2.5, 1.2, -1.8, 2.4, -0.8, 2.8, -1.5, 1.5]
const FSIZ = [1.05, 0.9, 1.22, 1.0, 1.16, 0.88, 1.1, 1.28, 0.94, 1.08, 1.18, 0.92]

function InterestCloud({ interests }: { interests: string[] }) {
  const { ref, visible } = useReveal()
  const [hovIdx, setHovIdx] = useState<number | null>(null)

  return (
    <div ref={ref} style={{
      display: "flex", flexWrap: "wrap",
      gap: "18px 28px", alignItems: "baseline",
      padding: "8px 0",
    }}>
      {interests.map((item, i) => {
        const rot  = ROT[i % ROT.length]
        const size = FSIZ[i % FSIZ.length]
        const isHov = hovIdx === i

        return (
          <span key={i}
            onMouseEnter={() => setHovIdx(i)}
            onMouseLeave={() => setHovIdx(null)}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: `${size * 1.2}rem`,
              fontStyle: "italic",
              display: "inline-block",
              cursor: "default",
              color: isHov ? "var(--t2-accent)" : "#3A3530",
              transform: !visible
                ? `rotate(${rot}deg) translateY(20px)`
                : isHov
                ? "rotate(0deg) translateY(-4px) scale(1.06)"
                : `rotate(${rot}deg) translateY(0)`,
              opacity: visible ? 1 : 0,
              transition: `opacity 0.55s ease ${i * 65}ms, transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${visible ? "0ms" : `${i * 65}ms`}, color 0.25s`,
            }}
          >{item}</span>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE NAV
// ─────────────────────────────────────────────────────────────────────────────

function MobileMenu({ sections, onNav, email }: {
  sections: string[]; onNav: (id: string) => void; email?: string
}) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <button onClick={() => setOpen(!open)} className="t2-hamburger" aria-label="Menu"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            display: "block", width: 22, height: 2, background: "#1A1A1A",
            borderRadius: 2, marginBottom: i < 2 ? 5 : 0,
            transformOrigin: "center",
            transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
            ...(open && i === 0 ? { transform: "rotate(45deg) translate(5px, 5px)" } : {}),
            ...(open && i === 1 ? { opacity: 0, transform: "scaleX(0)" } : {}),
            ...(open && i === 2 ? { transform: "rotate(-45deg) translate(5px, -5px)" } : {}),
          }} />
        ))}
      </button>

      <div style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "var(--t2-bg)",
        display: "flex", flexDirection: "column",
        padding: "80px 32px 48px",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "all" : "none",
        transition: "opacity 0.35s ease",
      }}>
        <button onClick={() => setOpen(false)} style={{
          position: "absolute", top: 20, right: 24,
          background: "none", border: "none",
          fontSize: 30, cursor: "pointer", color: "#1A1A1A",
        }}>×</button>

        {sections.map((id, i) => (
          <button key={id} onClick={() => { onNav(id); setOpen(false) }} style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "2rem", fontStyle: "italic",
            color: "#1A1A1A", background: "none", border: "none",
            textAlign: "left", padding: "14px 0",
            borderBottom: "1px solid #EDE8E1", cursor: "pointer",
            transform: open ? "translateX(0)" : "translateX(-24px)",
            opacity: open ? 1 : 0,
            transition: `transform 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms, opacity 0.4s ease ${i * 55}ms`,
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--t2-accent)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#1A1A1A" }}
          >{id.charAt(0).toUpperCase() + id.slice(1)}</button>
        ))}

        {email && (
          <a href={`mailto:${email}`} style={{
            marginTop: 36,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, fontWeight: 700,
            color: "#FFFCF7", background: "var(--t2-accent)",
            padding: "16px 28px", borderRadius: 100,
            textDecoration: "none", textAlign: "center",
            display: "inline-block",
            transform: open ? "translateX(0)" : "translateX(-24px)",
            opacity: open ? 1 : 0,
            transition: `transform 0.45s cubic-bezier(0.16,1,0.3,1) ${sections.length * 55}ms, opacity 0.4s ease ${sections.length * 55}ms`,
          }}>Get in touch</a>
        )}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT SECTION — decorative quote mark + bio + counting stats
// ─────────────────────────────────────────────────────────────────────────────

function AboutSection({ bio, counts }: { bio: string; counts: { value: number; label: string }[] }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className="t2-about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px" }}>
      {/* Left — decorative quote + bio */}
      <div style={{ position: "relative" }}>
        {/* Giant decorative open-quote */}
        <div style={{
          position: "absolute",
          top: -28, left: -12,
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(7rem, 12vw, 11rem)",
          fontStyle: "italic", lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(45,106,79,0.12)",
          userSelect: "none", pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.1s ease 0.3s",
        }}>"</div>
        <div style={{ overflow: "hidden", marginBottom: 0, paddingTop: 16 }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16, lineHeight: 1.88, color: "#3A3530",
            margin: 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}>{bio}</p>
        </div>
      </div>

      {/* Right — stats */}
      <div style={{
        display: "flex", flexDirection: "column",
        justifyContent: "center", gap: "clamp(28px, 4vw, 44px)",
        padding: "16px 0 16px 40px",
        borderLeft: "1px solid #DDD5C8",
      }}>
        {counts.map((s, i) => <StatCount key={i} value={s.value} label={s.label} />)}
      </div>
    </div>
  )
}

function WorkStyleCard({ card, index }: { card: { title: string; body: string }; index: number }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className="t2-workstyle-card" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s` }}>
      <div className="t2-workstyle-num">0{index + 1}</div>
      <div className="t2-workstyle-title">{card.title}</div>
      {card.body && <div className="t2-workstyle-body">{card.body}</div>}
    </div>
  )
}

function CareerStoryText({ text }: { text: string }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className="t2-career-body" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s" }}>
      {text}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

export default function Template2({ portfolioData }: { portfolioData: PortfolioData }) {
  const { personal } = portfolioData
  const experience     = portfolioData.experience     || []
  const projects       = portfolioData.projects       || []
  const skills         = portfolioData.skills         || []
  const education      = portfolioData.education      || []
  const certifications = portfolioData.certifications || []
  const languages      = portfolioData.languages      || []
  const interests      = portfolioData.interests      || []
  const tagline        = portfolioData.tagline        || ""
  const careerStory    = portfolioData.careerStory    || ""
  const workStyle      = portfolioData.workStyle      || ""
  const lookingFor     = portfolioData.lookingFor     || ""

  const hasBio        = !!personal?.bio?.trim()
  const hasExperience = experience.length > 0
  const hasProjects   = projects.length > 0
  const hasSkills     = skills.length > 0
  const hasEducation  = education.length > 0
  const hasCerts      = certifications.length > 0
  const hasLanguages  = languages.length > 0
  const hasInterests  = interests.length > 0
  const hasTagline    = !!tagline.trim()
  const hasCareerStory = !!careerStory.trim()
  const hasWorkStyle  = !!workStyle.trim()
  const hasLookingFor = !!lookingFor.trim()

  const workStyleCards: { title: string; body: string }[] = (() => {
    if (!workStyle) return []
    const sentences = workStyle.split(/(?<=[.!?])\s+/).filter(Boolean)
    const cards: { title: string; body: string }[] = []
    for (let i = 0; i < sentences.length && cards.length < 4; i++) {
      const title = sentences[i].replace(/[.!?]$/, "")
      const body = sentences[i + 1] ?? ""
      cards.push({ title, body })
      if (body) i++
    }
    return cards
  })()

  const ALL_NAV = [
    hasBio        && "about",
    hasExperience && "experience",
    hasProjects   && "projects",
    hasSkills     && "skills",
    hasEducation  && "education",
    hasCerts      && "certifications",
    hasLanguages  && "languages",
    hasInterests  && "interests",
  ].filter(Boolean) as string[]

  const aboutCounts = [
    hasExperience && { value: experience.length, label: experience.length === 1 ? "Role" : "Roles" },
    hasProjects   && { value: projects.length,   label: "Projects" },
    hasSkills     && { value: skills.length,     label: "Skills" },
  ].filter(Boolean) as { value: number; label: string }[]

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 70)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const [heroIn, setHeroIn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setHeroIn(true), 100); return () => clearTimeout(t) }, [])

  const scrollTo = (id: string) => {
    document.getElementById(`t2-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const firstName = personal?.fullName?.split(" ")[0] || ""
  const lastName  = personal?.fullName?.split(" ").slice(1).join(" ") || ""

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --t2-accent: #2D6A4F; --t2-bg: #F7F3EE; }
        html { scroll-behavior: smooth; }

        .t2-wrap {
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          background: var(--t2-bg);
          min-height: 100vh;
          color: #1A1A1A;
        }

        /* NAV */
        .t2-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 0.4s ease, border-color 0.4s ease;
        }
        .t2-nav.t2-scrolled {
          background: rgba(247,243,238,0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }
        .t2-nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 26px 52px;
          transition: padding 0.4s ease;
        }
        .t2-nav.t2-scrolled .t2-nav-inner { padding: 16px 52px; }
        .t2-nav-name {
          font-family: 'DM Serif Display', serif;
          font-size: 18px; font-style: italic; color: #1A1A1A;
          opacity: 0; transition: opacity 0.7s ease 0.5s;
        }
        .t2-nav-name.in { opacity: 1; }
        .t2-nav-links { display: flex; gap: 30px; align-items: center; }
        .t2-nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          color: #6B6259; letter-spacing: 0.09em; text-transform: uppercase;
          background: none; border: none; cursor: pointer;
          position: relative; padding-bottom: 2px;
          transition: color 0.22s;
        }
        .t2-nav-link::after {
          content: ''; position: absolute;
          bottom: 0; left: 0; width: 0; height: 1.5px;
          background: var(--t2-accent);
          transition: width 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .t2-nav-link:hover { color: var(--t2-accent); }
        .t2-nav-link:hover::after { width: 100%; }
        .t2-nav-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          color: var(--t2-bg); background: var(--t2-accent);
          padding: 10px 22px; border-radius: 100px;
          text-decoration: none; letter-spacing: 0.07em;
          transition: opacity 0.22s, transform 0.22s;
        }
        .t2-nav-cta:hover { opacity: 0.84; transform: translateY(-1px); }

        /* LAYOUT */
        .t2-section {
          max-width: 1200px; margin: 0 auto;
          padding: 100px 52px;
        }
        .t2-rule { border: none; border-top: 1px solid #DDD5C8; }
        .t2-rule-wrap { max-width: 1200px; margin: 0 auto; }

        /* HERO */
        .t2-hero { padding-top: 188px; }
        .t2-hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 0 80px;
          align-items: flex-start;
        }

        /* ABOUT */
        .t2-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 80px; }

        /* PROJECTS */
        .t2-proj-detail { display: grid; grid-template-columns: 1fr auto; gap: 0 40px; }

        /* EXPERIENCE inner grid */
        .t2-exp-inner { display: grid; grid-template-columns: 220px 1fr; gap: 0 44px; }

        /* CERT GRID */
        .t2-cert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(265px, 1fr)); gap: 16px; }

        /* TAGLINE BAND */
        .t2-tagline-band {
          background: #1A1A1A; padding: 80px 52px;
          max-width: 100%; overflow: hidden;
        }
        .t2-tagline-text {
          font-family: 'DM Serif Display', serif; font-style: italic;
          font-size: clamp(2rem, 4.5vw, 4.2rem); color: #F7F3EE; line-height: 1.2;
          max-width: 1100px; margin: 0 auto;
        }
        .t2-tagline-text em { color: var(--t2-accent); font-style: normal; }

        /* CAREER STORY */
        .t2-career-story {
          padding: 100px 52px; max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 200px 1fr; gap: 64px; align-items: start;
        }
        .t2-career-label-vert {
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase; color: var(--t2-accent);
          writing-mode: vertical-rl; transform: rotate(180deg);
          border-left: 2px solid var(--t2-accent); padding-left: 12px; align-self: start;
        }
        .t2-career-body {
          font-family: 'DM Serif Display', serif; font-style: italic;
          font-size: clamp(1.1rem, 2vw, 1.6rem); line-height: 1.75; color: #3A3530;
        }

        /* WORK STYLE */
        .t2-workstyle-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .t2-workstyle-card {
          border: 1px solid #DDD5C8; border-radius: 12px; padding: 28px;
          background: #FFFCF7; position: relative; overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .t2-workstyle-card::before {
          content: ''; position: absolute; inset: 0;
          background: var(--t2-accent); opacity: 0;
          transition: opacity 0.3s;
        }
        .t2-workstyle-card:hover { border-color: var(--t2-accent); box-shadow: 0 8px 28px rgba(45,106,79,0.12); }
        .t2-workstyle-num {
          font-family: 'DM Serif Display', serif; font-size: 52px; font-style: italic;
          color: #E8E0D4; line-height: 1; margin-bottom: 16px; position: relative;
        }
        .t2-workstyle-title { font-size: 15px; font-weight: 700; color: #1A1A1A; margin-bottom: 8px; position: relative; }
        .t2-workstyle-body { font-size: 14px; color: #8A8078; line-height: 1.7; position: relative; }

        /* LOOKING FOR */
        .t2-looking-section { padding: 100px 52px; background: var(--t2-accent); }
        .t2-looking-inner { max-width: 1200px; margin: 0 auto; }
        .t2-looking-label {
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.6);
          margin-bottom: 28px;
        }
        .t2-looking-text {
          font-family: 'DM Serif Display', serif; font-style: italic;
          font-size: clamp(1.1rem, 2vw, 1.5rem); color: #fff; line-height: 1.8;
          max-width: 860px; columns: 2; column-gap: 52px;
        }
        @media (max-width: 700px) { .t2-looking-text { columns: 1; } .t2-career-story { grid-template-columns: 1fr; gap: 24px; } }

        /* CONTACT STRIP */
        .t2-footer { background: #FFFCF7; border-top: 1px solid #DDD5C8; }

        /* HAMBURGER — hidden on desktop, shown on mobile */
        .t2-hamburger { display: none !important; }

        @media (max-width: 960px) {
          .t2-nav-links { display: none; }
          .t2-hamburger { display: flex !important; flex-direction: column; }
          .t2-section { padding: 72px 32px; }
          .t2-hero { padding-top: 128px; }
          .t2-hero-grid { grid-template-columns: 1fr; gap: 44px 0; }
          .t2-about-grid { grid-template-columns: 1fr; gap: 48px 0; }
          .t2-about-grid > div:last-child { border-left: none !important; padding-left: 0 !important; border-top: 1px solid #DDD5C8; padding-top: 40px; flex-direction: row !important; flex-wrap: wrap; gap: 36px !important; }
          .t2-exp-inner { grid-template-columns: 1fr; gap: 16px 0; }
          .t2-proj-detail { grid-template-columns: 1fr; gap: 16px 0; }
          .t2-proj-detail > div:last-child { align-items: flex-start !important; }
          .t2-nav-inner { padding: 18px 28px; }
          .t2-nav.t2-scrolled .t2-nav-inner { padding: 14px 28px; }
        }

        @media (max-width: 600px) {
          .t2-section { padding: 56px 20px; }
          .t2-hero { padding-top: 108px; }
          .t2-nav-inner { padding: 16px 20px; }
          .t2-nav.t2-scrolled .t2-nav-inner { padding: 12px 20px; }
          .t2-cert-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="t2-wrap">

        {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
        <nav className={`t2-nav${scrolled ? " t2-scrolled" : ""}`}>
          <div className="t2-nav-inner">
            <div className={`t2-nav-name${heroIn ? " in" : ""}`}>{personal?.fullName}</div>
            <div className="t2-nav-links">
              {ALL_NAV.map(id => (
                <button key={id} className="t2-nav-link" onClick={() => scrollTo(id)}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
              {personal?.email && (
                <a href={`mailto:${personal.email}`} className="t2-nav-cta">Contact</a>
              )}
            </div>
            <MobileMenu sections={ALL_NAV} onNav={scrollTo} email={personal?.email} />
          </div>
        </nav>

        {/* ══ HERO ═════════════════════════════════════════════════════════════ */}
        <div className="t2-section t2-hero">
          <div className="t2-hero-grid">

            {/* Left — giant name stacked */}
            <div>
              <div style={{ overflow: "hidden", marginBottom: 2 }}>
                <div style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(3.5rem, 7.5vw, 7rem)",
                  fontWeight: 400, lineHeight: 0.98,
                  letterSpacing: "-0.025em", color: "#1A1A1A",
                  transform: heroIn ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 1s cubic-bezier(0.16,1,0.3,1) 0.05s",
                }}>{firstName}</div>
              </div>
              <div style={{ overflow: "hidden", marginBottom: 32 }}>
                <div style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(3.5rem, 7.5vw, 7rem)",
                  fontWeight: 400, fontStyle: "italic", lineHeight: 0.98,
                  letterSpacing: "-0.025em", color: "var(--t2-accent)",
                  transform: heroIn ? "translateY(0)" : "translateY(110%)",
                  transition: "transform 1s cubic-bezier(0.16,1,0.3,1) 0.16s",
                }}>{lastName || firstName}</div>
              </div>

              {/* Animated rule */}
              <svg width="100%" height="4" style={{ display: "block", marginBottom: 28, overflow: "visible" }}>
                <line x1="0" y1="2" x2="100%" y2="2" stroke="#E5DED5" strokeWidth="1" />
                <line x1="0" y1="2" x2="100%" y2="2"
                  stroke="var(--t2-accent)" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray="3000" strokeDashoffset={heroIn ? 0 : 3000}
                  style={{ transition: "stroke-dashoffset 1.7s cubic-bezier(0.16,1,0.3,1) 0.65s" }} />
              </svg>

              {/* Contact row */}
              <div style={{
                display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 0",
                opacity: heroIn ? 1 : 0,
                transition: "opacity 0.7s ease 1.2s",
              }}>
                {[personal?.location, personal?.email, personal?.phone]
                  .filter(Boolean)
                  .map((item, i) => (
                    <span key={i} style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13, color: "#7A7065", fontWeight: 400,
                    }}>
                      {i > 0 && <span style={{ margin: "0 12px", color: "#C8C0B6" }}>·</span>}
                      {item}
                    </span>
                  ))}
              </div>
            </div>

            {/* Right — role + bio + social links */}
            <div style={{
              paddingTop: 10,
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.8s ease 0.6s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s",
            }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "var(--t2-accent)",
                marginBottom: 20,
              }}>{personal?.professionalTitle}</div>

              {hasBio && (
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16, lineHeight: 1.84, color: "#5A5248",
                  marginBottom: 36, maxWidth: 430,
                }}>{personal.bio}</p>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  personal?.linkedinUrl && { label: "LinkedIn", href: personal.linkedinUrl },
                  personal?.githubUrl   && { label: "GitHub",   href: personal.githubUrl },
                  personal?.websiteUrl  && { label: "Website",  href: personal.websiteUrl },
                ].filter(Boolean).map((s: any, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12, fontWeight: 600, color: "#3A3530",
                      textDecoration: "none", padding: "11px 22px",
                      borderRadius: 100, border: "1.5px solid #C8C0B6",
                      transition: "border-color 0.25s, color 0.25s, transform 0.25s",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget
                      el.style.borderColor = "var(--t2-accent)"
                      el.style.color = "var(--t2-accent)"
                      el.style.transform = "translateY(-2px)"
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.borderColor = "#C8C0B6"
                      el.style.color = "#3A3530"
                      el.style.transform = "translateY(0)"
                    }}
                  >{s.label} ↗</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ TAGLINE ══════════════════════════════════════════════════════════ */}
        {hasTagline && (
          <div className="t2-tagline-band">
            <p className="t2-tagline-text">
              {tagline.split(/(revenue|growth|impact|results|success|innovation|scale)/i).map((part, i) =>
                /revenue|growth|impact|results|success|innovation|scale/i.test(part)
                  ? <em key={i}>{part}</em>
                  : part
              )}
            </p>
          </div>
        )}

        {/* ══ ABOUT ════════════════════════════════════════════════════════════ */}
        {hasBio && (
          <>
            <div className="t2-rule-wrap"><hr className="t2-rule" /></div>
            <div className="t2-section" id="t2-about">
              <SectionHeader label="Introduction" title="About Me" />
              <AboutSection bio={personal.bio} counts={aboutCounts} />
            </div>
          </>
        )}

        {/* ══ CAREER STORY ════════════════════════════════════════════════════ */}
        {hasCareerStory && (
          <>
            <div className="t2-rule-wrap"><hr className="t2-rule" /></div>
            <div className="t2-career-story" id="t2-career-story">
              <div className="t2-career-label-vert">Career Story</div>
              <div>
                <CareerStoryText text={careerStory} />
              </div>
            </div>
          </>
        )}

        {/* ══ EXPERIENCE ═══════════════════════════════════════════════════════ */}
        {hasExperience && (
          <>
            <div className="t2-rule-wrap"><hr className="t2-rule" /></div>
            <div className="t2-section" id="t2-experience">
              <SectionHeader label="Career" title="Work Experience" />
              {experience.map((exp, i) => <ExpCard key={i} exp={exp} index={i} />)}
            </div>
          </>
        )}

        {/* ══ PROJECTS ═════════════════════════════════════════════════════════ */}
        {hasProjects && (
          <>
            <div className="t2-rule-wrap"><hr className="t2-rule" /></div>
            <div className="t2-section" id="t2-projects">
              <SectionHeader label="Work" title="Selected Projects" />
              <div style={{ borderTop: "1px solid #DDD5C8" }}>
                {projects.map((proj, i) => <ProjectRow key={i} proj={proj} index={i} />)}
              </div>
            </div>
          </>
        )}

        {/* ══ SKILLS ═══════════════════════════════════════════════════════════ */}
        {hasSkills && (
          <>
            <div className="t2-rule-wrap"><hr className="t2-rule" /></div>
            <div className="t2-section" id="t2-skills">
              <SectionHeader label="Expertise" title="Skills & Tools" />
              <SkillsGrid skills={skills} />
            </div>
          </>
        )}

        {/* ══ WORK STYLE ═══════════════════════════════════════════════════════ */}
        {hasWorkStyle && workStyleCards.length > 0 && (
          <>
            <div className="t2-rule-wrap"><hr className="t2-rule" /></div>
            <div className="t2-section" id="t2-workstyle">
              <SectionHeader label="Approach" title="How I Work" />
              <div className="t2-workstyle-grid">
                {workStyleCards.map((card, i) => (
                  <WorkStyleCard key={i} card={card} index={i} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══ EDUCATION ════════════════════════════════════════════════════════ */}
        {hasEducation && (
          <>
            <div className="t2-rule-wrap"><hr className="t2-rule" /></div>
            <div className="t2-section" id="t2-education">
              <SectionHeader label="Academic" title="Education" />
              <div style={{ borderTop: "1px solid #DDD5C8" }}>
                {education.map((edu, i) => <EduRow key={i} edu={edu} index={i} />)}
              </div>
            </div>
          </>
        )}

        {/* ══ CERTIFICATIONS ═══════════════════════════════════════════════════ */}
        {hasCerts && (
          <>
            <div className="t2-rule-wrap"><hr className="t2-rule" /></div>
            <div className="t2-section" id="t2-certifications">
              <SectionHeader label="Credentials" title="Certifications" />
              <div className="t2-cert-grid">
                {certifications.map((cert, i) => <CertCard key={i} cert={cert} index={i} />)}
              </div>
            </div>
          </>
        )}

        {/* ══ LANGUAGES ════════════════════════════════════════════════════════ */}
        {hasLanguages && (
          <>
            <div className="t2-rule-wrap"><hr className="t2-rule" /></div>
            <div className="t2-section" id="t2-languages">
              <SectionHeader label="Communication" title="Languages" />
              <div style={{ maxWidth: 520 }}>
                {languages.map((l, i) => (
                  <LangBar key={i} language={l.language} proficiency={l.proficiency} index={i} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══ INTERESTS ════════════════════════════════════════════════════════ */}
        {hasInterests && (
          <>
            <div className="t2-rule-wrap"><hr className="t2-rule" /></div>
            <div className="t2-section" id="t2-interests">
              <SectionHeader label="Personal" title="Interests & Passions" />
              <InterestCloud interests={interests} />
            </div>
          </>
        )}

        {/* ══ LOOKING FOR ══════════════════════════════════════════════════════ */}
        {hasLookingFor && (
          <div className="t2-looking-section" id="t2-looking-for">
            <div className="t2-looking-inner">
              <div className="t2-looking-label">What's Next</div>
              <p className="t2-looking-text">{lookingFor}</p>
            </div>
          </div>
        )}

        {/* ══ FOOTER CONTACT STRIP ═════════════════════════════════════════════ */}
        <div className="t2-footer">
          <div className="t2-section" style={{ textAlign: "center", padding: "88px 52px" }}>
            {/* Big italic CTA */}
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontStyle: "italic", color: "#1A1A1A",
              lineHeight: 1.2, marginBottom: 16,
            }}>
              Let's build something<br />
              <span style={{ color: "var(--t2-accent)" }}>worth remembering.</span>
            </div>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15, color: "#8A8078",
              lineHeight: 1.7, marginBottom: 40,
            }}>
              Open to new opportunities, collaborations, and interesting conversations.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              {personal?.email && (
                <a href={`mailto:${personal.email}`}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14, fontWeight: 700, color: "#FFFCF7",
                    background: "var(--t2-accent)",
                    padding: "17px 38px", borderRadius: 100,
                    textDecoration: "none",
                    boxShadow: "0 4px 28px rgba(45,106,79,0.3)",
                    transition: "transform 0.25s, box-shadow 0.25s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-3px)"
                    e.currentTarget.style.boxShadow = "0 10px 36px rgba(45,106,79,0.38)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 28px rgba(45,106,79,0.3)"
                  }}
                >✉ {personal.email}</a>
              )}
              {personal?.linkedinUrl && (
                <a href={personal.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14, fontWeight: 700, color: "#3A3530",
                    padding: "17px 38px", borderRadius: 100,
                    border: "1.5px solid #C8C0B6", textDecoration: "none",
                    transition: "border-color 0.25s, color 0.25s, transform 0.25s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--t2-accent)"
                    e.currentTarget.style.color = "var(--t2-accent)"
                    e.currentTarget.style.transform = "translateY(-3px)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#C8C0B6"
                    e.currentTarget.style.color = "#3A3530"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >LinkedIn ↗</a>
              )}
            </div>

            <div style={{
              marginTop: 52,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, color: "#B8B0A6", letterSpacing: "0.07em",
            }}>
              Built with PortfolioAI · {personal?.fullName}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
